const API_BASE_URL = "http://localhost:9000/api";

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
    ...options,
  };

  try {
    const response = await fetch(url, config);
    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.error || "Something went wrong");
    }

    return data;
  } catch (error) {
    console.error("API Request Error:", error);
    throw error;
  }
};

// Auth API functions
export const authAPI = {
  signup: async (userData) => {
    return apiRequest("/auth/signup", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },

  login: async (credentials) => {
    return apiRequest("/auth/login", {
      method: "POST",
      body: JSON.stringify(credentials),
    });
  },

  logout: async () => {
    return apiRequest("/auth/logout", {
      method: "POST",
    });
  },

  getMe: async () => {
    return apiRequest("/auth/me");
  },
};

// User API functions
export const userAPI = {
  getProfile: async (username) => {
    return apiRequest(`/user/profile/${username}`);
  },

  followUser: async (userId) => {
    return apiRequest(`/user/follow/${userId}`, {
      method: "POST",
    });
  },

  getSuggestions: async () => {
    return apiRequest("/user/suggested");
  },

  updateUser: async (userData) => {
    return apiRequest("/user/update", {
      method: "POST",
      body: JSON.stringify(userData),
    });
  },
};

// Post API functions
export const postAPI = {
  getAllPosts: async () => {
    return apiRequest("/post/all");
  },

  getFollowingPosts: async () => {
    return apiRequest("/post/following");
  },

  getLikedPosts: async (userId) => {
    return apiRequest(`/post/likes/${userId}`);
  },

  getUserPosts: async (username) => {
    return apiRequest(`/post/username/${username}`);
  },

  createPost: async (postData) => {
    return apiRequest("/post/create", {
      method: "POST",
      body: JSON.stringify(postData),
    });
  },

  deletePost: async (postId) => {
    return apiRequest(`/post/${postId}`, {
      method: "DELETE",
    });
  },

  likePost: async (postId) => {
    return apiRequest(`/post/like/${postId}`, {
      method: "POST",
    });
  },

  commentOnPost: async (postId, comment) => {
    return apiRequest(`/post/comment/${postId}`, {
      method: "POST",
      body: JSON.stringify({ text: comment }),
    });
  },
};

// Notification API functions
export const notificationAPI = {
  getNotifications: async () => {
    return apiRequest("/notification");
  },

  deleteAllNotifications: async () => {
    return apiRequest("/notification/delect", {
      method: "DELETE",
    });
  },
};

