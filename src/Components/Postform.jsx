import { useState } from "react";
import { createPost, deletePost, updatePost } from "../Services/api";

function PostForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState([]);
  const [editPostId, setEditPostId] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) return;

    if (editPostId) {
      // Logic for editing
      const updatedPostData = { title, body, userId: 1 };
      
      // Update local state IMMEDIATELY (Optimistic UI)
      // JSONPlaceholder doesn't actually persist the items we POST
      // So calling PUT for a post with ID from createPost will likely return 404
      setPosts(
        posts.map((post) => 
          post.id === editPostId ? { ...updatedPostData, id: editPostId } : post
        )
      );
      
      // Attempt API call in background
      await updatePost(editPostId, updatedPostData);
      
      setTitle("");
      setBody("");
      setEditPostId(null);
    } else {
      // Logic for adding
      const newPost = { title, body, userId: 1 };
      const res = await createPost(newPost);
      if (res) {
        // Use Date.now() for unique local keys that won't duplicate 
        // because JSONPlaceholder always returns id: 101 for new posts
        setPosts([{ ...res, id: Date.now() }, ...posts]);
        setTitle("");
        setBody("");
      }
    }
  };

  const handleEdit = (post) => {
    setTitle(post.title);
    setBody(post.body);
    setEditPostId(post.id);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleDelete = async (id) => {
    // Delete from state immediately
    setPosts(posts.filter((post) => post.id !== id));
    // Call API in background
    await deletePost(id);
  };

  const handleDeleteAll = () => {
    if (window.confirm("Are you sure you want to delete all posts?")) {
      setPosts([]);
    }
  };

  return (
    <div className="container">
      <h1>Get-set-Post</h1>

      <form className="post-form" onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Enter Title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
        />
        <textarea
          placeholder="Enter Body"
          value={body}
          rows="4"
          onChange={(e) => setBody(e.target.value)}
        />
        <div className="form-buttons">
          <button type="submit" className={editPostId ? "btn-update" : "btn-add"}>
            {editPostId ? "Update Post (PUT)" : "Add Post (POST)"}
          </button>
          {editPostId && (
            <button
              type="button"
              className="btn-cancel"
              onClick={() => {
                setTitle("");
                setBody("");
                setEditPostId(null);
              }}
            >
              Cancel Edit
            </button>
          )}
        </div>
      </form>

      <div className="posts-list">
        <div className="list-header">
          <h2>Posts</h2>
          {posts.length > 0 && (
            <button className="btn-delete-all" onClick={handleDeleteAll}>
              Delete All
            </button>
          )}
        </div>
        {posts.length === 0 ? (
          <p>No posts yet. Add one above!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <div className="post-content">
                <h3>{post.title}</h3>
                <p>{post.body}</p>
              </div>
              <div className="post-actions">
                <button className="btn-edit" onClick={() => handleEdit(post)}>
                  Edit
                </button>
                <button
                  className="btn-delete"
                  onClick={() => handleDelete(post.id)}
                >
                  Delete
                </button>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostForm;
