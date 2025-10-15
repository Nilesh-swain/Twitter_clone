import { useQuery, useQueryClient } from "@tanstack/react-query";
import { authAPI } from "../utils/api.js";
import { AuthContext } from "./useAuth.js";

export const AuthProvider = ({ children }) => {
  const queryClient = useQueryClient();

  const { data: user, isLoading: loading } = useQuery({
    queryKey: ["authUser"],
    queryFn: async () => {
      try {
        const response = await authAPI.getMe();
        // handle both possible response shapes
        const currentUser = response.user || response.data?.user || response;
        console.log("✅ Authenticated user:", currentUser);
        return currentUser;
      } catch (error) {
        if (error.status === 401) {
          console.log("⚠️ User not authenticated");
          return null;
        }
        console.error("❌ Auth check failed:", error);
        throw error;
      }
    },
    retry: false,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const login = async (credentials) => {
    try {
      const response = await authAPI.login(credentials);
      const loggedInUser = response.user || response.data?.user || response;
      console.log("✅ User logged in:", loggedInUser);
      // Update the query data
      queryClient.setQueryData(["authUser"], loggedInUser);
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
      // Update the query data
      queryClient.setQueryData(["authUser"], newUser);
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
      // Clear the query data
      queryClient.setQueryData(["authUser"], null);
      // Optionally, redirect to login page or refresh the page
      window.location.href = '/login'; // Force redirect to login page
    }
  };

  const checkAuthStatus = async () => {
    // Refetch the auth user query
    await queryClient.invalidateQueries({ queryKey: ["authUser"] });
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
