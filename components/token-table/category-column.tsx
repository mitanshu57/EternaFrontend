"use client";

import { memo, useMemo, useState } from "react";
import { Token, TokenCategory, SortableColumn } from "@/types/token";
import { TokenCard } from "./token-card";
import { Button } from "@/components/ui/button";
import { Filter, Zap, Search } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { FilterModal } from "./filter-modal";

interface CategoryColumnProps {
  category: TokenCategory;
  tokens: Token[];
  sortColumn: SortableColumn | null;
  sortDirection: "asc" | "desc";
  onSort: (column: SortableColumn, category: TokenCategory) => void;
  onTokenClick: (token: Token) => void;
  isLoading: boolean;
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
  sortColumn,
  sortDirection,
  onSort,
  onTokenClick,
  isLoading,
}: CategoryColumnProps) {
  const [localSearch, setLocalSearch] = useState("");
  const [preset, setPreset] = useState<"P1" | "P2" | "P3">("P1");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  const sortedTokens = useMemo(() => {
    let filtered = [...tokens];

    // Filter by local search
    if (localSearch) {
      const query = localSearch.toLowerCase();
      filtered = filtered.filter(
        (token) =>
          token.symbol.toLowerCase().includes(query) ||
          token.name.toLowerCase().includes(query)
      );
    }

    // Apply sorting
    if (sortColumn) {
      filtered.sort((a, b) => {
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
  }, [tokens, sortColumn, sortDirection, localSearch]);

  const categoryLabel = categoryLabels[category];

  return (
    <div className="flex flex-col h-full min-w-0 flex-1 border-r border-border last:border-r-0 bg-background">
      {/* Category Header */}
      <div className="px-4 py-3 space-y-3 bg-card border-b border-border sticky top-0 z-10">
        {/* Title */}
        <h3 className="text-xl font-bold text-foreground">{categoryLabel}</h3>

        {/* Search and Controls */}
        <div className="flex items-center gap-2">
          {/* Search Bar */}
          <div className="relative flex-1">
            <Search className="absolute left-2 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
            <Input
              type="text"
              placeholder="Search by ticker or name"
              value={localSearch}
              onChange={(e) => setLocalSearch(e.target.value)}
              className="pl-8 h-8 text-xs bg-muted/50 border-border"
            />
          </div>

          {/* Lightning Icon with Count */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md bg-muted/50"
            aria-label="Lightning"
          >
            <Zap className="h-3.5 w-3.5" />
            <span className="absolute -bottom-1 -right-1 text-[10px] bg-primary text-primary-foreground rounded-full h-4 w-4 flex items-center justify-center">
              0
            </span>
          </Button>

          {/* Solana Logo */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md bg-muted/50 p-1"
            aria-label="Solana"
          >
            <div className="w-full h-full bg-gradient-to-br from-purple-500 via-blue-500 to-cyan-500 rounded flex items-center justify-center">
              <span className="text-[10px] font-bold text-white">S</span>
            </div>
          </Button>

          {/* P1 P2 P3 Preset Buttons */}
          <div className="flex items-center rounded-md bg-muted/50 p-0.5 border border-border">
            {(["P1", "P2", "P3"] as const).map((p) => (
              <button
                key={p}
                onClick={() => setPreset(p)}
                className={cn(
                  "px-2 py-1 text-xs font-medium rounded transition-colors",
                  preset === p
                    ? "bg-primary text-primary-foreground"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {p}
              </button>
            ))}
          </div>

          {/* Filter Icon */}
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 rounded-md bg-muted/50"
            aria-label="Filter"
            onClick={() => setIsFilterOpen(true)}
          >
            <Filter className="h-3.5 w-3.5" />
          </Button>
          
          {/* Filter Modal */}
          <FilterModal open={isFilterOpen} onOpenChange={setIsFilterOpen} />
        </div>
      </div>

      {/* Tokens List */}
      <div className="flex-1 overflow-y-auto">
        {isLoading ? (
          <div className="divide-y divide-border">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="px-4 py-3">
                <div className="space-y-2">
                  <div className="h-4 bg-muted rounded w-3/4 animate-pulse" />
                  <div className="h-3 bg-muted rounded w-1/2 animate-pulse" />
                </div>
              </div>
            ))}
          </div>
        ) : sortedTokens.length === 0 ? (
          <div className="px-4 py-8 text-center text-sm text-muted-foreground">
            No tokens in this category
          </div>
        ) : (
          <div className="divide-y divide-border">
            {sortedTokens.map((token) => (
              <TokenCard
                key={token.id}
                token={token}
                onTokenClick={onTokenClick}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
});
