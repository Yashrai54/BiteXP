import express from 'express'
import { handleSignup ,handleSignIn, handleRecipeCompletion} from '../controllers/userController.js';
import handleCurrentUser from '../middlewares/isAuth.js';
import { handleGetProfile } from '../controllers/userController.js';


const userRouter=express.Router();

userRouter.post("/signup",handleSignup)
userRouter.post("/signin",handleSignIn)
userRouter.get("/profile",handleCurrentUser,handleGetProfile)
userRouter.post("/update",handleCurrentUser,handleRecipeCompletion)

export default userRouter