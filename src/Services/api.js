const BASE_URL = "https://jsonplaceholder.typicode.com";

// POST request
export const createPost = async (data) => {
  try {
    const res = await fetch(`${BASE_URL}/posts`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    });

    const result = await res.json();
    return result;
  } catch (error) {
    console.log("Error:", error);
    return null;
  }
};

// GET request
export const getPosts = async (limit = 10) => {
  try {
    const res = await fetch(`${BASE_URL}/posts?_limit=${limit}`);
    const result = await res.json();
    return result;
  } catch (error) {
    console.log("Error:", error);
    return [];
  }
};
