import toast from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { userAPI } from "../utils/api";
import { useAuth } from "../contexts/useAuth.js";

const useFollowUnfollow = () => {
  const queryClient = useQueryClient();
  const { checkAuthStatus } = useAuth();

  const { mutate: followUnfollow, isPending } = useMutation({
    mutationFn: (userId) => userAPI.followUser(userId),
    onSuccess: (data) => {
      // Refresh user data to update following list
      checkAuthStatus();

      // Show success toast
      if (data.message.includes("followed")) {
        toast.success("User followed successfully!");
      } else if (data.message.includes("unfollowed")) {
        toast.success("User unfollowed successfully!");
      }

      Promise.all([
        queryClient.invalidateQueries({ queryKey: ["suggestedUsers"] }),
        queryClient.invalidateQueries({ queryKey: ["userProfile"] }),
      ]);
    },
    onError: (error) => {
      toast.error(error.message || "Something went wrong");
    },
  });

  return { followUnfollow, isPending };
};

export default useFollowUnfollow;
