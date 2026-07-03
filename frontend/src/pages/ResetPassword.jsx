import React, { useState } from "react";
import { useParams,useNavigate } from "react-router-dom";
import "../styles/ResetPassword.css";
import axios from "axios";

const ResetPassword = () => {
    const navigate = useNavigate()
  const { token } = useParams();

  const [formData, setFormData] = useState({
    newPassword: "",
    confirmPassword: "",
  });

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    if (formData.newPassword !== formData.confirmPassword) {
  setTimeout(() => {
  navigate("/login");
}, 1500);
  return;
}
   try {
    const response = await axios.post(
       `http://localhost:8000/api/v1/users/reset-password/${token}`,
       {
         newPassword: formData.newPassword,
         confirmPassword: formData.confirmPassword,
       },
     );
     setFormData({
  newPassword: "",
  confirmPassword: "",
});
     alert(response.data.message);
     navigate("/login");
   } catch (error) {
    alert(error.response?.data?.message || "Something went wrong");
   }
  };
  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };
  console.log(token);

  return (
    <div className="resetContainer">
      <form className="resetCard" onSubmit={handleOnSubmit}>
        <h1>Reset Password</h1>

        <p className="subtitle">Create a new password for your account.</p>

        <div className="inputGroup">
          <label>New Password</label>
          <input
            type="password"
            name="newPassword"
            placeholder="Enter new password"
            value={formData.newPassword}
            onChange={handleChange}
            required
          />
        </div>

        <div className="inputGroup">
          <label>Confirm Password</label>
          <input
            type="password"
            name="confirmPassword"
            placeholder="Confirm new password"
            value={formData.confirmPassword}
            onChange={handleChange}
            required
          />
        </div>

        <button type="submit">Reset Password</button>
      </form>
    </div>
  );
};

export default ResetPassword;
