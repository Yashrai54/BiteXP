import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup.jsx';
import SignIn from './components/SignIn.jsx';
import RecipeList from './components/RecipeList.jsx';
import RecipeDetail from './components/RecipeDetail.jsx';
import { useAppContext } from './context/UserContext.jsx';

// Define a helper component for protected route

const App = () => {
  // NOTE: useAppContext is now called inside ProtectedRoute and Home/RecipeList components
  // It doesn't need to be called here unless you were using 'user' for App-level logic
   const {user}=useAppContext()
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Public/Protected Home Route (if user is authenticated, it renders Home, otherwise SignIn) */}
      {/* The original Home implementation was okay for this specific path, but let's use the ProtectedRoute concept */}
      <Route path="/" element={user?<Home/>:<SignIn></SignIn> } />

      {/* Protected Routes */}
      <Route path="/recipe" element={<RecipeList/>} />
      <Route path="/recipe/:id" element={<RecipeDetail />}/>

      {/* Optional: Add a catch-all route for 404s or redirecting bad paths */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};

export default App;
