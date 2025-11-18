"use client";

import { memo } from "react";
import { ArrowUpDown, ArrowUp, ArrowDown } from "lucide-react";
import { cn } from "@/lib/utils";
import { SortableColumn } from "@/types/token";
import { Button } from "@/components/ui/button";

interface TableHeaderProps {
  column: SortableColumn;
  label: string;
  sortColumn: SortableColumn | null;
  sortDirection: "asc" | "desc";
  onSort: (column: SortableColumn) => void;
  className?: string;
}

/**
 * Table header component with sorting functionality
 * Memoized for performance optimization
 */
export const TableHeader = memo(function TableHeader({
  column,
  label,
  sortColumn,
  sortDirection,
  onSort,
  className,
}: TableHeaderProps) {
  const isSorted = sortColumn === column;
  const isAsc = isSorted && sortDirection === "asc";

  return (
    <th
      className={cn(
        "px-2 sm:px-4 py-2 sm:py-3 text-left text-[10px] sm:text-xs font-medium text-muted-foreground uppercase tracking-wider",
        className
      )}
    >
      <Button
        variant="ghost"
        size="sm"
        className="h-auto p-0 font-medium hover:bg-transparent"
        onClick={() => onSort(column)}
      >
        <span className="flex items-center gap-2">
          {label}
          {isSorted ? (
            isAsc ? (
              <ArrowUp className="h-3 w-3" />
            ) : (
              <ArrowDown className="h-3 w-3" />
            )
          ) : (
            <ArrowUpDown className="h-3 w-3 opacity-50" />
          )}
        </span>
      </Button>
    </th>
  );
});

