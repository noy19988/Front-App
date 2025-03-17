import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails, updateUser, deleteUser } from "../services/api-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import { FaTrash, FaUser } from "react-icons/fa";
import "../styles/profile.css"; // קובץ העיצוב

const ProfilePage = () => {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ _id: string; username: string; email: string; imgUrl?: string } | null>(null);
  const [newUsername, setNewUsername] = useState("");
  const [newImage, setNewImage] = useState<File | null>(null);
  const [profileImage, setProfileImage] = useState<string | null>(null); // סטייט לתמונה

  useEffect(() => {
    const userId = localStorage.getItem("userId");
    if (!userId) {
      navigate("/login");
      return;
    }

    getUserDetails(userId)
      .then((data) => {
        setUser(data);
        setNewUsername(data.username);
        setProfileImage(data.imgUrl && data.imgUrl.trim() !== "" ? data.imgUrl : null); // עדכון תמונה רק אם יש נתון תקין
      })
      .catch(() => {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
        navigate("/login");
      });
  }, [navigate]);

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const inputValue = e.target.value;
    const filteredValue = inputValue.replace(/\s/g, ""); // מונע רווחים
    setNewUsername(filteredValue);
  };

  const handleUpdate = async () => {
    if (!user) return;

    if (newUsername.length < 2) {
      alert("Username must be at least 2 characters long.");
      return;
    }

    const formData = new FormData();
    formData.append("username", newUsername);

    if (newImage) {
      formData.append("profileImage", newImage);
    }

    try {
      const updatedUser = await updateUser(user._id, formData);
      if (updatedUser) {
        setUser(updatedUser);
        setProfileImage(updatedUser.imgUrl); // עדכון תמונה לאחר השמירה
        alert("✅ Profile updated successfully!");
      }
    } catch (error) {
      console.error("❌ Error updating profile:", error);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    const confirmDelete = window.confirm("Are you sure you want to delete your account?");
    if (!confirmDelete) return;

    try {
      await deleteUser(user._id);
      localStorage.removeItem("token");
      localStorage.removeItem("userId");
      navigate("/signup");
    } catch (error) {
      console.error("Error deleting user:", error);
    }
  };

  return (
    <div className="home-container">
      {/* הניווט העליון */}
      <Navbar user={user} />

      <div className="content">
        {/* הסרגל הצדדי */}
        <Sidebar />

        {/* התוכן המרכזי - עמוד פרופיל */}
        <div className="main-content">
          <div className="profile-container">
            <div className="profile-card">
              <h4 className="profile-title">Profile Picture</h4>
              <div className="profile-image-container">
                {profileImage ? (
                  <img src={profileImage} alt="Profile" className="profile-image" />
                ) : (
                  <div className="default-profile">
                    <FaUser className="default-profile-icon" />
                  </div>
                )}
              </div>

              {/* כפתור העלאת תמונה */}
              <label className="file-upload">
                <input
                  type="file"
                  className="file-input"
                  onChange={(e) => {
                    if (e.target.files && e.target.files[0]) {
                      setNewImage(e.target.files[0]);
                      setProfileImage(URL.createObjectURL(e.target.files[0])); // הצגת תמונה זמנית לפני השמירה
                    }
                  }}
                />
              </label>

              {/* טקסט של מגבלת גודל */}
              <p className="image-info">JPG or PNG no larger than 5 MB</p>
            </div>

            <div className="profile-details">
              <h3>Account Details</h3>
              <label>Username</label>
              <input
                type="text"
                value={newUsername}
                onChange={handleUsernameChange}
                className="input-field"
              />

              <label>Email</label>
              <input type="text" value={user?.email || ""} readOnly className="input-field read-only" />

              <div className="button-container">
                <button onClick={handleUpdate} className="save-button">Save Changes</button>
                <button onClick={handleDelete} className="delete-button">
                  <FaTrash /> Delete Account
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfilePage;