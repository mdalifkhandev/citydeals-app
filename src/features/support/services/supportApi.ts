import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";

export interface CreateSupportTicketPayload {
  fullName: string;
  email: string;
  subject?: string;
  message: string;
}

export interface SupportTicketResponse {
  id: string;
  userId?: string | null;
  fullName: string;
  email: string;
  message: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

export const supportApi = {
  /**
   * Submit a new support ticket (Guest or Authenticated user)
   */
  createTicket: async (
    payload: CreateSupportTicketPayload
  ): Promise<SupportTicketResponse> => {
    const { data } = await apiClient.post<any>(
      ENDPOINTS.SUPPORT.CREATE_TICKET,
      payload
    );
    return data?.data || data;
  },
};
