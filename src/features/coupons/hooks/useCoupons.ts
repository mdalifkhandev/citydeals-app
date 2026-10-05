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
    mutationFn: async ({
      couponId,
      isCurrentlySaved,
      isSaved,
    }: {
      couponId: string;
      isCurrentlySaved?: boolean;
      isSaved?: boolean;
    }) => {
      // isCurrentlySaved indicates if the coupon was already saved before this action
      const wasSaved = isCurrentlySaved !== undefined ? isCurrentlySaved : !!isSaved;
      if (wasSaved) {
        await couponsApi.unsaveCoupon(couponId);
        return { couponId, saved: false };
      } else {
        await couponsApi.saveCoupon(couponId);
        return { couponId, saved: true };
      }
    },
    onSuccess: (result) => {
      queryClient.invalidateQueries({ queryKey: SAVED_COUPONS_QUERY_KEY });
      queryClient.invalidateQueries({ queryKey: COUPONS_QUERY_KEY });
      if (result.saved) {
        toast.success("Deal saved to your list!");
      } else {
        toast.success("Removed from saved deals");
      }
    },
    onError: (err: any) => {
      const msg = err.response?.data?.message || err.message || "Failed to update saved deal";
      toast.error(Array.isArray(msg) ? msg[0] : msg);
    },
  });
};
