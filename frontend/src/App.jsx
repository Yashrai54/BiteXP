import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import Home from './components/Home';
import Signup from './components/Signup.jsx';
import SignIn from './components/SignIn.jsx';
import RecipeList from './components/RecipeList.jsx';
import RecipeDetail from './components/RecipeDetail.jsx';
import { useAppContext } from './context/UserContext.jsx';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAppContext();

  if (loading) return <div>Loading...</div>; // wait until context is ready
  return user ? children : <Navigate to="/signin" replace />;
};

const App = () => {
  return (
    <Routes>
      <Route path="/signin" element={<SignIn />} />
      <Route path="/signup" element={<Signup />} />

      {/* Protected routes */}
      <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
      <Route path="/recipe" element={<ProtectedRoute><RecipeList /></ProtectedRoute>} />
      <Route path="/recipe/:id" element={<ProtectedRoute><RecipeDetail /></ProtectedRoute>} />
    </Routes>
  );
};

export default App;
