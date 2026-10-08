import { useQuery } from "@tanstack/react-query";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/useAuthStore";

export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const updateUser = useAuthStore((state) => state.updateUser);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: async () => {
      const user = await authApi.getCurrentUser();
      if (user) {
        updateUser(user);
      }
      return user;
    },
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
