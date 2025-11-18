"use client";

import { memo } from "react";
import { Token } from "@/types/token";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { formatCurrency, formatCompact, formatPercent } from "@/lib/utils";

interface TokenModalProps {
  token: Token | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

/**
 * Token details modal component
 * Memoized for performance optimization
 */
export const TokenModal = memo(function TokenModal({
  token,
  open,
  onOpenChange,
}: TokenModalProps) {
  if (!token) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>{token.name} ({token.symbol})</DialogTitle>
          <DialogDescription>
            Detailed information about {token.symbol}
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-muted-foreground">Price</p>
              <p className="text-lg font-semibold">{formatCurrency(token.price)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">24h Change</p>
              <p
                className={`text-lg font-semibold ${
                  token.change24h >= 0
                    ? "text-green-600 dark:text-green-400"
                    : "text-red-600 dark:text-red-400"
                }`}
              >
                {formatPercent(token.change24h)}
              </p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">24h Volume</p>
              <p className="text-lg font-semibold">{formatCurrency(token.volume24h)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Liquidity</p>
              <p className="text-lg font-semibold">{formatCurrency(token.liquidity)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Market Cap</p>
              <p className="text-lg font-semibold">{formatCurrency(token.marketCap)}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-muted-foreground">Trading Pair</p>
              <p className="text-lg font-semibold">{token.pair}</p>
            </div>
          </div>
          {token.migratedFrom && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground">Migrated From</p>
              <p className="text-lg font-semibold">{token.migratedFrom}</p>
            </div>
          )}
          {token.finalStretchDays && (
            <div className="border-t pt-4">
              <p className="text-sm font-medium text-muted-foreground">Final Stretch</p>
              <p className="text-lg font-semibold">{token.finalStretchDays} days remaining</p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
});

