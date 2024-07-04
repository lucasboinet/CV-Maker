import express, {Express}  from 'express';
import cors from 'cors';
import { connectDB } from './config/db';
import dotenv from 'dotenv';
import fileUpload from 'express-fileupload';

import users from './routes/users';
import projects from './routes/projects';
import auth from './routes/auth';

dotenv.config();

const app: Express= express();
const cookieParser = require("cookie-parser");

connectDB();

app.use(cookieParser());

app.use(express.json());
app.use(cors({
    origin: [process.env.ORIGIN as string],
    methods: ["GET","POST", "DELETE", "PUT"],
    credentials: true
}));
app.use(fileUpload());
app.use('/auth',auth)
app.use('/users',users);
app.use('/projects', projects);

const port = process.env.PORT || 3030;

app.listen(port, () => console.log(`Server running on http://localhost:${port}`));