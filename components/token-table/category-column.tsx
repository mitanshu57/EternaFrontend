"use client";

import { memo, useMemo, useState } from "react";
import { Token, TokenCategory } from "@/types/token";
import { TokenCard } from "./token-card";
import { Skeleton } from "@/components/ui/skeleton";
import { Filter, Zap, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";
import { SortableColumn } from "@/types/token";

interface CategoryColumnProps {
  category: TokenCategory;
  tokens: Token[];
  isLoading: boolean;
  sortColumn: SortableColumn | null;
  sortDirection: "asc" | "desc";
  onSort: (column: SortableColumn) => void;
  onTokenClick: (token: Token) => void;
}

const categoryLabels: Record<TokenCategory, string> = {
  "new-pairs": "New Pairs",
  "final-stretch": "Final Stretch",
  "migrated": "Migrated",
};

/**
 * Category column component displaying tokens for a specific category
 * Memoized for performance optimization
 */
export const CategoryColumn = memo(function CategoryColumn({
  category,
  tokens,
  isLoading,
  sortColumn,
  sortDirection,
  onSort,
  onTokenClick,
}: CategoryColumnProps) {
  const categoryLabel = categoryLabels[category];
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPreset, setSelectedPreset] = useState<"P1" | "P2" | "P3">("P1");

  const filteredAndSortedTokens = useMemo(() => {
    let filtered = tokens;

    // Apply search filter
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (token) =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query) ||
          token.pair.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered = [...filtered].sort((a, b) => {
        const aVal = a[sortColumn];
        const bVal = b[sortColumn];

        if (typeof aVal === "number" && typeof bVal === "number") {
          return sortDirection === "asc" ? aVal - bVal : bVal - aVal;
        }

        if (typeof aVal === "string" && typeof bVal === "string") {
          return sortDirection === "asc"
            ? aVal.localeCompare(bVal)
            : bVal.localeCompare(aVal);
        }

        return 0;
      });
    }

    return filtered;
  }, [tokens, searchQuery, sortColumn, sortDirection]);

  const content = useMemo(() => {
    if (isLoading) {
      return (
        <div className="space-y-3 p-3">
          {Array.from({ length: 5 }).map((_, i) => (
            <Skeleton key={i} className="h-24 w-full" />
          ))}
        </div>
      );
    }

    if (filteredAndSortedTokens.length === 0) {
      return (
        <div className="p-8 text-center text-muted-foreground text-sm">
          No tokens in this category
        </div>
      );
    }

    return (
      <div className="space-y-2 p-2">
        {filteredAndSortedTokens.map((token) => (
          <TokenCard key={token.id} token={token} onTokenClick={onTokenClick} />
        ))}
      </div>
    );
  }, [isLoading, filteredAndSortedTokens, onTokenClick]);

  return (
    <div className="flex flex-col h-full min-w-0 bg-card border border-border rounded-lg overflow-hidden">
      {/* Category Header */}
      <div className="px-3 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center justify-between mb-2">
          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">{categoryLabel}</h3>
            <Button
              variant="ghost"
              size="icon"
              className="h-5 w-5"
              aria-label={`Filter ${categoryLabel}`}
            >
              <Filter className="h-3 w-3" />
            </Button>
          </div>
          <div className="flex items-center gap-1">
            <Button
              variant={selectedPreset === "P1" ? "default" : "outline"}
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setSelectedPreset("P1")}
            >
              P1
            </Button>
            <Button
              variant={selectedPreset === "P2" ? "default" : "outline"}
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setSelectedPreset("P2")}
            >
              P2
            </Button>
            <Button
              variant={selectedPreset === "P3" ? "default" : "outline"}
              size="sm"
              className="h-6 px-2 text-xs"
              onClick={() => setSelectedPreset("P3")}
            >
              P3
            </Button>
          </div>
        </div>

        {/* Search Bar */}
        <div className="relative">
          <SearchIcon className="absolute left-2 top-1/2 h-3 w-3 -translate-y-1/2 text-muted-foreground" />
          <Input
            type="text"
            placeholder="Search by ticker or name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="h-7 pl-7 text-xs"
          />
        </div>

        {/* Metrics Bar */}
        <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
          <Zap className="h-3 w-3" />
          <span>0</span>
          <span className="text-green-500">🟣</span>
        </div>
      </div>

      {/* Token Cards */}
      <div className="flex-1 overflow-y-auto">{content}</div>
    </div>
  );
});
