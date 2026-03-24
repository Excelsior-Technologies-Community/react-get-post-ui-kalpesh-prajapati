import { useState } from "react";
import { createPost } from "../Services/api";

function PostForm() {
  const [title, setTitle] = useState("");
  const [body, setBody] = useState("");
  const [posts, setPosts] = useState([]);

  // Removed initial fetch to keep list clean

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title || !body) return;

    const newPost = {
      title: title,
      body: body,
      userId: 1,
    };

    const res = await createPost(newPost);
    if (res) {
      // JSONPlaceholder always returns same ID (101) for new posts,
      // so we use Date.now() for unique local keys
      setPosts([{ ...res, id: Date.now() }, ...posts]);
      setTitle("");
      setBody("");
    }
  };

  return (
    <div className="container">
      <h1>Get- set-Post </h1>

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
        <button type="submit">Add Post (POST)</button>
      </form>

      <div className="posts-list">
        <h2>Posts</h2>
        {posts.length === 0 ? (
          <p>No posts yet. Add one above!</p>
        ) : (
          posts.map((post) => (
            <div key={post.id} className="post-item">
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export default PostForm;
