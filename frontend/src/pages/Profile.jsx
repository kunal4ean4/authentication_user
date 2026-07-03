import React, { useState, useEffect } from "react";
import "../styles/Profile.css";
import axios from 'axios'
import { useNavigate } from "react-router-dom";
const Profile = () => {
  const [data, setdata] = useState(null);
  const[loading,setLoading] = useState(false)
  useEffect(() => {
    
    const fetchdata = async () => {
      const responseData = await fetch(
        "http://localhost:8000/api/v1/users/currentUser",
        {
          credentials: "include",
        },
      );
      const result = await responseData.json();
      setdata(result.data);
      console.log(result.data);
    };



    fetchdata();
  }, []);
  const navigate = useNavigate();

  const handleLogout=async()=>{
    try {
      setLoading(true)
      await axios.post(
        "http://localhost:8000/api/v1/users/logout",{},{withCredentials:true}
      );
      navigate("/login")
      
      
    } catch (error) {
      console.log(error)
    }
    finally{
      setLoading(false)
    }
  }
  return (
    <div className="profileContainer">
      {data && (
        <div className="profileCard">
          <div className="profileHeader">
            <img
              src={data.profilePicture}
              alt="profile"
              className="profileImage"
            />

            <div>
              <h1>{data.fullName}</h1>
            </div>
          </div>

          <div className="profileInfo">
            <div className="infoBox">
              <span>Username</span>
              <h3>{data.userName}</h3>
            </div>

            <div className="infoBox">
              <span>Email</span>
              <h3>{data.email}</h3>
            </div>

            <div className="profileActions">
              <button onClick={()=>navigate('/changeCurrentPassword')} className="changePasswordBtn">Change Password</button>

            
                <button onClick={handleLogout} className="logoutBtn">{loading?"LoggingOut...":"Logout"}</button>
            
            </div>

            {/* <div className="infoBox">
            <span>Account Created</span>
            <h3>18 June 2026</h3>
          </div> */}
          </div>
        </div>
      )}
    </div>
  );
};

export default Profile;
