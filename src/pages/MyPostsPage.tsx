import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../services/api-client";
import { getPostsByUser, Post } from "../services/post-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostList from "../components/PostList";
import "../styles/home.css";

function MyPostsPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [posts, setPosts] = useState<Post[]>([]);

    const fetchPosts = async () => {
        try {
            const userId = localStorage.getItem("userId");
            if (!userId) {
                navigate("/login");
                return;
            }
            const data = await getPostsByUser(userId);
            setPosts(data);
        } catch (error) {
            console.error("Error fetching user posts:", error);
        }
    };

    useEffect(() => {
        const fetchUserData = async () => {
            const userId = localStorage.getItem("userId");

            if (!userId) {
                navigate("/login");
                return;
            }

            try {
                const userData = await getUserDetails(userId);
                setUser(userData);
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                navigate("/login");
            }
        };

        fetchUserData();
        fetchPosts();
    }, [navigate]);

    return (
        <div className="home-container">
            <Navbar user={user} />
            <div className="content">
                <Sidebar />
                <div className="main-content">
                    <div className="post-list-container">
                        <PostList posts={posts} onPostDeleted={fetchPosts} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default MyPostsPage;