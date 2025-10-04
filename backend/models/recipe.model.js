import mongoose from "mongoose";

const recipeSchema=new mongoose.Schema({
    title:{type:String,required:true},
    ingredients:{type:[String],required:true},
    steps:{type:[String],required:true},
    difficulty:{type:String,enum:["easy","medium","hard"],default:"easy"},
    xpReward:{type:Number,default:10}
},{timestamps:true})

const recipeModel=mongoose.model("recipe",recipeSchema)
export default recipeModel;