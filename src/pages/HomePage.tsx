









import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPosts, Post, filterPosts } from "../services/post-client";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import PostList from "../components/PostList";
import PostCreatePage from "../pages/PostCreatePage";
import "../styles/home.css";
import { getUserDetails } from "../services/api-client";

function HomePage() {
  const navigate = useNavigate();
  const [user, setUser] = useState<{ username: string; imgUrl?: string } | null>(null);
  const [isPostModalOpen, setIsPostModalOpen] = useState(false);
  const [posts, setPosts] = useState<Post[]>([]);
  const [difficulty, setDifficulty] = useState<string | null>(null);
  const [category, setCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>("");

  const fetchPosts = async () => {
    try {
      const data = await getAllPosts();
      setPosts(data);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const handleSearch = async (query: string) => {
    setSearchQuery(query); // עדכון ה search query ב state
    try {
      const data = await filterPosts(query, difficulty, category);
      setPosts(data);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
  };

  const handleFilterChange = async () => {
    console.log("handleFilterChange - difficulty:", difficulty);
    console.log("handleFilterChange - category:", category);

    try {
      const data = await filterPosts(searchQuery, difficulty, category);
      setPosts(data);
    } catch (error) {
      console.error("Error applying filters:", error);
    }
  };

  const handleDifficultyChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setDifficulty(event.target.value);
  };

  const handleCategoryChange = (
    event: React.ChangeEvent<HTMLSelectElement>
  ) => {
    setCategory(event.target.value);
  };

  useEffect(() => {
    if (difficulty !== null || category !== null || searchQuery !== "") {
      handleFilterChange();
    }
  }, [difficulty, category, searchQuery]);

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
      <Navbar user={user} onSearch={handleSearch} />
      <div className="content">
        <Sidebar />
        <button
          className="create-post-btn"
          onClick={() => setIsPostModalOpen(true)}
        >
          Create Post
        </button>
        <div className="main-content">
          <PostCreatePage
            isOpen={isPostModalOpen}
            onClose={() => setIsPostModalOpen(false)}
            onPostCreated={fetchPosts}
          />

          <div className="filters">
            <div className="filter">
              <label htmlFor="difficulty">Difficulty</label>
              <select
                id="difficulty"
                value={difficulty || ""}
                onChange={handleDifficultyChange}
              >
                <option value="">All</option>
                <option value="easy">Easy</option>
                <option value="medium">Medium</option>
                <option value="hard">Hard</option>
              </select>
            </div>

            <div className="filter">
              <label htmlFor="category">Category</label>
              <select
                id="category"
                value={category || ""}
                onChange={handleCategoryChange}
              >
                <option value="">All</option>
                <option value="Italian">Italian</option>
                <option value="Pasta">Pasta</option>
                <option value="Dessert">Dessert</option>
                <option value="Salads">Salads</option>
                <option value="Healthy">Healthy</option>
              </select>
            </div>
          </div>

          <div className="post-list-container1">
            <PostList posts={posts} onPostDeleted={fetchPosts} />
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;
