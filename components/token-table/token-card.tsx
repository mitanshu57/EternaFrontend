"use client";

import { memo } from "react";
import { Token } from "@/types/token";
import { formatCurrency, formatCompact, formatPercent, getPriceDirection } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Zap, Globe, Search, Users, TrendingUp, Trophy, ExternalLink } from "lucide-react";

interface TokenCardProps {
  token: Token;
  onTokenClick: (token: Token) => void;
}

/**
 * Token card component matching Axiom Trade design
 * Displays token with image, metrics, and detailed information
 */
export const TokenCard = memo(function TokenCard({
  token,
  onTokenClick,
}: TokenCardProps) {
  const priceDirection = getPriceDirection(token.price, token.previousPrice);
  const isPositive = token.change24h >= 0;
  const address = token.id.slice(0, 4) + "..." + token.id.slice(-4);

  // Calculate time since creation
  const getTimeAgo = () => {
    const now = Date.now();
    const diff = now - token.createdAt;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);

    if (days > 0) return `${days}d`;
    if (hours > 0) return `${hours}h`;
    if (minutes > 0) return `${minutes}m`;
    return `${seconds}s`;
  };

  return (
    <TooltipProvider>
      <div
        className="bg-card border border-border rounded-lg p-3 hover:bg-muted/30 transition-colors cursor-pointer"
        onClick={() => onTokenClick(token)}
      >
        <div className="flex gap-3">
          {/* Left: Token Image/Icon */}
          <div className="flex-shrink-0">
            <div className="w-12 h-12 rounded bg-muted flex items-center justify-center relative border-2 border-border">
              <span className="text-lg font-bold">{token.symbol[0]}</span>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-destructive border-2 border-background flex items-center justify-center">
                <span className="text-[8px] text-destructive-foreground">/</span>
              </div>
            </div>
            <div className="text-[10px] text-muted-foreground mt-1 font-mono">
              {address}
            </div>
          </div>

          {/* Right: Token Details */}
          <div className="flex-1 min-w-0">
            {/* Name */}
            <div className="mb-1">
              <h4 className="font-semibold text-sm truncate">{token.name}</h4>
              <p className="text-xs text-muted-foreground truncate">{token.symbol}</p>
            </div>

            {/* Metrics Line 1 */}
            <div className="flex items-center gap-1.5 mb-2 text-xs text-muted-foreground">
              <span>{getTimeAgo()}</span>
              <Zap className="h-3 w-3" />
              <Globe className="h-3 w-3" />
              <Search className="h-3 w-3" />
              <span>2</span>
              <Users className="h-3 w-3" />
              <span>0</span>
              <TrendingUp className="h-3 w-3" />
              <span>0</span>
              <Trophy className="h-3 w-3" />
              <span className="text-primary">F {token.price.toFixed(3)}</span>
              <span className="text-primary">TX {Math.floor(Math.random() * 100)}</span>
            </div>

            {/* Market Cap and Volume */}
            <div className="flex items-center gap-4 mb-2">
              <div>
                <span className="text-xs text-muted-foreground">MC: </span>
                <span className="text-xs font-medium text-blue-500">
                  {formatCompact(token.marketCap)}
                </span>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">V: </span>
                <span className="text-xs font-medium">
                  {formatCompact(token.volume24h)}
                </span>
              </div>
            </div>

            {/* Percentage Bars */}
            <div className="flex items-center gap-2 text-xs">
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span>⭐</span>
                    <span className={isPositive ? "text-green-500" : "text-red-500"}>
                      {formatPercent(token.change24h)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Price change: {formatPercent(token.change24h)}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span>👨‍🍳</span>
                    <span className="text-muted-foreground">
                      {formatPercent(token.change24h)} {getTimeAgo()}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Liquidity pool percentage</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span>🎯</span>
                    <span className="text-muted-foreground">
                      {formatPercent(token.change24h)}
                    </span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Target percentage</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span>👻</span>
                    <span className="text-muted-foreground">0%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Ghost percentage</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <span>⚫</span>
                    <span className="text-muted-foreground">0%</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Additional metric</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});

