import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getUserDetails } from "../services/api-client";
import { getAllPosts, Post } from "../services/post-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostList from "../components/PostList";
import PostCreatePage from "../pages/PostCreatePage";
import "../styles/home.css";


function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string } | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
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
          <button className="create-post-btn" onClick={() => setIsPostModalOpen(true)}>
            Create Post
          </button>

          <PostCreatePage
            isOpen={isPostModalOpen}
            onClose={() => setIsPostModalOpen(false)}
            onPostCreated={fetchPosts}
          />

          {}
          <div className="post-list-container">
            <PostList posts={posts} onPostDeleted={fetchPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
