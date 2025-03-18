import React, { useState,useEffect } from "react";
import Navbar from "../components/Navbar";
import Sidebar from "../components/Sidebar";
import RecipeList from "../components/RecipeList";
import { getUserDetails } from "../services/api-client";
import "../styles/recipes.css";
import "../styles/home.css";

const RecipesPage: React.FC = () => {
  const [query, setQuery] = useState("");
  const [recipes, setRecipes] = useState<
    {
      id: number;
      title: string;
      image: string;
      readyInMinutes: number;
      servings: number;
      summary: string;
      instructions: string;
      extendedIngredients: { name: string; amount: number; unit: string }[];
      nutrition: { nutrients: { name: string; amount: number; unit: string }[] } | null;
    }[]
  >([]);
  const [loading, setLoading] = useState(false);
  const [user, setUser] = useState<{ username: string } | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      const userId = localStorage.getItem("userId");
      if (!userId) return;

      try {
        const userData = await getUserDetails(userId);
        setUser(userData);
      } catch {
        localStorage.removeItem("token");
        localStorage.removeItem("userId");
      }
    };
    fetchUserData();
  }, []);


  const handleSearch = async () => {
    if (!query.trim()) return;
    setLoading(true);
    try {
      const response = await fetch(`http://localhost:3000/api/recipes/search?query=${query}`);
      const data = await response.json();
      setRecipes(data.recipes);
    } catch (error) {
      console.error("Error fetching recipes:", error);
    }
    setLoading(false);
  };

  return (
    <div className="home-container">
      <Navbar user={user} />
      <div className="content">
        <Sidebar />
        <main className="recipes-content">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search recipes..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input"
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>

          {/* ✅ עטפנו את רשימת המתכונים בקונטיינר עם גלילה */}
          <div className="recipe-list-container">
            {loading ? <p className="loading">Loading...</p> : <RecipeList recipes={recipes} />}
          </div>

        </main>
      </div>
    </div>
  );
};

export default RecipesPage;
