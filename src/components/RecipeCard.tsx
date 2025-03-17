import React from "react";
import "../styles/recipes.css";

interface RecipeCardProps {
  recipe: {
    id: number;
    title: string;
    image: string;
    readyInMinutes: number;
    servings: number;
    summary: string;
    instructions: string;
    extendedIngredients?: { name: string; amount: number; unit: string }[]; // 🛠 הוספת `?`
    nutrition?: { nutrients: { name: string; amount: number; unit: string }[] } | null;
  };
}

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <h3 className="recipe-title">{recipe.title}</h3>
      <p><strong>Time:</strong> {recipe.readyInMinutes} min</p>
      <p><strong>Servings:</strong> {recipe.servings}</p>
      <p className="recipe-summary" dangerouslySetInnerHTML={{ __html: recipe.summary }}></p>

      <h4>Ingredients:</h4>
      {recipe.extendedIngredients && recipe.extendedIngredients.length > 0 ? (
        <ul>
          {recipe.extendedIngredients.map((ingredient, index) => (
            <li key={index}>
              {ingredient.amount} {ingredient.unit} {ingredient.name}
            </li>
          ))}
        </ul>
      ) : (
        <p>No ingredients available.</p>
      )}

      <h4>Instructions:</h4>
      <p>{recipe.instructions || "No instructions available."}</p>

      {recipe.nutrition && recipe.nutrition.nutrients.length > 0 ? (
        <>
          <h4>Nutrition Facts:</h4>
          <ul>
            {recipe.nutrition.nutrients.map((nutrient, index) => (
              <li key={index}>
                {nutrient.name}: {nutrient.amount} {nutrient.unit}
              </li>
            ))}
          </ul>
        </>
      ) : (
        <p>No nutrition information available.</p>
      )}
    </div>
  );
};

export default RecipeCard;
