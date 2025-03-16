import React from "react";
import PostItem from "./PostItem"; // ✅ שימוש בקומפוננטה נפרדת
import { Post } from "../services/post-client";
import "../styles/home.css";

interface PostListProps {
  posts: Post[];
  onPostDeleted: () => void; // ✅ פונקציה שמתעדכנת אחרי מחיקה
}

const PostList: React.FC<PostListProps> = ({ posts, onPostDeleted }) => {
  return (
    <div className="post-list">
      {posts.length > 0 ? (
        posts.map((post) => (
          <PostItem key={post._id} post={post} onDelete={onPostDeleted} />
        ))
      ) : (
        <p className="no-posts">No posts available. Start by adding one! 😊</p>
      )}
    </div>
  );
};

export default PostList;
