"use client";

import { useCallback, useState, useMemo } from "react";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { setSort, setSearchQuery } from "@/store/tokenSlice";
import { useTokenData } from "@/hooks/use-token-data";
import { useWebSocket } from "@/hooks/use-websocket";
import { Token, TokenCategory } from "@/types/token";
import { TokenModal } from "./token-table/token-modal";
import { CategoryColumn } from "./token-table/category-column";
import { FiltersSidebar } from "./filters-sidebar";
import { ErrorBoundary } from "./token-table/error-boundary";
import { AlertCircle, Filter } from "lucide-react";
import { Button } from "./ui/button";
import { cn } from "@/lib/utils";
import { SortableColumn } from "@/types/token";

/**
 * Main token trading table component
 * Displays all three categories (New Pairs, Final Stretch, Migrated) in separate columns
 * Implements all core features: sorting, filtering, real-time updates, loading states
 */
export function TokenTradingTable() {
  const dispatch = useAppDispatch();
  const { tokens: allTokens, sortColumn, sortDirection, searchQuery, isLoading, error } =
    useAppSelector((state) => state.tokens);

  const { tokens: fetchedTokens } = useTokenData();
  const [selectedToken, setSelectedToken] = useState<Token | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<TokenCategory>("new-pairs");

  // Connect WebSocket for real-time updates
  useWebSocket(allTokens.length > 0 ? allTokens : fetchedTokens);

  // Memoized handlers for performance
  const handleSort = useCallback(
    (column: SortableColumn) => {
      const newDirection =
        sortColumn === column && sortDirection === "desc" ? "asc" : "desc";
      dispatch(setSort({ column, direction: newDirection }));
    },
    [sortColumn, sortDirection, dispatch]
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

  // Group tokens by category and apply search filter
  const categorizedTokens = useMemo(() => {
    const categories: Record<TokenCategory, Token[]> = {
      "new-pairs": [],
      "final-stretch": [],
      "migrated": [],
    };

    let tokensToFilter = allTokens.length > 0 ? allTokens : fetchedTokens;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      tokensToFilter = tokensToFilter.filter(
        (token) =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.pair.toLowerCase().includes(query)
      );
    }

    // Group by category
    tokensToFilter.forEach((token) => {
      if (categories[token.category]) {
        categories[token.category].push(token);
      }
    });

    return categories;
  }, [allTokens, fetchedTokens, searchQuery]);

  if (error) {
    return (
      <ErrorBoundary>
        <div className="flex flex-col items-center justify-center p-8 text-center">
          <AlertCircle className="h-12 w-12 text-destructive mb-4" />
          <p className="text-sm text-muted-foreground">{error}</p>
        </div>
      </ErrorBoundary>
    );
  }

  return (
    <ErrorBoundary>
      <div className="relative flex h-[calc(100vh-200px)] min-h-[600px]">
        {/* Filters Sidebar */}
        <FiltersSidebar
          open={isFiltersOpen}
          onClose={() => setIsFiltersOpen(false)}
          selectedCategory={selectedCategory}
          onCategoryChange={setSelectedCategory}
        />

        {/* Main Content */}
        <div className={cn(
          "flex-1 transition-all duration-300",
          isFiltersOpen && "ml-80"
        )}>
          {/* Top Bar with Filter Toggle */}
          <div className="flex items-center justify-between mb-4 px-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsFiltersOpen(!isFiltersOpen)}
              className="gap-2"
            >
              <Filter className="h-4 w-4" />
              Filters
            </Button>
          </div>

          {/* Three Column Layout */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 h-full px-4">
            <CategoryColumn
              category="new-pairs"
              tokens={categorizedTokens["new-pairs"]}
              isLoading={isLoading}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              onTokenClick={handleTokenClick}
            />
            <CategoryColumn
              category="final-stretch"
              tokens={categorizedTokens["final-stretch"]}
              isLoading={isLoading}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              onTokenClick={handleTokenClick}
            />
            <CategoryColumn
              category="migrated"
              tokens={categorizedTokens["migrated"]}
              isLoading={isLoading}
              sortColumn={sortColumn}
              sortDirection={sortDirection}
              onSort={handleSort}
              onTokenClick={handleTokenClick}
            />
          </div>
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

