import React, { useRef, useState } from "react";
import "../styles/postCreate.css";

interface PostCreatePageProps {
  isOpen: boolean;
  onClose: () => void;
  onPostCreated: () => void;
}

const PostCreatePage: React.FC<PostCreatePageProps> = ({ isOpen, onClose, onPostCreated }) => {
  const [formData, setFormData] = useState({
    recipeTitle: "",
    category: [] as string[],
    imageUrl: "",
    difficulty: "easy" as "easy" | "medium" | "hard",
    prepTime: "" as string | number,
    ingredients: [] as string[],
    instructions: [] as string[],
  });

  const [imageFile, setImageFile] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement | null>(null); // ✅ רפרנס לשדה הקובץ

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
  
    if (name === "prepTime") {
      const numericValue = value === "" ? "" : parseInt(value, 10); // השדה יתחיל ריק ויקבל מספרים בלבד
      setFormData({ ...formData, [name]: isNaN(numericValue as number) ? "" : numericValue });
    } else if (name === "category" || name === "ingredients" || name === "instructions") {
      setFormData({ ...formData, [name]: value.split(",") });
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

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    const file = e.dataTransfer.files[0];
    if (file) {
      setImageFile(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  const handleContainerClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click(); // ✅ פותח את חלון בחירת הקבצים בלחיצה
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

        if (imageFile) {
            formDataToSend.append("image", imageFile);  // ✅ כאן מוסיפים את הקובץ
        }

        const response = await fetch("http://localhost:3000/posts", {
            method: "POST",
            body: formDataToSend,
            headers: {
                "Authorization": `Bearer ${localStorage.getItem("token")}`
            }
        });

        if (!response.ok) {
            throw new Error("Post creation failed");
        }

        await response.json();
        onPostCreated();
        onClose();
    } catch (error) {
        console.error("Error creating post:", error);
    }
};


  if (!isOpen) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h2>Create a New Post</h2>
        <form onSubmit={handleSubmit}>
          <input type="text" name="recipeTitle" placeholder="Recipe Title" value={formData.recipeTitle} onChange={handleChange} required />
          <input type="text" name="category" placeholder="Category (comma separated)" value={formData.category.join(", ")} onChange={handleChange} required />

          {/* ✅ אזור העלאת תמונה - לחיצה תפתח חלון קבצים */}
          <div
            className="image-upload-container"
            onDragOver={(e) => e.preventDefault()}
            onDrop={handleDrop}
            onClick={handleContainerClick} // ✅ לחיצה פותחת את חלון הקבצים
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
          <input type="number" name="prepTime" placeholder="Preparation Time (min)" value={formData.prepTime} onChange={handleChange} onKeyDown={(e) => e.key === "-" && e.preventDefault()} min="0" required />
          <textarea name="ingredients" placeholder="Ingredients (comma separated)" value={formData.ingredients.join(", ")} onChange={handleChange} required />
          <textarea name="instructions" placeholder="Instructions (comma separated)" value={formData.instructions.join(", ")} onChange={handleChange} required />
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
