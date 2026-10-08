import { useQuery } from "@tanstack/react-query";
import { categoriesApi } from "../services/categoriesApi";

export const CATEGORIES_QUERY_KEY = ["categories"] as const;

export const useCategories = () => {
  return useQuery({
    queryKey: CATEGORIES_QUERY_KEY,
    queryFn: categoriesApi.getCategories,
    staleTime: 1000 * 60 * 15, // 15 minutes cache
  });
};
