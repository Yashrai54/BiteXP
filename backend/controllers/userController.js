import userModel from "../models/user.model.js"
import bcrypt, { genSaltSync } from "bcryptjs";
import jwt from 'jsonwebtoken'
import recipeModel from "../models/recipe.model.js";

export const handleSignup=async(req,res)=>{
    try {
        const {name,email,password}=req.body;
        const user=await userModel.findOne({email});

        if(user){
            return res.status(400).json({"message":"email already registered"})
        }
        const hashedPassword=bcrypt.hashSync(password,genSaltSync(10));

        const registereduser=new userModel({
            name:name,
            email:email,
            password:hashedPassword
        })
        await registereduser.save();
        return res.status(201).json({"message":"user registered successfully"})
    } catch (error) {
        return res.status(400).json({"message":"Unknown Error Occurred"})
    }
}
export const handleSignIn=async(req,res)=>{
    try {
        const {email,password}=req.body;

        const user=await userModel.findOne({email});
        if(!user){
            return res.status(400).json({"message":"Email or password Incorrect"});
        }
        const comparepassword=await bcrypt.compare(password,user.password)
        if(!comparepassword){
             return res.status(400).json({"message":"Email or password Incorrect"});
        }
        const session = jwt.sign(
  { id: user._id, name: user.name, email: user.email },
  process.env.JWT_SECRET_KEY,
  { expiresIn: "10d" }
);
       res.cookie("token", session, {
  httpOnly: true,
  maxAge: 10*24*60*60*1000,
  secure: true,      // must be true for HTTPS
  sameSite: 'None'   // allows cross-site cookies
});

    } catch (error) {
        console.log(error)
        return res.status(500).json({"message":"Server Error"})
    }
}
export const handleRecipeCompletion=async(req,res)=>{
    const user=await userModel.findById(req.user._id)
    const {recipeId}=req.body;
    const recipe=await recipeModel.findById(recipeId)
    if(!user.completedRecipes.includes(recipeId)){
        user.completedRecipes.push(recipeId)
        if (!recipe) return res.status(404).json({ message: "Recipe not found" });
        user.xp+=recipe.xpReward;
        const badgeThresholds = [
  { xp: 50, badge: "Novice Chef" },
  { xp: 100, badge: "Pro Chef" },
  { xp: 200, badge: "Master Chef" }
];

badgeThresholds.forEach(({ xp, badge }) => {
  if (user.xp >= xp && !user.badges.includes(badge)) {
    user.badges.push(badge);
  }
});
        await user.save()
    }
    return res.json({ xp: user.xp, badges: user.badges, completedRecipes: user.completedRecipes });
}
export const handleGetProfile=async(req,res)=>{
    try{
    const user=await userModel.findById(req.user._id).populate("completedRecipes");
    if(!user) return res.status(400).json({"message":"user not found"})

        const userObj = user.toObject(); // converts Mongoose doc to plain JS object
res.json({
  name: userObj.name,
  email: userObj.email,
  xp: userObj.xp,
  badges: userObj.badges || [],              // plain array
  completedRecipes: userObj.completedRecipes.map(r => r._id.toString()),
  badgeThresholds: [{xp: 50, badge: "Novice Chef" },
  { xp: 100, badge: "Pro Chef" },
  { xp: 200, badge: "Master Chef" }]
});

    }
    catch(error){
        console.log(error)
        return res.status(500).json({"message":"Server Error"})
    }
}
