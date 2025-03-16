import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { updatePost } from "../services/post-client";
import "../styles/postupdate.css";
import { Post } from "../services/post-client";

interface PostUpdatePageProps {
    isOpen: boolean;
    onClose: () => void;
    onPostUpdated: () => void;
    post: Post;
}

const PostUpdatePage: React.FC<PostUpdatePageProps> = ({ isOpen, onClose, onPostUpdated, post }) => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        recipeTitle: "",
        category: [] as string[],
        imageUrl: "",
        difficulty: "easy" as "easy" | "medium" | "hard",
        prepTime: 1,
        ingredients: [] as string[],
        instructions: [] as string[],
    });

    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewImage, setPreviewImage] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement | null>(null);

    useEffect(() => {
        if (post) {
            setFormData({
                recipeTitle: post.recipeTitle,
                category: post.category,
                imageUrl: post.imageUrl || "",
                difficulty: post.difficulty,
                prepTime: post.prepTime,
                ingredients: post.ingredients,
                instructions: post.instructions,
            });
            setPreviewImage(post.imageUrl || null);
        }
    }, [post]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;
        if (name === "category" || name === "ingredients" || name === "instructions") {
            setFormData({ ...formData, [name]: value.split(",").map((item) => item.trim()) });
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

            if (imageFile) {
                formDataToSend.append("image", imageFile);
            }

            for (const pair of formDataToSend.entries()) {
                console.log(pair[0] + ', ' + pair[1]);
            }

            await updatePost(post._id, formDataToSend);
            onPostUpdated();
            onClose();
            navigate("/");
        } catch (error) {
            console.error("Error updating post:", error);
            console.log(error);
        }
    };

    const handleCancel = () => {
        onClose();
        navigate("/");
    };

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <h2>Update Post</h2>
                <form onSubmit={handleSubmit}>
                    <input type="text" name="recipeTitle" value={formData.recipeTitle} onChange={handleChange} required />
                    <input type="text" name="category" value={formData.category.join(", ")} onChange={handleChange} required />

                    <div className="image-upload-container" onClick={() => fileInputRef.current?.click()}>
                        {previewImage ? <img src={previewImage} alt="Preview" className="image-preview" /> : <p>Click to update image</p>}
                        <input ref={fileInputRef} type="file" accept="image/*" onChange={handleImageChange} style={{ display: "none" }} />
                    </div>

                    <select name="difficulty" value={formData.difficulty} onChange={handleChange}>
                        <option value="easy">Easy</option>
                        <option value="medium">Medium</option>
                        <option value="hard">Hard</option>
                    </select>
                    <input type="number" name="prepTime" value={formData.prepTime} onChange={handleChange} required />
                    <textarea name="ingredients" value={formData.ingredients.join(", ")} onChange={handleChange} required />
                    <textarea name="instructions" value={formData.instructions.join(", ")} onChange={handleChange} required />
                    <div className="modal-buttons">
                        <button type="submit" className="btn save-btn">Update</button>
                        <button type="button" className="btn close-btn" onClick={handleCancel}>Cancel</button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default PostUpdatePage;