import express from 'express'
import { addRecipe, getRecipe, getRecipes} from '../controllers/recipeController.js'

const recipeRouter=express.Router()

recipeRouter.get("/",getRecipes)
recipeRouter.post("/",addRecipe)
recipeRouter.get("/:id",getRecipe)

export default recipeRouter;