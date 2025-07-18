import express from 'express'
import  {signUp} from "../controllers/userController.js"
import { login } from '../controllers/userController.js';
import { profile } from '../controllers/userController.js';
import authmiddleware from './../middlewares/auth.js';
import { logout } from '../controllers/userController.js';

const userRouter = express.Router();

userRouter.post("/signup" , signUp );
userRouter.post("/login" , login );
userRouter.post("/profile" ,profile );
userRouter.post("/logout" , authmiddleware , logout );

export default userRouter