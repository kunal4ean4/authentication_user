import './App.css'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import Profile from './pages/Profile'
import { BrowserRouter, Routes,Route } from 'react-router'
import ChangePassword from './pages/ChangePassword'
import ForgotPassword from './pages/ForgotPassword'
import ResetPassword from './pages/ResetPassword'

function App() {

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Home/>}/>
        <Route path='/login' element={<Login/>}/>
        <Route path='/signup' element={<SignUp/>}/>
        <Route path='/profile' element={<Profile/>}/>
        <Route path='/changeCurrentPassword' element={<ChangePassword/>}/>
        <Route path='/forgotPassword' element={<ForgotPassword/>}/>
        <Route path='/reset-password/:token' element={<ResetPassword/>}/>
      </Routes>
    </BrowserRouter>
  )
}

export default App
