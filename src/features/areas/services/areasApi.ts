import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { AreaItem } from "../types";

export const areasApi = {
  getAreas: async (): Promise<AreaItem[]> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.AREAS.LIST);
    return data?.data || data || [];
  },

  resolveArea: async (coords: { latitude: number; longitude: number }): Promise<AreaItem | null> => {
    try {
      const { data } = await apiClient.get<any>(ENDPOINTS.AREAS.RESOLVE, {
        params: {
          latitude: coords.latitude,
          longitude: coords.longitude,
        },
      });
      return data?.data || data || null;
    } catch {
      return null;
    }
  },
};
