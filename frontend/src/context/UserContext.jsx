import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import dotenv from 'dotenv'

dotenv.config()

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [recipe,setRecipe]=useState({})
  const serverurl=import.meta.env.VITE_RENDER_URL

  const fetchProfile = async () => {
    const res = await axios.get(`${serverurl}/api/auth/profile`, { withCredentials: true });
    setUser(res.data);
  };

  const fetchRecipes = async () => {
    const res = await axios.get(`${serverurl}/api/recipe`);
    setRecipes(res.data);
  };

  const completeRecipe = async (recipeId) => {
    const res = await axios.post(`${serverurl}/api/auth/update`, { recipeId }, { withCredentials: true });
    setUser(res.data); 
  };
  
  useEffect(() => {
    fetchProfile();
    fetchRecipes();
  }, []);

  return (
    <AppContext.Provider value={{ user, recipes, completeRecipe ,serverurl}}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
