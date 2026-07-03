import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import "../styles/Login.css";
import axios from "axios";

const Login = () => {
  const navigate=useNavigate()
  const [loginUserOrEmail, setLoginUserOrEmail] = useState("");
  const [password, setPasseord] = useState("");
  const[sucess,setSucess]=useState(false);
  const[error,setError]=useState(false);
  const[loading,setLoading]=useState(false)

  const handleLoginOnChange = (e) => {
    setLoginUserOrEmail(e.target.value);
  };
  const handlePasswordOnChange = (e) => {
    setPasseord(e.target.value);
  };

  const loginData=loginUserOrEmail.includes('@')?{email:loginUserOrEmail,password}:{userName:loginUserOrEmail,password}

  const handleOnLoginSubmit=async(e)=>{
    e.preventDefault();
    setSucess("")
    setError("")
    try {
      setLoading(true)
      // {withCredentials:true} browser accept the access and refresh cookies
      const loginResponse=await axios.post('http://localhost:8000/api/v1/users/login',loginData,{withCredentials:true} )
      setSucess(loginResponse.data.message)
      setLoginUserOrEmail("");
      setPasseord("");
      setTimeout(()=>{
        navigate('/')
      },1500)
      
    } catch (err) {
      setError(err.response.message || "Failed while loggedin")
      
    }finally{
      setLoading(false)
    }

  }
  return (
    <div className="container">
      {error && (<h2>{error}</h2>)}
      {sucess && (<h2>{sucess}</h2>)}
      <form onSubmit={handleOnLoginSubmit} className="loginForm">
        <h1 className="loginTitle">Login to your account</h1>

        <input
          type="text"
          value={loginUserOrEmail}
          onChange={handleLoginOnChange}
          placeholder="Enter your email or username"
        />

        <input
          type="password"
          value={password}
          onChange={handlePasswordOnChange}
          placeholder="Enter your password"
        />

        <div className="loginActions">
          <Link to="/forgotPassword">Forgot Password?</Link>
        </div>

        <button type="submit">{loading?"Logging In...": "Login"}</button>

        <p className="loginFooter">
          Don't have an account? <Link to="/signup">Sign Up</Link>
        </p>
      </form>
    </div>
  );
};

export default Login;
