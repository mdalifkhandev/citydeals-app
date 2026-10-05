import { apiClient } from "../../../api/client";
import { ENDPOINTS } from "../../../api/endpoints";
import { Coupon, CouponFilterParams } from "../types";

export const couponsApi = {
  getCoupons: async (params?: CouponFilterParams): Promise<Coupon[]> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.COUPONS.LIST, { params });
    return data?.data || data || [];
  },

  getCouponBySlug: async (shareSlug: string): Promise<Coupon> => {
    const { data } = await apiClient.get<any>(`/coupons/public/${shareSlug}`);
    return data?.data || data;
  },

  saveCoupon: async (couponId: string): Promise<any> => {
    const { data } = await apiClient.post<any>(`/coupons/${couponId}/save`);
    return data?.data || data;
  },

  unsaveCoupon: async (couponId: string): Promise<any> => {
    const { data } = await apiClient.delete<any>(`/coupons/${couponId}/save`);
    return data?.data || data;
  },

  getCouponById: async (id: string): Promise<Coupon> => {
    const { data } = await apiClient.get<any>(`/coupons/${id}`);
    return data?.data || data;
  },

  redeemCoupon: async (couponId: string): Promise<any> => {
    const { data } = await apiClient.post<any>(`/coupons/${couponId}/redeem`);
    return data?.data || data;
  },

  getSavedCoupons: async (): Promise<Coupon[]> => {
    const { data } = await apiClient.get<any>(ENDPOINTS.COUPONS.SAVED);
    return data?.data || data || [];
  },
};
