import express, { urlencoded } from 'express'
import morgan from 'morgan'
import userRouter from "./routes/userRoutes.js"
import projectRouter from "./routes/projectRoutes.js"
import aiRouter from "./routes/aiRoutes.js";
import cookieParser from 'cookie-parser';
import cors from 'cors';


const app= express();

//middlewares 
app.use(cors());
app.use(express.json());
app.use(cookieParser());
app.use(express.urlencoded({extended:true}))
app.use(morgan('dev'))
app.use('/user' , userRouter )
app.use('/project' , projectRouter);
app.use('/ai' , aiRouter);

app.get('/' , (req, res)=>{
  res.send("hello world")
});


export default app;