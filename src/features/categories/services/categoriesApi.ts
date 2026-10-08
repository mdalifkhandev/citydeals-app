import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { Category } from "../types";

export const categoriesApi = {
  getCategories: async (): Promise<Category[]> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.CATEGORIES.LIST);
    return data?.data || data || [];
  },
};
