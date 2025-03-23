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

const removeLinks = (html: string) => {
  // הסרת כל תגי <a> מתוך ה-HTML
  return html.replace(/<a[^>]*>/g, '').replace(/<\/a>/g, '');
};

const RecipeCard: React.FC<RecipeCardProps> = ({ recipe }) => {
  // פונקציה שמסירה תגי קישור (לינקים)

  return (
    <div className="recipe-card">
      <img src={recipe.image} alt={recipe.title} className="recipe-image" />
      <h3 className="recipe-title">{recipe.title}</h3>
      <p>Time: {recipe.readyInMinutes} min</p>
      <p>Servings: {recipe.servings}</p>

      {/* סיכום המתכון עם HTML, לאחר הסרת קישורים */}
      <p className="recipe-summary" dangerouslySetInnerHTML={{ __html: removeLinks(recipe.summary || "No summary available.") }}></p>

      <p>Ingredients:</p>
      {/* הצגת רכיבים */}
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

      <p>Instructions:</p>
      {/* הצגת הוראות הכנה עם HTML, לאחר הסרת קישורים */}
      <div className="recipe-instructions" dangerouslySetInnerHTML={{ __html: removeLinks(recipe.instructions || "No instructions available.") }}></div>

      {/* הצגת תזונה אם קיימת */}
      {recipe.nutrition && recipe.nutrition.nutrients.length > 0 ? (
        <>
          <p>Nutrition Facts:</p>
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
