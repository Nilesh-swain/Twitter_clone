import { useState, useEffect } from "react";
import { authAPI } from "../utils/api.js";
import { AuthContext } from "./useAuth.js";

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true); // Set to true for initial check

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getMe();

      // handle both possible response shapes
      const currentUser = response.user || response.data?.user || response;
      setUser(currentUser);
      console.log("✅ Authenticated user:", currentUser);
    } catch (error) {
      if (error.status === 401) {
        console.log("⚠️ User not authenticated");
      } else {
        console.error("❌ Auth check failed:", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  // Check auth status on app load
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const loggedInUser = response.user || response.data?.user || response;
      setUser(loggedInUser);
      console.log("✅ User logged in:", loggedInUser);
      return loggedInUser;
    } catch (error) {
      console.error("❌ Login failed:", error);
      throw error;
    }
  };

  const signup = async (userData) => {
    try {
      const response = await authAPI.signup(userData);
      const newUser = response.user || response.data?.user || response;
      console.log("✅ Signup successful:", newUser);
      return newUser;
    } catch (error) {
      console.error("❌ Signup failed:", error);
      throw error;
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
      console.log("👋 Logged out successfully");
    } catch (error) {
      console.error("⚠️ Logout error:", error);
    } finally {
      setUser(null); // Always clear local state
      // Optionally, redirect to login page or refresh the page
      window.location.href = '/login'; // Force redirect to login page
    }
  };

  const value = {
    user,
    loading,
    login,
    signup,
    logout,
    checkAuthStatus,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
