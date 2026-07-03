import React, { useState } from 'react'

import {useNavigate} from 'react-router-dom'
import "../styles/SignUp.css"
import axios from 'axios'
const SignUp = () => {
  const navigate = useNavigate();
  const[profilePicture,setProfilePicture]=useState(null)
  const[error,setError]=useState("")
  const[loading,setLoading]=useState(false)
  const[success, setSuccess] = useState("")
  const[formData,setFormData]=useState({
    fullName:"",
    userName:"",
    email:"",
    password:""
  })

  const handleProfilePicture=(e)=>{
    setProfilePicture(e.target.files[0])
  }

  const handleChange=(e)=>{
    setFormData((prev)=>({
      ...prev,
      [e.target.name]:e.target.value
    }))
  }

  const handleSubmit=async(e)=>{
    e.preventDefault();
    setError("")
    setSuccess("")

    if(!profilePicture){
      setError("Please select a profile picture")
      return;
    }

    try {
      setLoading(true)
      const data=new FormData();
      data.append("fullName",formData.fullName);
      data.append("userName",formData.userName);
      data.append("email",formData.email);
      data.append("password",formData.password);
      data.append("profilePicture",profilePicture);

      const response=await axios.post('http://localhost:8000/api/v1/users/register',data,

        {
          headers:{
            "Content-Type":"multipart/form-data",
          }
        }


      )
      setSuccess(response.data.message);
      setTimeout(() => {
  navigate("/login");
}, 1500);
      setFormData({
        fullName:"",
        userName:"",
        email:"",
        password:""
      })

      setProfilePicture(null)

    } 
    catch (err) {
      setError(err.response?.data.message || "Something went wrong!!")
    }
    finally{
      setLoading(false)
   
    }

  }

  return (
    <div className='container-signUp'>
      {error && (<p className="errorMessage">{error}</p>)}
      {success && (
      <p className="successMessage">
        {success}
      </p>
      
    )}
      <form onSubmit={handleSubmit}>
        <input type="text" name='fullName' value={formData.fullName} onChange={handleChange} placeholder='Enter your full name' required/>
        <input type="text" name='userName' value={formData.userName} onChange={handleChange} placeholder='Enter your username' required/>
        <input type="email" name='email' value={formData.email} onChange={handleChange} placeholder='Enter your mail' required/>
        <input type="password" name='password' value={formData.password} onChange={handleChange} placeholder='Enter your password' required/>
        <input type="file" accept='image/*' onChange={handleProfilePicture}  name="file" required/>
      <button type='submit'>{loading?"Creating Account...":"Sign Up"}</button>
      </form>
    </div>
  )
}

export default SignUp
