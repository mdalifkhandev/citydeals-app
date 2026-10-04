import { useMutation, useQueryClient } from "@tanstack/react-query";
import { router } from "expo-router";
import { authApi } from "../services/authApi";
import { tokenService } from "../services/tokenService";
import { useAuthStore } from "../store/useAuthStore";
import { handleApiError } from "../../../utils/errorHandler";
import { toast } from "sonner-native";
import { locationService } from "../../location/services/locationService";
import { useLocationStore } from "../../location/store/useLocationStore";

export const useAuthMutations = () => {
  const queryClient = useQueryClient();
  const setSession = useAuthStore((state) => state.setSession);
  const clearSession = useAuthStore((state) => state.clearSession);

  const handleSuccess = async (data: any, redirectPath?: string) => {
    await tokenService.saveTokens(data.tokens);
    setSession(data.user);
    useAuthStore.getState().setOnboardingCompleted(true);

    const coords = useLocationStore.getState().coords;
    if (coords) {
      locationService.syncLocationWithBackend(coords).catch(() => {});
    }

    if (redirectPath) {
      router.replace(redirectPath as any);
    }
  };

  const loginMutation = useMutation({
    mutationFn: authApi.login,
    onSuccess: (data) => {
      handleSuccess(data, "/(tabs)");
      toast.success("Welcome back!", { description: "You have successfully logged in." });
    },
    onError: (error) => {
      toast.error("Login Failed", { description: handleApiError(error) });
    },
  });

  const adminLoginMutation = useMutation({
    mutationFn: authApi.adminLogin,
    onSuccess: (data) => {
      if (data.user.role !== "ADMIN") {
        toast.warning("Access Denied", { description: "You don't have admin privileges." });
        return;
      }
      handleSuccess(data, "/admin");
      toast.success("Admin Access Granted");
    },
    onError: (error) => {
      toast.error("Admin Login Failed", { description: handleApiError(error) });
    },
  });

  const signupMutation = useMutation({
    mutationFn: authApi.register,
    onSuccess: (data) => {
      handleSuccess(data, "/(tabs)");
      toast.success("Account Created", { description: "Welcome to CityDeals!" });
    },
    onError: (error) => {
      toast.error("Signup Failed", { description: handleApiError(error) });
    },
  });

  const logoutMutation = useMutation({
    mutationFn: authApi.logout,
    onSettled: async () => {
      // Regardless of success/failure of the logout API call, clear local state
      queryClient.clear();
      await tokenService.clearTokens();
      clearSession();
      router.replace("/(auth)/login" as any);
      toast.success("Logged out successfully");
    },
  });

  return {
    loginMutation,
    adminLoginMutation,
    signupMutation,
    logoutMutation,
  };
};
