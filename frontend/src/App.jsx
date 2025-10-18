import React from 'react'
import {Route,Routes} from 'react-router-dom'
import Home from './components/Home'
import Signup from './components/Signup.jsx'
import SignIn from './components/SignIn.jsx'
import RecipeList from './components/RecipeList.jsx'
import RecipeDetail from './components/RecipeDetail.jsx'
import { useAppContext } from './context/UserContext.jsx'
const App = () => {
   const ProtectedRoute = ({ children }) => {
  const { user } = useAppContext();
  return user ? children : <SignIn />;
};
  return (
    <div>
      <Routes>
          <Route path='/' element={<ProtectedRoute><Home/></ProtectedRoute>}></Route>
          <Route path='/signup' element={<Signup></Signup>}></Route>
          <Route path='/signin' element={<SignIn></SignIn>}></Route>
          <Route path='/recipe' element={<RecipeList></RecipeList>}></Route>
          <Route path='/recipe/:id' element={<RecipeDetail></RecipeDetail>}></Route>
      </Routes>
    </div>
  )
}

export default App
