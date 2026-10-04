import { useQuery } from "@tanstack/react-query";
import { authApi } from "../services/authApi";
import { useAuthStore } from "../store/useAuthStore";

export const useCurrentUser = () => {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  return useQuery({
    queryKey: ["currentUser"],
    queryFn: authApi.getCurrentUser,
    enabled: isAuthenticated,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
};
