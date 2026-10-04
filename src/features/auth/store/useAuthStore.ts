import { create } from "zustand";
import { User } from "../types";
import { tokenService } from "../services/tokenService";

interface AuthState {
  user: User | null;
  role: "USER" | "ADMIN" | "ADVERTISER" | null;
  isAuthenticated: boolean;
  isLoading: boolean;

  setSession: (user: User) => void;
  clearSession: () => void;
  updateUser: (partial: Partial<User>) => void;
  setIsLoading: (isLoading: boolean) => void;
}

export const useAuthStore = create<AuthState>()((set) => ({
  user: null,
  role: null,
  isAuthenticated: false,
  isLoading: true, // Initially true while we load tokens

  setSession: (user) =>
    set({
      user,
      role: user.role,
      isAuthenticated: true,
      isLoading: false,
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
}));
