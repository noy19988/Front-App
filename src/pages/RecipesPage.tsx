import React, { useState, useEffect } from "react";
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
    const response = await fetch(
      `https://node115.cs.colman.ac.il/api/recipes/search?query=${query}`
    );
    const data = await response.json();
    console.log("Fetched recipes:", data.recipes);

    interface Recipe {
      id: number;
      title: string;
      image: string;
      readyInMinutes: number;
      servings: number;
      summary: string;
      instructions: string;
      extendedIngredients: { name: string; amount: number; unit: string }[];
      nutrition: { nutrients: { name: string; amount: number; unit: string }[] } | null;
    }

    interface RecipeDetails {
      recipeDetails: Recipe;
    }

    const detailedRecipes: Recipe[] = await Promise.all(
      data.recipes.map(async (recipe: { id: number }) => {
        const recipeDetailsResponse = await fetch(
          `https://node115.cs.colman.ac.il/api/recipes/${recipe.id}`
        );
        const recipeDetails: RecipeDetails = await recipeDetailsResponse.json();
        return recipeDetails.recipeDetails; 
      })
    );
    
    setRecipes(detailedRecipes); 
  } catch (error) {
    console.error("Error fetching recipes:", error);
  }
  setLoading(false);
};

  
  return (
    <div className="home-container">
      <Navbar user={user} onSearch={() => {}} /> {}
      <div className="content">
        <Sidebar />
        <main className="recipes-content">
          <div className="search-container">
            <input
              type="text"
              placeholder="Search for recipe across the web..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              className="search-input4"
            />
            <button onClick={handleSearch} className="search-button">
              Search
            </button>
          </div>

          {}
          <div className="recipe-list-container">
            {loading ? (
              <p className="loading">Loading...</p>
            ) : recipes && recipes.length > 0 ? (
              <RecipeList recipes={recipes} />
            ) : (
              <p></p>
            )}
          </div>
        </main>
      </div>
    </div>
  );
};

export default RecipesPage;