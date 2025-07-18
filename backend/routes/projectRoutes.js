import express from "express";
import authmiddleware from "../middlewares/auth.js";
import { createProject } from "../controllers/projectController.js";
import { getProject } from "../controllers/projectController.js";
import { addUser } from "../controllers/projectController.js";
import {addfiletree} from "../controllers/projectController.js";


const projectRouter = express.Router();

projectRouter.post("/createProject" , authmiddleware , createProject  );
projectRouter.post("/getproject" , authmiddleware , getProject );
projectRouter.post("/adduser" , authmiddleware , addUser );
projectRouter.post("/addFiletree" ,  addfiletree);

export default projectRouter; 



