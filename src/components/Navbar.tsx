import { useState, useEffect, useRef } from "react";
import { FaUser, FaSearch } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = ({ user }: { user: { username: string; profileImage?: string } | null }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleProfileClick = () => {
    console.log("✅ Navigating to /profile");
    navigate("/profile");
  };

  // סגירת התפריט כשמשתמש לוחץ מחוץ לאזור
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <nav className="navbar">
      {/* לוגו שנטען מתיקיית public */}
      <div className="logo" onClick={() => navigate("/")}>
        <img src="/logo.PNG" alt="Food Connect Logo" className="navbar-logo" />
      </div>

      {/* שורת חיפוש */}
      <div className="search-bar">
        <input type="text" placeholder="Search..." />
        <FaSearch className="search-icon" />
      </div>

      {/* אזור המשתמש */}
      <div className="user-info">
        <span className="welcome-text">Welcome, {user ? user.username : "Guest"}!</span>
        <div className="profile-icon" onClick={() => setDropdownOpen(!dropdownOpen)}>
          {user && user.profileImage ? (
            <img src={user.profileImage} alt="Profile" />
          ) : (
            <FaUser className="default-profile-icon" />
          )}
        </div>

        {/* תפריט נפתח */}
        {dropdownOpen && (
          <div className="dropdown-menu" ref={dropdownRef}>
            <button onClick={handleProfileClick} className="dropdown-item">
              Profile Settings
            </button>
            <button onClick={handleLogout} className="dropdown-item logout-btn">
              Logout
            </button>
          </div>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
