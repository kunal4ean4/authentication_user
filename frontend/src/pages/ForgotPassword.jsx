import React, { useState } from 'react'
import '../styles/ForgotPassword.css'
import axios from 'axios'
const ForgotPassword = () => {
  const[email,setEmail] = useState("")
    const handleOnSubmit=async(e)=>{
        e.preventDefault()
        try {
         await axios.post(`http://localhost:8000/api/v1/users/forgot-password`,{email})
          alert("Password reset link sent successfully!")
          setEmail("")
        } catch (error) {
          alert(error.response?.data?.message || "Something went wrong")
        }
        
    }
  return (
    <div className="forgotContainer">
      <form className="forgotCard" onSubmit={handleOnSubmit}>
        <h1>Forgot Password</h1>

        <p className="forgotText">
          Enter registered email address and we'll send you a password
          reset link.
        </p>

        <input
          type="email"
          placeholder="Enter your email"
          value={email}
          onChange={(e)=>setEmail(e.target.value)}
          required
        />

        <button type="submit">
          Send Reset Link
        </button>
      </form>
    </div>
  )
}

export default ForgotPassword
