import { createContext, useContext, useState, useEffect } from "react";
import { authAPI } from "../utils/api.js";

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Check login state once on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      const response = await authAPI.getMe();

      // handle both possible response shapes
      const currentUser = response.user || response.data?.user || response;
      setUser(currentUser);
      console.log("✅ Authenticated user:", currentUser);
    } catch (error) {
      if (error.response && error.response.status === 401) {
        console.log("⚠️ User not authenticated");
      } else {
        console.error("❌ Auth check failed:", error);
      }
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

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
