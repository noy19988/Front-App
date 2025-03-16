import React from "react";
import PostItem from "./PostItem"; 
import { Post } from "../services/post-client";
import "../styles/postlist.css";

interface PostListProps {
  posts: Post[];
  onPostDeleted: () => void; 
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
