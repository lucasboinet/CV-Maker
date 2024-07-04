import express, {Request, Response} from 'express';
import User from '../models/User';

const router = express.Router();

router.get('/', (req: Request, res: Response) => {
    
    res.send("<h1>All good buddy</h1>");

    User.find()
        .then((users) => res.status(200).json({users, success: true}))
        .catch((err) => res.status(400).json({success: false}));
})


export default router;