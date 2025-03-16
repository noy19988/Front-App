import React from "react";
import { Link } from "react-router-dom";
import { FaHome, FaUser, FaBookmark, FaInfoCircle, FaUtensils } from "react-icons/fa";
import "../styles/home.css";

const Sidebar: React.FC = () => {
  return (
    <aside className="sidebar">
      <ul>
        <li><Link to="/"><FaHome /> Home</Link></li>
        <li><Link to="/my-posts"><FaUser /> My Posts </Link></li>
        <li><Link to="/saved-posts"><FaBookmark /> Saved Posts </Link></li>
        <li><Link to="/recipes"><FaUtensils /> Explore Recipes </Link></li>
        <li><Link to="/about"><FaInfoCircle /> About </Link></li>
      </ul>
    </aside>
  );
};

export default Sidebar;