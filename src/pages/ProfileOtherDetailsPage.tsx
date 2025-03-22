import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails } from "../services/api-client";
import { getPostsByUser, Post } from "../services/post-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostList from "../components/PostList";
import "../styles/profileOtherDetails.css"; // יצירת קובץ עיצוב חדש

const ProfileOtherDetailsPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [user, setUser] = useState<{ _id: string; username: string; email: string; imgUrl?: string } | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                navigate("/");
                return;
            }

            try {
                const userData = await getUserDetails(userId);
                setUser(userData);

                const userPosts = await getPostsByUser(userId);
                setPosts(userPosts);
            } catch (error) {
                console.error("Error fetching user details or posts:", error);
                navigate("/");
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [userId, navigate]);

    if (loading) {
        return <div>Loading...</div>;
    }

    if (!user) {
        return <div>User not found.</div>;
    }

    return (
        <div className="home-container">
            <Navbar user={user} onSearch={() => {}} /> {/* הוספת onSearch */}
            <div className="content">
                <Sidebar />
                <div className="main-content">
                    <div className="profile-other-details">
                        <div className="user-details">
                            <img
                                src={user.imgUrl || "https://example.com/default-profile.png"}
                                alt={user.username}
                                className="profile-other-image" // שינוי שם המחלקה
                            />
                            <div className="user-info">
                                <p>{user.username} </p>
                                <p>Email: {user.email}</p>
                                <p>Posts: {posts.length}</p>
                            </div>
                        </div>
                        <div className="user-posts">
                            <PostList posts={posts} onPostDeleted={() => {}} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProfileOtherDetailsPage;