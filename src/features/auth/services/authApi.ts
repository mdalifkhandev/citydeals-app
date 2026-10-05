import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { AuthResponse, User } from "../types";

export const authApi = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post<any>(ENDPOINTS.AUTH.LOGIN, credentials);
    return data?.data || data;
  },

  adminLogin: async (credentials: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post<any>(ENDPOINTS.AUTH.ADMIN_LOGIN, credentials);
    return data?.data || data;
  },

  register: async (credentials: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post<any>(ENDPOINTS.AUTH.REGISTER, credentials);
    return data?.data || data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  getCurrentUser: async (): Promise<User> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.AUTH.ME);
    return data?.data || data;
  },

  updateProfile: async (payload: {
    fullName?: string;
    phoneNumber?: string;
    profilePictureUrl?: string;
    dateOfBirth?: string;
  }): Promise<User> => {
    const { data } = await apiClient.patch<any>(ENDPOINTS.USERS.ME, payload);
    return data?.data || data;
  },

  forgotPassword: async (email: string): Promise<{ success: boolean; message: string; otp?: string }> => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.FORGOT_PASSWORD, { email });
    return data?.data || data;
  },

  verifyOtp: async (payload: { email: string; otp: string }): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.VERIFY_OTP, payload);
    return data?.data || data;
  },

  resetPassword: async (payload: {
    email: string;
    otp: string;
    newPassword: string;
    confirmPassword: string;
  }): Promise<{ success: boolean; message: string }> => {
    const { data } = await apiClient.post(ENDPOINTS.AUTH.RESET_PASSWORD, payload);
    return data?.data || data;
  },
};
