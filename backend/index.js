import express from 'express'
import dotenv from 'dotenv'
import connectDB from './config/db.js';
import recipeRouter from './routes/recipe.routes.js';
import userRouter from './routes/user.routes.js';
import cookieParser from 'cookie-parser'
import cors from 'cors'

dotenv.config();
connectDB();
const app=express();
const port=process.env.PORT;
app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cookieParser())
app.use(cors({origin:"https://bite-xp.vercel.app/",methods:['GET','POST','PUT','DELETE'],credentials:true}))
app.use("/api/recipe",recipeRouter)
app.use("/api/auth",userRouter)
app.get("/",(req,res)=>{
    res.send("Hi");
})
app.listen(port,()=>{
    console.log("App is listening on ",port)
})
