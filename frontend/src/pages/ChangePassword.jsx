import React, { useState } from "react";
import "../styles/ChangePassword.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
const ChangePassword = () => {
  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
const navigate=useNavigate()
  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.newPassword !== formData.confirmPassword){
        alert("Passwords do not match");
    return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8000/api/v1/users/changeCurrentPassword",
        formData,
        { withCredentials: true },
      );
      alert(response.data.message);
      setFormData({
         oldPassword: "",
    newPassword: "",
    confirmPassword: "",
      })
      navigate('/')

      
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div className="changePasswordContainer">
      <form className="changePasswordCard" onSubmit={handleSubmit}>
        <h1>Change Password</h1>

        <input
          type="password"
          name="oldPassword"
          placeholder="Enter current password"
          value={formData.oldPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="newPassword"
          placeholder="Enter new password"
          value={formData.newPassword}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="confirmPassword"
          placeholder="Confirm new password"
          value={formData.confirmPassword}
          onChange={handleChange}
          required
        />

        <button type="submit">Update Password</button>
      </form>
    </div>
  );
};

export default ChangePassword;
