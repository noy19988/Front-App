import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../services/api-client";
import { getAllPosts, Post } from "../services/post-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostList from "../components/PostList";
import "../styles/savedposts.css"; // עדכון שם הקובץ

function SavePostsPage() {
    const navigate = useNavigate();
    const [user, setUser] = useState<{ username: string } | null>(null);
    const [savedPosts, setSavedPosts] = useState<Post[]>([]);

    const fetchSavedPosts = async () => {
        try {
            const allPosts = await getAllPosts();
            const userId = localStorage.getItem("userId");
            if (userId) {
                const filteredPosts = allPosts.filter((post) =>
                    post.savedBy.includes(userId)
                );
                setSavedPosts(filteredPosts);
            }
        } catch (error) {
            console.error("Error fetching saved posts:", error);
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
                fetchSavedPosts();
            } catch {
                localStorage.removeItem("token");
                localStorage.removeItem("userId");
                navigate("/login");
            }
        };

        fetchUserData();
    }, [navigate]);

    return (
        <div className="save-posts-container">
            <Navbar user={user} />
            <div className="content">
                <Sidebar />
                <div className="main-content">
                    <h1 className="saved-posts-title">Saved Posts</h1>
                    <div className="post-list-container">
                        <PostList posts={savedPosts} onPostDeleted={fetchSavedPosts} />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default SavePostsPage;