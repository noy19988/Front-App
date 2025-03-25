import React, { useEffect, useState } from "react";
import { Post, deletePost, updatePost, savePost } from "../services/post-client";
import { addComment, getCommentsByPost, Comment, deleteComment } from "../services/comment-client";
import { getUserDetails } from "../services/api-client";
import "../styles/postitem.css";
import { RiRobot2Fill } from "react-icons/ri";
import { getPostNutrition } from "../services/post-client"; 
import { FaHeart, FaComment, FaTrash, FaEllipsisV, FaEdit, FaBookmark, FaUserCircle } from "react-icons/fa";
import PostUpdatePage from "../pages/PostUpdatePage";
import { Link } from "react-router-dom"; 

interface PostItemProps {
    post: Post;
    onDelete: () => void;
}


const formatCreatedAt = (dateString: string): string => {
  const date = new Date(dateString);
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const seconds = Math.round(diff / 1000);
  const minutes = Math.round(seconds / 60);
  const hours = Math.round(minutes / 60);
  const days = Math.round(hours / 24);
  const months = Math.round(days / 30);
  const years = Math.round(months / 12);
  

  if (seconds < 60) {
      return `${seconds}s`;
  } else if (minutes < 60) {
      return `${minutes}m`;
  } else if (hours < 24) {
      return `${hours}h`;
  } else if (days < 30) {
      return `${days}d`;
  } else if (months < 12) {
      return `${months}m`;
  } else {
      return `${years}y`;
  }
};

const PostItem: React.FC<PostItemProps> = ({ post, onDelete }) => {
    
    const [showComments, setShowComments] = useState(false);
    const [commentText, setCommentText] = useState("");
    const [comments, setComments] = useState<Comment[]>([]);
    const [showDropdown, setShowDropdown] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [liked, setLiked] = useState(false);
    const [likesCount, setLikesCount] = useState(post.likes);
    const [commentsCount, setCommentsCount] = useState(0);
    const [saved, setSaved] = useState(false);
    const [nutrition, setNutrition] = useState<{ calories: number; protein: number; sugar: number } | null>(null);
    const [loadingNutrition, setLoadingNutrition] = useState(false);
    const [imgError, setImgError] = useState(false);


    const userId = localStorage.getItem("userId");
    const isOwner = userId && post.authorId?._id === userId;
    

    useEffect(() => {
        const fetchComments = async () => {
            try {
                const fetchedComments = await getCommentsByPost(post._id);
                setComments(fetchedComments);
                setCommentsCount(fetchedComments.length);
            } catch (error) {
                console.error("Error fetching comments:", error);
            }
        };
        fetchComments();
    }, [post._id]);

    useEffect(() => {
        setLiked(post.likedBy.includes(userId || ""));
        setLikesCount(post.likes);
    }, [post.likedBy, post.likes, userId]);

    useEffect(() => {
        const isPostSaved = post.savedBy.includes(userId || "");
        setSaved(isPostSaved);
    }, [post.savedBy, userId]);

    if (!post.authorId) {
        return null;
    }

    const handleAddComment = async () => {
        if (!commentText.trim()) return;

        try {
            const newComment = await addComment(post._id, commentText);
            const response = await getUserDetails(userId as string);
            const currentUser = {
                _id: response._id,
                username: response.username,
                imgUrl: response.imgUrl || "https://example.com/default-profile.png",
            };
            const updatedComment = {
                ...newComment,
                author: currentUser,
            };
            setComments((prevComments) => [...prevComments, updatedComment]);
            setCommentText("");
            setCommentsCount((prevCount) => prevCount + 1);
        } catch (error) {
            console.error("Error adding comment:", error);
        }
    };
  
    const handleEditPost = () => {
        setIsEditModalOpen(true);
        setShowDropdown(false);

    };

    const handleDeletePost = async () => {
        if (window.confirm("Are you sure you want to delete this post?")) {
            try {
                await deletePost(post._id);
                onDelete();
            } catch (error) {
                console.error("Error deleting post:", error);
            }
        }
    };
    

    const handleLike = async () => {
        const newLiked = !liked;
        try {
            let updatedLikedBy = [...post.likedBy];
            if (newLiked) {
                if (!updatedLikedBy.includes(userId || "")) {
                    updatedLikedBy.push(userId || "");
                }
            } else {
                updatedLikedBy = updatedLikedBy.filter((id) => id !== userId);
            }
            const updatedPost = {
                ...post,
                likedBy: updatedLikedBy.filter((id) => id !== ""),
                likes: newLiked ? likesCount + 1 : likesCount - 1,
            };
            await updatePost(post._id, updatedPost, newLiked);
            setLiked(newLiked);
            setLikesCount(newLiked ? likesCount + 1 : likesCount - 1);
        } catch (error) {
            console.error("Error updating like:", error);
        }
    };

    const handleSave = async () => {
        try {
          await savePost(post._id);
          setSaved(!saved);
        } catch (error) {
          console.error("Error saving/unsaving post:", error);
        }
    };


    const handleGetNutrition = async () => {
      setLoadingNutrition(true);
      try {
          const nutritionData = await getPostNutrition(post._id);
          setNutrition(nutritionData);
      } catch (error) {
          console.error("Error fetching nutrition data:", error);
      }
      setLoadingNutrition(false);
  };


    return (
      <div className="post-item">
          <div className="post-header">
              <div className="post-author">
              <Link to={post.authorId ? `/profile/${post.authorId._id}` : "#"}>
  {post.authorId.imgUrl && !imgError ? (
    <img
      src={post.authorId.imgUrl}
      alt={post.authorId.username}
      className="author-img"
      onError={() => setImgError(true)}
    />
  ) : (
    <FaUserCircle className="author-img default-icon" />
  )}
</Link>

                  <div className="author-details">
                      <span className="author-name">{post.authorId.username}</span>
                      <span className="post-created-at">{formatCreatedAt(post.createdAt)}</span>
                  </div>
              </div>
  
              <div className="post-options">
    <button className={`save-btn-item ${saved ? 'saved' : ''}`} aria-label="Save post" onClick={handleSave}>
        <FaBookmark className="save-icon" />
    </button>

    {isOwner && (
        <>
            <button className="options-btn" onClick={() => setShowDropdown(!showDropdown)}>
                <FaEllipsisV />
            </button>

            {showDropdown && (
                <ul className="dropdown-menu-item">
                    <li onClick={handleDeletePost}><FaTrash /> Delete Post</li>
                    <li onClick={handleEditPost}><FaEdit /> Edit Post</li>
                </ul>
            )}
        </>
    )}
</div>
          </div>
  
          <div className="post-details">
          <div className="post-meta">
              <h2 className="post-title">{post.recipeTitle}</h2>
              <p className="post-category">
  <span className="field-label">📄 Category:</span> {post.category.join(", ")}
</p>

<p className="post-difficulty">
  <span className="field-label">⚪ Difficulty:</span> {post.difficulty}
</p>
<div className="post-prep-time1">
<p className="post-prep-time">
  <span style={{ color: '#bda595', fontWeight: 'bold' }}>⏱️ Prep Time:</span> {post.prepTime} min
</p>

</div>

              </div>
          </div>

          <div className="post-section">
            <h4 className="section-title">🧂 Ingredients:</h4>
            <ul className="post-list1">
                {post.ingredients.map((ingredient, index) => (
                    <li key={index}>{ingredient}</li>
             ))}
            </ul>
           </div>

           <div className="post-section">
                <h4 className="section-title">📋 Instructions:</h4>
                <div className="preserved-text">
                {post.instructions.map((instruction, index) => (
                    <li key={index}>{instruction}</li>
                ))}
                </div>
            </div>
  
          {post.imageUrl && <img src={post.imageUrl} alt={post.recipeTitle} className="post-image" />}
  
          <div className="post-stats">
              <span>Likes: {likesCount}</span>
              <span>Comments: {commentsCount}</span>
          </div>
  
          <div className="post-actions">
              <button className={`like-btn ${liked ? "liked" : ""}`} onClick={handleLike}>
                  <FaHeart /> Like
              </button>
              <button className="comment-btn" onClick={() => setShowComments(!showComments)}>
                  <FaComment /> Comment
              </button>
              <button className="nutrition-btn" onClick={handleGetNutrition}>
                  <RiRobot2Fill />  Generate nutrition value by AI
                </button>
                {loadingNutrition && <span className="loading-text">Loading...</span>}
                {nutrition && (
                    <span className="nutrition-info">
                        Calories: {nutrition.calories}, Protein: {nutrition.protein}g, Sugar: {nutrition.sugar}g
                    </span>
                )}
          </div>
  
          {showComments && (
              <div className="comments-section">
                  <textarea placeholder="Write a comment..." value={commentText} onChange={(e) => setCommentText(e.target.value)} />
                  <button className="submit-comment" onClick={handleAddComment}>Post</button>
  
                  <div className="previous-comments">
                  {comments.length > 0 ? (
  comments.map(comment => (
    <div key={comment._id} className="comment-item">
  {comment.author._id === userId && (
    <button
      onClick={async () => {
        try {
          await deleteComment(comment._id);
          setComments(prev => prev.filter(c => c._id !== comment._id));
          setCommentsCount(prev => prev - 1);
        } catch (err) {
          console.error("Error deleting comment:", err);
        }
      }}
      className="delete-comment-btn"
      title="Delete comment"
    >
      ✖
    </button>
  )}

  <img
    src={comment.author.imgUrl || "https://example.com/default-profile.png"}
    alt={comment.author.username}
    className="comment-author-img"
  />

  <div className="comment-content">
    <strong>{comment.author.username}</strong>
    <p>{comment.content}</p>
  </div>
</div>

  ))
) : (
  <p>No comments yet. Be the first to comment!</p>
)}

                  </div>
              </div>
          )}
  
          <PostUpdatePage
              isOpen={isEditModalOpen}
              onClose={() => setIsEditModalOpen(false)}
              onPostUpdated={() => {
                  setIsEditModalOpen(false);
                  onDelete();
              }}
              post={post}
          />
      </div>
  );
  
};

export default PostItem;