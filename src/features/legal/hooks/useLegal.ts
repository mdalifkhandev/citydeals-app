import { useQuery } from "@tanstack/react-query";
import { legalApi } from "../services/legalApi";

export const LEGAL_TERMS_QUERY_KEY = ["legal_terms"] as const;

export const useTermsOfUse = () => {
  return useQuery({
    queryKey: LEGAL_TERMS_QUERY_KEY,
    queryFn: legalApi.getTerms,
    staleTime: 1000 * 60 * 10,
  });
};
