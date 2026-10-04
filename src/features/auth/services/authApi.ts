import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { AuthResponse } from "../types";

export const authApi = {
  login: async (credentials: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post<any>(ENDPOINTS.AUTH.LOGIN, credentials);
    return data.data;
  },

  adminLogin: async (credentials: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post<any>(ENDPOINTS.AUTH.ADMIN_LOGIN, credentials);
    return data.data;
  },

  register: async (credentials: any): Promise<AuthResponse> => {
    const { data } = await apiClient.post<any>(ENDPOINTS.AUTH.REGISTER, credentials);
    return data.data;
  },

  logout: async (): Promise<void> => {
    await apiClient.post(ENDPOINTS.AUTH.LOGOUT);
  },

  getCurrentUser: async (): Promise<AuthResponse> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.AUTH.ME);
    return data.data;
  }
};
