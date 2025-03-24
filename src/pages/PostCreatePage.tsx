import React, { useRef, useState } from "react";
import "../styles/postcreate.css";
import Select from "react-select";
import { useEffect } from "react"; 
import {components} from "react-select";

const foodCategories = [
  "Appetizers", "Breakfast", "Lunch", "Dinner", "Desserts", "Baking", "Vegan", "Vegetarian",
  "Gluten-Free", "Dairy-Free", "Keto", "Paleo", "Grill", "Pasta", "Pizza", "Soups", "Salads",
  "Asian", "Mexican", "Italian", "Indian", "Mediterranean", "Street Food", "BBQ", "Smoothies"
];


const categoryOptions = foodCategories.map((cat) => ({
  value: cat,
  label: cat,
}));

interface PostCreatePageProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}


const PostCreatePage: React.FC<PostCreatePageProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    recipeTitle: "",
    category: [] as string[], // ✅ כבר קיים
    imageUrl: "",
    difficulty: "easy" as "easy" | "medium" | "hard",
    prepTime: "" as string | number,
    ingredients: [] as string[],
    instructions: [] as string[],
  });
  

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    if (name === "ingredients" || name === "instructions") {
        setFormData({ ...formData, [name]: value.split("\n") }); // פיצול לפי מעברי שורה
    } else if (name === "category") {
        setFormData({ ...formData, [name]: value.split(",").map((item) => item.trim()) }); // פיצול לפי פסיקים
    } else {
        setFormData({ ...formData, [name]: value });
    }
};

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const formDataToSend = new FormData();
      formDataToSend.append("recipeTitle", formData.recipeTitle);
      formDataToSend.append("category", JSON.stringify(formData.category));
      formDataToSend.append("difficulty", formData.difficulty);
      formDataToSend.append("prepTime", formData.prepTime.toString());
      formDataToSend.append("ingredients", JSON.stringify(formData.ingredients));
      formDataToSend.append("instructions", JSON.stringify(formData.instructions));
      if (imageFile) formDataToSend.append("image", imageFile);

      const response = await fetch("https://node115.cs.colman.ac.il/posts", {
        method: "POST",
        body: formDataToSend,
        headers: {
          "Authorization": `Bearer ${localStorage.getItem("token")}`
        } 
      });

      if (!response.ok) throw new Error("Post creation failed");

      await response.json();
      onPostCreated();
      onClose();
    } catch (error) {
      console.error("Error creating post:", error);
    }
  };

  useEffect(() => {
    if (isOpen) {
      // אפס הכל
      setFormData({
        recipeTitle: "",
        category: [],
        imageUrl: "",
        difficulty: "easy",
        prepTime: "",
        ingredients: [],
        instructions: [],
      });
      setImageFile(null);
      setPreviewImage(null);
    }
  }, [isOpen]);

  if (!isOpen) return null;
  

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="recipeTitle" placeholder="Recipe Title" value={formData.recipeTitle} onChange={handleChange} required />

          <Select
  isMulti
  isSearchable={false}
  closeMenuOnSelect={false}
  hideSelectedOptions={false}
  name="category"
  options={categoryOptions}
  className="react-select-container"
  classNamePrefix="select"
  placeholder="Select categories..."
  value={categoryOptions.filter(opt => formData.category.includes(opt.value))}
  onChange={(selectedOptions) =>
    setFormData({
      ...formData,
      category: selectedOptions.map((opt) => opt.value),
    })
  }
  components={{
    MultiValue: () => null,
    SingleValue: () => null,
    ValueContainer: (props) => {
      const selectedLabels = formData.category.join(", ");
      return (
        <components.ValueContainer {...props}>
          <div className="selected-labels222">
            {selectedLabels || "Select categories..."}
          </div>
        </components.ValueContainer>
      );
    }
    
  }}
  
  
/>


          <div
            className="image-upload-container"
            onDragOver={(e) => e.preventDefault()}
            onDrop={(e) => {
              e.preventDefault();
              const file = e.dataTransfer.files[0];
              if (file) {
                setImageFile(file);
                setPreviewImage(URL.createObjectURL(file));
              }
            }}
            onClick={() => fileInputRef.current?.click()}
          >
            {previewImage ? (
              <img src={previewImage} alt="Preview" className="image-preview" />
            ) : (
              <p>Drag & Drop or Click to Upload an Image</p>
            )}
            <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
          </div>

          <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
            <option value="easy">Easy</option>
            <option value="medium">Medium</option>
            <option value="hard">Hard</option>
          </select>

          <input type="number" name="prepTime" placeholder="Preparation Time (min)" value={formData.prepTime} onChange={handleChange} min="0" required />

          <textarea name="ingredients" placeholder="Ingredients (comma separated)" value={formData.ingredients.join("\n")} onChange={handleChange} required />

          <textarea name="instructions" placeholder="Instructions (comma separated)" value={formData.instructions.join("\n")} onChange={handleChange} required />

          <div className="modal-buttons">
            <button type="submit" className="btn save-btn">Post</button>
            <button type="button" className="btn close-btn" onClick={onClose}>Cancel</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PostCreatePage;