import apiClient from "./api-client";

export interface Comment {
  _id: string;
  content: string;
  postId: string;
  author: {
    _id: string;
    username: string;
    imgUrl?: string; 
  };
  createdAt: string;
}

export const addComment = async (postId: string, content: string): Promise<Comment> => {
  try {
    const response = await apiClient.post("/comment", { postId, content });
    return response.data;
  } catch (error) {
    console.error("Error adding comment:", error);
    throw error;
  }
};

export const getCommentsByPost = async (postId: string): Promise<Comment[]> => {
  try {
    const response = await apiClient.get(`/comment/post/${postId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching comments:", error);
    throw error;
  }
};

export const deleteComment = async (commentId: string) => {
  try {
    await apiClient.delete(`/comment/${commentId}`);
  } catch (error) {
    console.error("Error deleting comment:", error);
    throw error;
  }
};
