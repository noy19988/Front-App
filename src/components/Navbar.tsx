import { useState, useEffect, useRef } from "react";
import { FaSearch, FaUserCircle } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import "../styles/navbar.css";

const Navbar = ({ user, onSearch }: { user: { username: string; imgUrl?: string } | null, onSearch: (searchQuery: string) => void }) => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [imgError, setImgError] = useState(false);
  const [searchQuery, setSearchQuery] = useState(""); 
  const [debounceTimeout, setDebounceTimeout] = useState<NodeJS.Timeout | null>(null); 
  const dropdownRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("userId");
    navigate("/login");
  };

  const handleProfileClick = () => {
    navigate("/profile");
  };

  const handleSearch = (query: string) => {
    onSearch(query); 
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newSearchQuery = e.target.value;
    setSearchQuery(newSearchQuery);

    if (debounceTimeout) {
      clearTimeout(debounceTimeout);
    }

    const timeout = setTimeout(() => {
      handleSearch(newSearchQuery);
    }, 300);

    setDebounceTimeout(timeout); 
  };

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setDropdownOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const isValidImg = user?.imgUrl && user.imgUrl.trim() !== "";

  return (
    <nav className="navbar">
      <div className="logo" onClick={() => navigate("/")}>
        <img src="/logo.PNG" alt="Food Connect Logo" className="navbar-logo" />
      </div>

      <div className="search-bar">
        <input
          type="text"
          placeholder="Search..."
          value={searchQuery}
          onChange={handleInputChange} 
        />
        <FaSearch className="search-icon" />
      </div>

      <div className="user-info">
        <span className="welcome-text">Welcome, {user ? user.username : "Guest"}!</span>

        <div
          className="profile-icon"
          onClick={() => setDropdownOpen(!dropdownOpen)}
          style={{ cursor: "pointer" }}
        >
          {isValidImg && !imgError ? (
            <img
              src={user!.imgUrl}
              alt="Profile"
              className="profile-image"
              style={{
                width: "40px",
                height: "40px",
                borderRadius: "50%",
                objectFit: "cover",
                border: "2px solid transparent",
                transition: "border-color 0.3s ease",
              }}
              onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#b34724")}
              onMouseLeave={(e) => (e.currentTarget.style.borderColor = "transparent")}
              onError={() => setImgError(true)} 
            />
          ) : (
            <FaUserCircle className="default-profile-icon" />
          )}
        </div>

        {dropdownOpen && (
          <div className="dropdown-menu show" ref={dropdownRef}>
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
