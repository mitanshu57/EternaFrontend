"use client";

import { memo } from "react";
import { Skeleton } from "@/components/ui/skeleton";

/**
 * Table skeleton loader component
 * Memoized for performance optimization
 */
export const TableSkeleton = memo(function TableSkeleton() {
  return (
    <>
      {Array.from({ length: 10 }).map((_, i) => (
        <tr key={i} className="border-b border-border">
          <td className="px-2 sm:px-4 py-2 sm:py-3">
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
          </td>
          <td className="hidden sm:table-cell px-2 sm:px-4 py-2 sm:py-3">
            <Skeleton className="h-3 sm:h-4 w-12 sm:w-16" />
          </td>
          <td className="px-2 sm:px-4 py-2 sm:py-3">
            <Skeleton className="h-3 sm:h-4 w-20 sm:w-24" />
          </td>
          <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3">
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
          </td>
          <td className="hidden lg:table-cell px-2 sm:px-4 py-2 sm:py-3">
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
          </td>
          <td className="hidden md:table-cell px-2 sm:px-4 py-2 sm:py-3">
            <Skeleton className="h-3 sm:h-4 w-16 sm:w-20" />
          </td>
          <td className="px-2 sm:px-4 py-2 sm:py-3">
            <Skeleton className="h-3 sm:h-4 w-8 sm:w-10" />
          </td>
        </tr>
      ))}
    </>
  );
});

