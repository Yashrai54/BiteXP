import mongoose from "mongoose";

const userSchema=new mongoose.Schema({
    name:{type:String,required:true},
    email:{type:String,required:true,unique:true},
    password:{type:String,required:true},
    xp:{type:Number,default:0},
    badges:{types:[String],default:[]},
    completedRecipes: [{ type: mongoose.Schema.Types.ObjectId, ref: "recipe" }]
},{timestamps:true})

const userModel=mongoose.model("user",userSchema);
export default userModel;