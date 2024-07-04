import express, {Request, Response} from 'express';
import User from '../models/User';
import authorization from '../middleware/authorization'

require('dotenv').config();

const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const router = express.Router();

function generateRefreshToken(user: any) {
    return jwt.sign(user, process.env.REFRESH_TOKEN_SECRET, { expiresIn: '7d' });
}

function generateToken(user: any) {
    return jwt.sign(user, process.env.AUTH_SECRET_TOKEN, {expiresIn: "10s"});
}

/**
 @route POST auth/login
 @description login user
 @access Public
 */

router.post('/login', (req: Request, res: Response) => {
  let auth = req.body.auth;
  let password = req.body.password;
  
  User.findOne({ $or:[{email: auth}, {username:auth}] })
    .then(user => {
      if(!user) {
        res.status(400).json({ success: false, message: 'Incorrect email or password'})
        return;
      }
      bcrypt.compare(password, user.password, (err: any, isMatch: any) => {
        if(err) throw err;
        if(isMatch) {
          let {password,jwtRefreshToken, ...userObject} = user._doc;
          const token = generateToken(userObject)
          const refreshToken = generateRefreshToken(userObject)
          User.updateOne({$or:[{email: auth}, {username:auth}] }, {jwtRefreshToken: refreshToken}).then( () =>{
              res.cookie("access_token", token, {
              httpOnly: true,
              }).cookie("refresh_access_token", refreshToken, {
                  httpOnly: true,
                  })
              .status(200)
              .json({user:userObject, message: "Logged in successfully 😊 👌" });
            
            }
          ).catch((err: any)=>{
            res.status(500).send(err)
          })
          
        } else {
          res.status(401).json({ success: false, message: 'Incorrect email or password' })
        }
      })
    })

    
})

/**
    @route POST auth/register
    @description register user
    @access Public
*/
router.post('/register', (req, res) => {
  
    let { firstname, lastname, username, email, password, confirmPassword } = req.body;
    let errors: any = [];

    if (!firstname || !lastname || !username || !email || !password || !confirmPassword) {
      
        errors.push({ msg: 'Please enter all fields' });
    }

    if(!/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/.test(email)) {
        errors.push({msg: 'Email is not in a valid format'});
    }

    if (password !== confirmPassword) {
      
        errors.push({ msg: 'Passwords do not match' });
    }

    if (password.length < 6) {
        errors.push({ msg: 'Password must be at least 8 characters' });
    }

    if (errors.length > 0) {
        res.send({ success: false, errors: errors })
    } else {
        User.findOne({$or : [{ email: email }, {username: username}]}).then(user => {
        if (user) {
            errors.push({ msg: 'Email or username already registered' });
            res.send({ success: false, errors: errors })
        } else {
            const newUser = new User({
            firstname,
            lastname,
            username,
            email,
            password
            });

            bcrypt.genSalt(10, (err: any, salt: any) => {
            bcrypt.hash(newUser.password, salt, (err: any, hash: any) => {
                if (err) throw err;
                newUser.password = hash;
                newUser.save()
                .then(() => {
                  
                    res.json({ success: true, errors: errors })
                })
            });
            });
        }
        });
    }
})


  
/**
 @route POST auth/refreshToken
 @description refreshToken user
 @access Public
 */

 router.get('/refreshToken', (req: Request, res: Response) => {
    
    const token = req.cookies.refresh_access_token;
    
    if (!token) return res.status(401).json({success:false,msg:"No token"})

    jwt.verify(token, process.env.REFRESH_TOKEN_SECRET, (err: any, result: any) => {
      
      if (err) {
        return res.status(500).json({refreshToken: null,err})
      }
      
  
      // TODO: Check en base que l'user est toujours existant/autorisé à utiliser la plateforme      
      User.findOne({ _id: result._id })
      .then(user => {
        
        
        if(!user.jwtRefreshToken || (user.jwtRefreshToken !== token)){
          return res.status(500).send("Refresh Token is not matching with base")
        } 
        delete result.exp;
        delete result.iat;
        const refreshedToken = generateToken(result);
        return res
              .cookie("access_token", refreshedToken, {
              httpOnly: true,
              })
              .status(201)
              .json({ message: "Logged in successfully 😊 👌 (refreshed)" });
        });
      });
      
      // let {password,iat,exp, ...userObject} = user;
      
      
  });


  /**
 @route GET auth/logout
 @description logout user
 @access Public
 */

 router.get('/logout', (req: Request, res: Response) => {
   
    return res
      .clearCookie("access_token")
      .clearCookie("refresh_access_token")
      .status(200)
      .json({ message: "Successfully logged out 😏 🍀" });
  });

   /**
 @route GET auth/isAuth
 @description get user
 @access Public
 */

  router.get("/isAuth", authorization, (req: any, res: any) => {
    return res.json({ user: req.user });
  });

  
export default router;
