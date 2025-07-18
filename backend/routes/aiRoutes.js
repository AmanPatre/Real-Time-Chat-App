import { Router } from "express";
import { aiController } from "../controllers/aiController.js"
const aiRouter = Router();

aiRouter.post('/getResult' , aiController )

export default aiRouter