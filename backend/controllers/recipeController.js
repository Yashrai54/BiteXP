import recipeModel from "../models/recipe.model.js";

export const getRecipes = async (req, res) => {
  try {
    const recipes = await recipeModel.find();
    res.json(recipes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
export const getRecipe=async(req,res)=>{
  try{
  const {id}=req.params;
    const recipe = await recipeModel.findById(id);
      res.json({
      title: recipe.title,
      ingredients: recipe.ingredients,  // array
      steps: recipe.steps,              // array
    });
  }
    catch(error){
      res.status(500).json({ error: error.message });
    }
}
export const addRecipe = async (req, res) => {
  try {
    const recipe = new recipeModel(req.body);
    await recipe.save();
    res.status(201).json(recipe);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};