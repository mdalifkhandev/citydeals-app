import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { LegalDocument } from "../types";

export const legalApi = {
  getTerms: async (): Promise<LegalDocument> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.LEGAL.TERMS);
    return data?.data || data;
  },

  getPage: async (type: string): Promise<LegalDocument> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.LEGAL.PAGE(type));
    return data?.data || data;
  },

  getAllPages: async (): Promise<LegalDocument[]> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.LEGAL.PAGES);
    return data?.data || data;
  },
};
