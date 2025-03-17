import React from "react";
import RecipeCard from "./RecipeCard";
import "../styles/recipes.css";

interface RecipeListProps {
  recipes: {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
    servings: number;
    summary: string;
    instructions: string;
    extendedIngredients: { name: string; amount: number; unit: string }[];
    nutrition: { nutrients: { name: string; amount: number; unit: string }[] } | null;
  }[];
}

const RecipeList: React.FC<RecipeListProps> = ({ recipes }) => {
  return (
    <div className="recipe-list">
      {recipes.length > 0 ? (
        recipes.map((recipe) => <RecipeCard key={recipe.id} recipe={recipe} />)
      ) : (
        <p className="no-results">No recipes found.</p>
      )}
    </div>
  );
};

export default RecipeList;
