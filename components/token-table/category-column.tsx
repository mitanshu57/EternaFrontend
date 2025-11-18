"use client";

import { memo, useMemo } from "react";
import { Token, TokenCategory } from "@/types/token";
import { TokenRow } from "./token-row";
import { TableSkeleton } from "./table-skeleton";
import { TableHeader } from "./table-header";
import { Filter } from "lucide-react";
import { Button } from "@/components/ui/button";
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
  const sortedTokens = useMemo(() => {
    if (!sortColumn) return tokens;
    return [...tokens].sort((a, b) => {
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
  }, [tokens, sortColumn, sortDirection]);

  const tableContent = useMemo(() => {
    if (isLoading) {
      return <TableSkeleton />;
    }

    if (sortedTokens.length === 0) {
      return (
        <tr>
          <td colSpan={7} className="px-4 py-8 text-center text-muted-foreground text-sm">
            No tokens in this category
          </td>
        </tr>
      );
    }

    return sortedTokens.map((token) => (
      <TokenRow key={token.id} token={token} onTokenClick={onTokenClick} />
    ));
  }, [isLoading, sortedTokens, onTokenClick]);

  return (
    <div className="flex flex-col h-full min-w-0">
      {/* Category Header */}
      <div className="flex items-center justify-between px-2 sm:px-4 py-2 border-b border-border bg-muted/30">
        <div className="flex items-center gap-2">
          <h3 className="text-sm sm:text-base font-semibold">{categoryLabel}</h3>
          <Button
            variant="ghost"
            size="icon"
            className="h-6 w-6 sm:h-7 sm:w-7"
            aria-label={`Filter ${categoryLabel}`}
          >
            <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
          </Button>
        </div>
        <div className="flex items-center gap-1">
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs"
            aria-label="Preset 1"
          >
            P1
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs"
            aria-label="Preset 2"
          >
            P2
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-6 px-2 text-xs"
            aria-label="Preset 3"
          >
            P3
          </Button>
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 overflow-auto rounded-lg border border-border bg-card">
        <table className="w-full">
          <thead className="bg-muted/50 sticky top-0 z-10">
            <tr>
              <TableHeader
                column="symbol"
                label="Token"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="px-2 sm:px-4"
              />
              <TableHeader
                column="pair"
                label="Pair"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="hidden sm:table-cell px-2 sm:px-4"
              />
              <TableHeader
                column="price"
                label="Price"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="px-2 sm:px-4"
              />
              <TableHeader
                column="volume24h"
                label="24h Vol"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="hidden md:table-cell px-2 sm:px-4"
              />
              <TableHeader
                column="liquidity"
                label="Liquidity"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="hidden lg:table-cell px-2 sm:px-4"
              />
              <TableHeader
                column="marketCap"
                label="Market Cap"
                sortColumn={sortColumn}
                sortDirection={sortDirection}
                onSort={onSort}
                className="hidden md:table-cell px-2 sm:px-4"
              />
              <th className="px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider">
                <span className="sr-only sm:not-sr-only">Actions</span>
              </th>
            </tr>
          </thead>
          <tbody className="divide-y divide-border">{tableContent}</tbody>
        </table>
      </div>
    </div>
  );
});
