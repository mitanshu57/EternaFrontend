"use client";

import { useCallback, useState, useEffect, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import {
  setSort,
  setSearchQuery,
  applyFilters,
} from "@/store/tokenSlice";
import { useTokenData } from "@/hooks/use-token-data";
import { useWebSocket } from "@/hooks/use-websocket";
import { Token, TokenCategory, SortableColumn } from "@/types/token";
import { CategoryColumn } from "./token-table/category-column";
import { TokenModal } from "./token-table/token-modal";
import { ErrorBoundary } from "./token-table/error-boundary";
import { AlertCircle } from "lucide-react";

/**
 * Main token trading table component
 * Implements all core features: sorting, filtering, real-time updates, loading states
 */
export function TokenTradingTable() {
  const dispatch = useAppDispatch();
  const { tokens: allTokens, sortColumn, sortDirection, searchQuery, isLoading, error } =
    useAppSelector((state) => state.tokens);

  const { tokens } = useTokenData();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [categorySort, setCategorySort] = useState<{
    column: SortableColumn | null;
    direction: "asc" | "desc";
    category: TokenCategory | null;
  }>({ column: null, direction: "desc", category: null });

  // Connect WebSocket for real-time updates
  useWebSocket(tokens);

  // Apply filters when dependencies change
  useEffect(() => {
    dispatch(applyFilters());
  }, [searchQuery, dispatch]);

  // Group tokens by category
  const tokensByCategory = useMemo(() => {
    const categories: Record<TokenCategory, Token[]> = {
      "new-pairs": [],
      "final-stretch": [],
      "migrated": [],
    };

    let filtered = [...allTokens];

    // Filter by search query
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (token) =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.pair.toLowerCase().includes(query)
      );
    }

    filtered.forEach((token) => {
      if (categories[token.category]) {
        categories[token.category].push(token);
      }
    });

    return categories;
  }, [allTokens, searchQuery]);

  // Memoized handlers for performance
  const handleSort = useCallback(
    (column: SortableColumn, category: TokenCategory) => {
      const newDirection =
        categorySort.column === column &&
        categorySort.category === category &&
        categorySort.direction === "desc"
          ? "asc"
          : "desc";
      setCategorySort({ column, direction: newDirection, category });
      dispatch(setSort({ column, direction: newDirection }));
    },
    [categorySort, dispatch]
  );

  const handleSearchChange = useCallback(
    (query: string) => {
      dispatch(setSearchQuery(query));
    },
    [dispatch]
  );

  const handleTokenClick = useCallback((token: Token) => {
    setSelectedToken(token);
    setIsModalOpen(true);
  }, []);

  const categories: TokenCategory[] = ["new-pairs", "final-stretch", "migrated"];

  return (
    <ErrorBoundary>
      <div className="h-full flex flex-col">
        {/* Error State */}
        {error && (
          <div className="px-4 py-2 border-b border-destructive bg-destructive/10">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <p className="text-xs text-destructive">{error}</p>
            </div>
          </div>
        )}

        {/* Three Column Layout */}
        <div className="flex-1 flex flex-col lg:flex-row border-t border-border overflow-hidden">
          {categories.map((category) => (
            <CategoryColumn
              key={category}
              category={category}
              tokens={tokensByCategory[category]}
              sortColumn={categorySort.category === category ? categorySort.column : null}
              sortDirection={categorySort.category === category ? categorySort.direction : "desc"}
              onSort={handleSort}
              onTokenClick={handleTokenClick}
              isLoading={isLoading}
            />
          ))}
        </div>

        {/* Token Details Modal */}
        <TokenModal
          token={selectedToken}
          open={isModalOpen}
          onOpenChange={setIsModalOpen}
        />
      </div>
    </ErrorBoundary>
  );
}

