import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup.jsx';
import SignIn from './components/SignIn.jsx';
import RecipeList from './components/RecipeList.jsx';
import RecipeDetail from './components/RecipeDetail.jsx';
import { useAppContext } from './context/UserContext.jsx';

// Define a helper component for protected routes
const ProtectedRoute = ({ element: Element, ...rest }) => {
  const { user } = useAppContext();
  // If user is NOT authenticated, navigate them to the signin page
  return user ? Element : <Navigate to="/signin" replace />;
};

const App = () => {
  // NOTE: useAppContext is now called inside ProtectedRoute and Home/RecipeList components
  // It doesn't need to be called here unless you were using 'user' for App-level logic

  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />
      
      {/* Public/Protected Home Route (if user is authenticated, it renders Home, otherwise SignIn) */}
      {/* The original Home implementation was okay for this specific path, but let's use the ProtectedRoute concept */}
      <Route path="/" element={<ProtectedRoute element={<Home />} />} />

      {/* Protected Routes */}
      <Route path="/recipe" element={<ProtectedRoute element={<RecipeList />} />} />
      <Route path="/recipe/:id" element={<ProtectedRoute element={<RecipeDetail />} />} />

      {/* Optional: Add a catch-all route for 404s or redirecting bad paths */}
      {/* <Route path="*" element={<Navigate to="/" replace />} /> */}
    </Routes>
  );
};

export default App;
