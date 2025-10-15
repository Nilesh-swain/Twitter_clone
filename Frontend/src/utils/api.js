const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "/api";

// Helper function to make API requests
const apiRequest = async (endpoint, options = {}) => {
  const url = `${API_BASE_URL}${endpoint}`;
  const config = {
    headers: options.body instanceof FormData ? {} : {
      "Content-Type": "application/json",
    },
    credentials: "include", // Include cookies for authentication
    ...options,
  };

  try {
    const response = await fetch(url, config);
    let data;
    try {
      data = await response.json();
    } catch {
      // If response is not JSON, fallback to text
      const text = await response.text();
      data = { error: text || response.statusText };
    }

    if (!response.ok) {
      const errorMessage = data.error || data.message || response.statusText || "Something went wrong";
      const error = new Error(`API Error ${response.status}: ${errorMessage}`);
      // Attach status for handling
      error.status = response.status;
      throw error;
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

  resendSignupOTP: async (email) => {
    return apiRequest("/auth/resend-signup-otp", {
      method: "POST",
      body: JSON.stringify({ email }),
    });
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

  searchUsers: async (query) => {
    return apiRequest(`/user/search?query=${encodeURIComponent(query)}`);
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
    const body = {};
    if (postData.text && postData.text.trim() !== '') {
      body.text = postData.text;
    }
    if (postData.imgUrl && postData.imgUrl.trim() !== '') {
      body.imgUrl = postData.imgUrl;
    }
    return apiRequest("/post/create", {
      method: "POST",
      body: JSON.stringify(body),
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

  commentOnPost: async (postId, comment, parentCommentId = null) => {
    const body = { text: comment };
    if (parentCommentId) {
      body.parentCommentId = parentCommentId;
    }
    return apiRequest(`/post/comment/${postId}`, {
      method: "POST",
      body: JSON.stringify(body),
    });
  },

  repostPost: async (postId) => {
    return apiRequest(`/post/repost/${postId}`, {
      method: "POST",
    });
  },

  bookmarkPost: async (postId) => {
    return apiRequest(`/post/bookmark/${postId}`, {
      method: "POST",
    });
  },

  getBookmarkedPosts: async () => {
    return apiRequest("/post/bookmarked");
  },

  getRepostedPosts: async (userId) => {
    return apiRequest(`/post/reposted/${userId}`);
  },
};

// Notification API functions
export const notificationAPI = {
  getNotifications: async () => {
    return apiRequest("/notification");
  },

  deleteAllNotifications: async () => {
    return apiRequest("/notification/delete", {
      method: "DELETE",
    });
  },

  deleteSingleNotification: async (notificationId) => {
    return apiRequest(`/notification/delete/${notificationId}`, {
      method: "DELETE",
    });
  },
};
