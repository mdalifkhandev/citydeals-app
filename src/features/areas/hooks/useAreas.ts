import { useQuery } from "@tanstack/react-query";
import { areasApi } from "../services/areasApi";

export const AREAS_QUERY_KEY = ["areas"] as const;

export const useAreas = () => {
  return useQuery({
    queryKey: AREAS_QUERY_KEY,
    queryFn: areasApi.getAreas,
    staleTime: 1000 * 60 * 10, // 10 minutes cache
  });
};
