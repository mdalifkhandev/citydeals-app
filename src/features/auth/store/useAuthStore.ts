import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { User } from "../types";
import { tokenService } from "../services/tokenService";

interface AuthState {
  user: User | null;
  role: "USER" | "ADMIN" | "ADVERTISER" | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isHydrated: boolean;
  onboardingCompleted: boolean;

  setSession: (user: User) => void;
  clearSession: () => void;
  updateUser: (partial: Partial<User>) => void;
  setIsLoading: (isLoading: boolean) => void;
  setIsHydrated: (isHydrated: boolean) => void;
  setOnboardingCompleted: (completed: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      role: null,
      isAuthenticated: false,
      isLoading: false,
      isHydrated: false,
      onboardingCompleted: false,

      setSession: (user) =>
        set({
          user,
          role: user.role,
          isAuthenticated: true,
          isLoading: false,
          onboardingCompleted: true,
        }),

      clearSession: () => {
        tokenService.clearTokens();
        set({
          user: null,
          role: null,
          isAuthenticated: false,
          isLoading: false,
        });
      },

      updateUser: (partial) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...partial } : null,
        })),

      setIsLoading: (isLoading) => set({ isLoading }),
      setIsHydrated: (isHydrated) => set({ isHydrated }),
      setOnboardingCompleted: (onboardingCompleted) => set({ onboardingCompleted }),
    }),
    {
      name: "citydeals-auth-storage",
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        user: state.user,
        role: state.role,
        isAuthenticated: state.isAuthenticated,
        onboardingCompleted: state.onboardingCompleted,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setIsHydrated(true);
      },
    }
  )
);
