import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";

const AppContext = createContext();

export const AppProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [recipes, setRecipes] = useState([]);
  const [recipe,setRecipe]=useState({}); // Initialize to empty object for consistency
  const [isAuthReady, setIsAuthReady] = useState(false); // New state to track if initial auth check is done
  
  // CRITICAL FIX: Add fallback URL to prevent crashes if VITE_RENDER_URL is undefined
  // The error (warning) is caused by the environment, but if the value is missing,
  // all API calls will fail silently, leading to the sign-in redirect loop.
  const serverurl = import.meta.env.VITE_RENDER_URL || "http://localhost:8000"; 

  // --- CRITICAL: Added try/catch and setIsAuthReady ---
  const fetchProfile = async () => {
    try {
      // The middleware populates the user object based on the cookie
      console.log(serverurl)
      const res = await axios.get(`${serverurl}/api/auth/profile`, { withCredentials: true });
      setUser(res.data);
    } catch (error) {
      // Expected to catch 401 Unauthorized when no valid cookie is present
      if (error.response && error.response.status === 401) {
        setUser(null); // Explicitly ensure user is null
        console.log("No active session found.");
      } else {
        console.error("Error fetching profile:", error);
      }
    } finally {
      setIsAuthReady(true); // Signal that the initial check is complete
    }
  };

  const fetchRecipes = async () => {
    try {
        const res = await axios.get(`${serverurl}/api/recipe`);
        setRecipes(res.data);
    } catch (error) {
        console.error("Error fetching recipes:", error);
    }
  };

  const completeRecipe = async (recipeId) => {
    try {
        // You are sending the completed recipe back from the server in the response,
        // so we update the local user state with the new data.
        const res = await axios.post(`${serverurl}/api/auth/update`, { recipeId }, { withCredentials: true });
        setUser(res.data); 
    } catch (error) {
        console.error("Error completing recipe:", error);
        // Optional: Re-fetch profile if update failed but user is still logged in
        // fetchProfile();
    }
  };
  
  useEffect(() => {
    // Run auth check only on initial mount
    fetchProfile(); 
    fetchRecipes();
  }, []);

  return (
    <AppContext.Provider 
      value={{ 
        user, 
        setUser, // <--- EXPOSED: Required for sign-in/sign-out logic
        fetchUserProfile: fetchProfile, // <--- EXPOSED: Required for sign-in redirect logic
        isAuthReady, // <--- EXPOSED: Required for protecting initial routes
        recipes, 
        completeRecipe, 
        serverurl
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useAppContext = () => useContext(AppContext);
