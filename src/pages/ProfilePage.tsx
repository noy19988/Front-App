import React from "react";
import { useNavigate } from "react-router-dom";
import "../styles/profile.css";


const ProfilePage: React.FC = () => {
  const navigate = useNavigate();
  const username = "DANA"; 

  const handleLogout = () => {
    console.log("User logged out");
    navigate("/login");
  };

  return (
    <div className="profile-container">
      <h1>Profile</h1>
      <p>Welcome, <strong>{username}</strong>!</p>
      <button onClick={handleLogout}>Logout</button>
    </div>
  );
};

export default ProfilePage;
