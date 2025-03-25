import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getUserDetails } from "../services/api-client";
import { getPostsByUser, Post } from "../services/post-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostList from "../components/PostList";
import "../styles/profileOtherDetails.css";

const ProfileOtherDetailsPage: React.FC = () => {
    const { userId } = useParams<{ userId: string }>();
    const navigate = useNavigate();
    const [viewedUser, setViewedUser] = useState<{ _id: string; username: string; email: string; imgUrl?: string } | null>(null);
    const [loggedInUser, setLoggedInUser] = useState<{ username: string; imgUrl?: string } | null>(null); 
    const [posts, setPosts] = useState<Post[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            if (!userId) {
                navigate("/");
                return;
            }

            try {
                const viewedUserData = await getUserDetails(userId);
                setViewedUser(viewedUserData);

                const userPosts = await getPostsByUser(userId);
                setPosts(userPosts);

                const loggedInUserId = localStorage.getItem("userId");
                if (loggedInUserId) {
                    const loggedInUserData = await getUserDetails(loggedInUserId);
                    setLoggedInUser(loggedInUserData);
                }
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

    if (!viewedUser) {
        return <div>User not found.</div>;
    }

    return (
        <div className="home-container">
            <Navbar user={loggedInUser} onSearch={() => {}} /> {}
            <div className="content">
                <Sidebar />
                <div className="main-content">
                    <div className="profile-other-details">
                        <div className="user-details">
                            <img
                                src={viewedUser.imgUrl || "https://example.com/default-profile.png"}
                                alt={viewedUser.username}
                                className="profile-other-image"
                            />
                            <div className="user-info">
                                <p>{viewedUser.username} </p>
                                <p>Email: {viewedUser.email}</p>
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