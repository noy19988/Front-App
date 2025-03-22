import apiClient from "./api-client";

export interface User {
  _id: string;
  username: string;
  imgUrl?: string;
}


export interface Post {
  _id: string;
  recipeTitle: string;
  category: string[];
  imageUrl?: string;
  difficulty: "easy" | "medium" | "hard";
  prepTime: number;
  ingredients: string[];
  instructions: string[];
  authorId: User;
  likes: number;
  likedBy: string[]; 
  comments: string[];
  savedBy: string[];
  createdAt: string;
}


export const getAllPosts = async (): Promise<Post[]> => {
    try {
      const response = await apiClient.get("/posts"); // 📌 שינוי הנתיב
      console.log("📦 Posts from server:", response.data); // בדוק איך נראה authorId
      return response.data;
    } catch (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }
};


export const createPost = async (postData: Partial<Post>) => {
  try {
    const response = await apiClient.post("/posts", postData);
    return response.data.post;
  } catch (error) {
    console.error("Error creating post:", error);
    throw error;
  }
};


export const deletePost = async (postId: string) => {
  try {
    await apiClient.delete(`/posts/${postId}`);
  } catch (error) {
    console.error("Error deleting post:", error);
    throw error;
  }
};


export const updatePost = async (postId: string, updatedData: Partial<Post> | FormData, liked?: boolean) => {
  try {
      const isFormData = updatedData instanceof FormData;

      const requestData = isFormData
          ? updatedData
          : { ...updatedData, liked }; 

      const response = await apiClient.put(
          `/posts/${postId}`,
          requestData,
          {
              headers: isFormData ? { "Content-Type": "multipart/form-data" } : { "Content-Type": "application/json" },
          }
      );

      return response.data;
  } catch (error) {
      console.error("Error updating post:", error);
      throw error;
  }
};


export const savePost = async (postId: string) => {
  try {
    const userId = localStorage.getItem("userId"); 

    if (!userId) {
      throw new Error("User not logged in"); 
    }

    const response = await apiClient.put(`/posts/${postId}/save`, { userId }); // שליחת בקשה ל-backend
    return response.data;
  } catch (error) {
    console.error("Error saving/unsaving post:", error);
    throw error; 
  }
};



export const getPostsByUser = async (userId: string): Promise<Post[]> => {
  try {
      const response = await apiClient.get(`/posts/user/${userId}`);
      return response.data;
  } catch (error) {
      console.error("Error fetching user posts:", error);
      throw error;
  }
};


export const getPostNutrition = async (postId: string): Promise<{ calories: number; protein: number; sugar: number } | null> => {
  try {
      const response = await apiClient.get(`/posts/${postId}/nutrition`);
      return response.data;
  } catch (error) {
      console.error("❌ Error fetching nutritional values:", error);
      return null; // אם יש שגיאה, נחזיר null כדי למנוע קריסת הקוד
  }
};






