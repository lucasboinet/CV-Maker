const User = require("../models/User");
const jwt = require('jsonwebtoken');
require('dotenv').config();

const authorization = (req: any, res: any, next: any) => {
  const token = req.cookies.access_token;
  try {
    if (!token) {
      return res.status(401).json({success: false,msg:"Not connected"});
    }
     
      jwt.verify(token, process.env.AUTH_SECRET_TOKEN, (err: any, result: any) => {
        if(err && err.message.includes('expired')){
          return res.status(403).json({success:false,msg:"Token expired"})
        }
        req.user=result;
        return next();
      });
    } catch(err: any) {
      
      return res.status(500).json({success: false,msg:"Une erreur est survenue"});
    }
}

export default authorization;