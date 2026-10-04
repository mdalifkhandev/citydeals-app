import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { couponsApi } from "../services/couponsApi";
import { CouponFilterParams } from "../types";
import { toast } from "sonner-native";

export const COUPONS_QUERY_KEY = ["coupons"] as const;
export const SAVED_COUPONS_QUERY_KEY = ["saved_coupons"] as const;

export const useCoupons = (filters?: CouponFilterParams) => {
  return useQuery({
    queryKey: [...COUPONS_QUERY_KEY, filters],
    queryFn: () => couponsApi.getCoupons(filters),
    staleTime: 1000 * 60 * 2, // 2 minutes cache
  });
};

export const useSavedCoupons = () => {
  return useQuery({
    queryKey: SAVED_COUPONS_QUERY_KEY,
    queryFn: couponsApi.getSavedCoupons,
    staleTime: 1000 * 60 * 5,
  });
};

export const useCouponBySlug = (shareSlug?: string) => {
  return useQuery({
    queryKey: ["coupon", shareSlug],
    queryFn: () => couponsApi.getCouponBySlug(shareSlug!),
    enabled: !!shareSlug,
  });
};

export const useToggleSaveCoupon = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ couponId, isSaved }: { couponId: string; isSaved: boolean }) => {
      if (isSaved) {
        return couponsApi.unsaveCoupon(couponId);
      } else {
        return couponsApi.saveCoupon(couponId);
      }
    },
    onSuccess: (_data, variables) => {
      queryClient.invalidateQueries({ queryKey: SAVED_COUPONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEY });
      toast.success(variables.isSaved ? "Removed from saved deals" : "Deal saved to your list!");
    },
    onError: () => {
      toast.error("Failed to update saved deal");
    },
  });
};
