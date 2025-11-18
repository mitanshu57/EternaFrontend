"use client";

import { memo, ReactNode } from "react";
import { cn } from "@/lib/utils";
import { getPriceDirection } from "@/lib/utils";

interface TableCellProps {
  children: ReactNode;
  className?: string;
  priceDirection?: "up" | "down" | "neutral";
  onClick?: (e: React.MouseEvent<HTMLTableCellElement>) => void;
}

/**
 * Table cell component with price update animations
 * Memoized for performance optimization
 */
export const TableCell = memo(function TableCell({
  children,
  className,
  priceDirection,
  onClick,
}: TableCellProps) {
  const priceClass =
    priceDirection === "up"
      ? "price-up"
      : priceDirection === "down"
      ? "price-down"
      : "";

  return (
    <td
      className={cn(
        "px-2 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm whitespace-nowrap price-update",
        priceClass,
        onClick && "cursor-pointer hover:bg-muted/50",
        className
      )}
      onClick={onClick}
    >
      {children}
    </td>
  );
});

