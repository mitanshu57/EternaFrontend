"use client";

import { memo } from "react";
import { Token } from "@/types/token";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { MoreVertical, Info, TrendingUp, ArrowRight } from "lucide-react";

interface TokenActionsProps {
  token: Token;
}

/**
 * Token actions component with popover menu
 * Memoized for performance optimization
 */
export const TokenActions = memo(function TokenActions({
  token,
}: TokenActionsProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={(e) => e.stopPropagation()}
        >
          <MoreVertical className="h-4 w-4" />
          <span className="sr-only">More actions</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56" align="end" onClick={(e) => e.stopPropagation()}>
        <div className="space-y-1">
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={(e) => {
              e.stopPropagation();
              // Handle view details
            }}
          >
            <Info className="mr-2 h-4 w-4" />
            View Details
          </Button>
          <Button
            variant="ghost"
            className="w-full justify-start"
            onClick={(e) => {
              e.stopPropagation();
              // Handle trade
            }}
          >
            <TrendingUp className="mr-2 h-4 w-4" />
            Trade
          </Button>
          {token.migratedFrom && (
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={(e) => {
                e.stopPropagation();
                // Handle view migration
              }}
            >
              <ArrowRight className="mr-2 h-4 w-4" />
              View Migration
            </Button>
          )}
        </div>
      </PopoverContent>
    </Popover>
  );
});

