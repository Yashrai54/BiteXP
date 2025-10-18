import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [recipe, setRecipe] = useState({});
  const serverurl = import.meta.env.VITE_RENDER_URL; // VITE_ prefix required

  const fetchProfile = async () => {
    try {
  const res = await axios.post(`${serverurl}/api/auth/signin`, form, { withCredentials: true });
  setUser(res.data.user);
  navigate("/");
} catch (err) {
  setMessage(err.response?.data?.message || "Sign-in failed");
} finally {
  setIsLoading(false);
}
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
    <AppContext.Provider value={{ user, recipes, completeRecipe, serverurl }}>
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
