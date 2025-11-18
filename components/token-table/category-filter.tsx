"use client";

import { memo } from "react";
import { TokenCategory } from "@/types/token";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

interface CategoryFilterProps {
  selectedCategory: TokenCategory | "all";
  onCategoryChange: (category: TokenCategory | "all") => void;
}

const categories: Array<{ value: TokenCategory | "all"; label: string }> = [
  { value: "all", label: "All" },
  { value: "new-pairs", label: "New Pairs" },
  { value: "final-stretch", label: "Final Stretch" },
  { value: "migrated", label: "Migrated" },
];

/**
 * Category filter component
 * Memoized for performance optimization
 */
export const CategoryFilter = memo(function CategoryFilter({
  selectedCategory,
  onCategoryChange,
}: CategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-1.5 sm:gap-2">
      {categories.map((category) => (
        <Button
          key={category.value}
          variant={selectedCategory === category.value ? "default" : "outline"}
          size="sm"
          onClick={() => onCategoryChange(category.value)}
          className={cn(
            "text-xs sm:text-sm transition-all duration-150 h-8 sm:h-9 px-2 sm:px-3",
            selectedCategory === category.value && "shadow-md"
          )}
        >
          {category.label}
        </Button>
      ))}
    </div>
  );
});

