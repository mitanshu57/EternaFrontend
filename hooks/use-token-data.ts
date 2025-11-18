"use client";

import { useQuery } from "@tanstack/react-query";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setTokens, setLoading, setError, applyFilters } from "@/store/tokenSlice";
import { generateMockTokens } from "@/lib/mock-data";
import { Token } from "@/types/token";
import { useEffect } from "react";

/**
 * Custom hook for fetching and managing token data
 */
export function useTokenData() {
  const dispatch = useAppDispatch();
  const { tokens, isLoading, error } = useAppSelector((state) => state.tokens);

  const { data, isLoading: queryLoading, error: queryError } = useQuery({
    queryKey: ["tokens"],
    queryFn: async (): Promise<Token[]> => {
      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      return generateMockTokens();
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  useEffect(() => {
    if (data) {
      dispatch(setTokens(data));
      dispatch(applyFilters());
    }
  }, [data, dispatch]);

  useEffect(() => {
    dispatch(setLoading(queryLoading));
  }, [queryLoading, dispatch]);

  useEffect(() => {
    if (queryError) {
      dispatch(setError(queryError.message));
    } else {
      dispatch(setError(null));
    }
  }, [queryError, dispatch]);

  return {
    tokens,
    isLoading: isLoading || queryLoading,
    error: error || (queryError ? queryError.message : null),
  };
}

