"use client";

import { memo } from "react";
import { Token } from "@/types/token";
import {
  formatCurrency,
  formatCompact,
  formatPercent,
  getPriceDirection,
} from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { TokenActions } from "./token-actions";
import { cn } from "@/lib/utils";
import { Search, Users, BarChart3, Trophy, Crown, Star, ChefHat, Target, Ghost, Boxes } from "lucide-react";
import { useState, useRef } from "react";

interface TokenCardProps {
  token: Token;
  onTokenClick: (token: Token) => void;
}

/**
 * Token card component matching the reference design
 * Memoized for performance optimization
 */
export const TokenCard = memo(function TokenCard({
  token,
  onTokenClick,
}: TokenCardProps) {
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const hoverTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const priceDirection = getPriceDirection(token.price, token.previousPrice);
  const isPositive = token.change24h >= 0;

  // Calculate time ago
  const getTimeAgo = () => {
    const now = Date.now();
    const diff = now - token.createdAt;
    const seconds = Math.floor(diff / 1000);
    const minutes = Math.floor(seconds / 60);
    const hours = Math.floor(minutes / 60);
    const days = Math.floor(hours / 24);
    const months = Math.floor(days / 30);

    if (seconds < 60) return `${seconds}s`;
    if (minutes < 60) return `${minutes}m`;
    if (hours < 24) return `${hours}h`;
    if (days < 30) return `${days}d`;
    return `${months}mo`;
  };

  // Generate mock metrics (matching reference)
  const metrics = {
    search: 3,
    users: 0,
    chart: 0,
    trophy: 0,
    crown: "2/11",
  };

  // Generate percentage bars (matching reference style)
  const percentages = [
    { value: Math.abs(token.change24h), time: getTimeAgo(), color: isPositive ? "green" : "red" },
    { value: 0, time: "", color: "green" },
    { value: 0, time: "", color: "green" },
  ];

  // Truncate address
  const truncateAddress = (address: string) => {
    if (address.length <= 8) return address;
    return `${address.slice(0, 4)}...${address.slice(-4)}`;
  };

  const tokenAddress = token.id.slice(0, 12);

  return (
    <TooltipProvider>
      <div
        className="group cursor-pointer hover:bg-muted/20 transition-colors duration-150"
        onClick={() => onTokenClick(token)}
      >
        <div className="px-4 py-3 space-y-2">
          {/* Top Row: Logo, Name, Time, Metrics */}
          <div className="flex items-start gap-3">
            {/* Token Logo/Image */}
            <div className="relative flex-shrink-0">
              <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                <span className="text-white font-bold text-lg">
                  {token.symbol.charAt(0)}
                </span>
              </div>
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full border-2 border-background bg-red-500 flex items-center justify-center">
                <div className="w-2 h-2 bg-white rounded-full" />
              </div>
            </div>

            {/* Token Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <span className="font-semibold text-sm text-foreground">
                  {token.symbol}
                </span>
                <span className="text-xs text-muted-foreground truncate">
                  {token.name}
                </span>
              </div>
              {/* Price with transition */}
              <div 
                key={`price-${token.id}-${token.price}`}
                className={cn(
                  "text-sm font-semibold price-update",
                  priceDirection === "up" && "price-up",
                  priceDirection === "down" && "price-down",
                  priceDirection === "neutral" && "text-foreground"
                )}
              >
                {formatCurrency(token.price)}
              </div>

              {/* Time and Metrics Row */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs text-green-500 font-medium">
                  {getTimeAgo()}
                </span>
                <Search className="h-3 w-3 text-muted-foreground" />
                <Popover open={isProfileOpen} onOpenChange={setIsProfileOpen} modal={false}>
                  <PopoverTrigger asChild>
                    <div 
                      className="flex items-center gap-1 cursor-pointer hover:text-foreground transition-colors"
                      onMouseEnter={() => {
                        if (hoverTimeoutRef.current) {
                          clearTimeout(hoverTimeoutRef.current);
                        }
                        setIsProfileOpen(true);
                      }}
                      onMouseLeave={() => {
                        // Delay closing to allow mouse to move to popover
                        hoverTimeoutRef.current = setTimeout(() => {
                          setIsProfileOpen(false);
                        }, 200);
                      }}
                    >
                      <Users className="h-3 w-3 text-muted-foreground" />
                      <span className="text-xs text-muted-foreground">{metrics.users}</span>
                    </div>
                  </PopoverTrigger>
                  <PopoverContent 
                    className="w-64 p-4" 
                    align="start" 
                    side="bottom"
                    onMouseEnter={() => {
                      if (hoverTimeoutRef.current) {
                        clearTimeout(hoverTimeoutRef.current);
                      }
                      setIsProfileOpen(true);
                    }}
                    onMouseLeave={() => {
                      setIsProfileOpen(false);
                    }}
                  >
                    <div className="space-y-3">
                      {/* Profile Header */}
                      <div className="flex items-center gap-3">
                        {/* Profile Picture */}
                        <div className="relative flex-shrink-0">
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center ring-2 ring-primary/20">
                            <span className="text-white font-bold text-lg">
                              {token.symbol.charAt(0)}
                            </span>
                          </div>
                          <div className="absolute -bottom-0.5 -right-0.5 w-4 h-4 rounded-full border-2 border-background bg-green-500 flex items-center justify-center">
                            <div className="w-2 h-2 bg-white rounded-full" />
                          </div>
                        </div>
                        {/* Profile Info */}
                        <div className="flex-1 min-w-0">
                          <div className="font-semibold text-sm text-foreground truncate">
                            {token.name}
                          </div>
                          <div className="text-xs text-muted-foreground truncate">
                            @{token.symbol.toLowerCase()}
                          </div>
                        </div>
                      </div>
                      
                      {/* Profile Stats */}
                      <div className="grid grid-cols-3 gap-3 pt-2 border-t border-border">
                        <div className="text-center">
                          <div className="text-sm font-semibold text-foreground">
                            {metrics.users}
                          </div>
                          <div className="text-xs text-muted-foreground">Holders</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-foreground">
                            {formatCompact(token.volume24h)}
                          </div>
                          <div className="text-xs text-muted-foreground">Volume</div>
                        </div>
                        <div className="text-center">
                          <div className="text-sm font-semibold text-foreground">
                            {formatPercent(token.change24h)}
                          </div>
                          <div className="text-xs text-muted-foreground">Change</div>
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
                <div className="flex items-center gap-1">
                  <BarChart3 className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{metrics.chart}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Trophy className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{metrics.trophy}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Crown className="h-3 w-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">{metrics.crown}</span>
                </div>
              </div>
            </div>

            {/* Actions */}
            <div onClick={(e) => e.stopPropagation()}>
              <TokenActions token={token} />
            </div>
          </div>

          {/* Percentage Bars Row */}
          <div className="flex items-center gap-1 flex-wrap">
            {percentages.map((pct, idx) => (
              <div
                key={idx}
                className={cn(
                  "px-2 py-0.5 rounded text-xs font-medium flex items-center gap-1",
                  pct.color === "red"
                    ? "bg-red-500/20 text-red-500"
                    : "bg-green-500/20 text-green-500"
                )}
              >
                {idx === 0 && <Star className="h-3 w-3" />}
                {idx === 1 && <ChefHat className="h-3 w-3" />}
                {idx === 2 && <Target className="h-3 w-3" />}
                <span>{pct.value.toFixed(0)}%</span>
                {pct.time && <span className="text-[10px] opacity-75">{pct.time}</span>}
              </div>
            ))}
            <div className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-500">
              <Ghost className="h-3 w-3 inline mr-1" />
              0%
            </div>
            <div className="px-2 py-0.5 rounded text-xs font-medium bg-green-500/20 text-green-500">
              <Boxes className="h-3 w-3 inline mr-1" />
              0%
            </div>
          </div>

          {/* Bottom Row: MC, V, F, TX */}
          <div className="flex items-center justify-between pt-2 border-t border-border/50">
            <div className="flex items-center gap-4">
              <div>
                <span className="text-xs text-muted-foreground">MC</span>
                <div 
                  key={`mc-${token.id}-${token.marketCap}`}
                  className="text-sm font-semibold text-blue-400 price-update transition-all duration-300"
                >
                  {formatCompact(token.marketCap)}
                </div>
              </div>
              <div>
                <span className="text-xs text-muted-foreground">V</span>
                <div 
                  key={`vol-${token.id}-${token.volume24h}`}
                  className="text-sm font-semibold text-blue-400 price-update transition-all duration-300"
                >
                  {formatCompact(token.volume24h)}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">F</span>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 flex flex-col justify-between">
                    <div className="h-0.5 bg-muted-foreground w-full" />
                    <div className="h-0.5 bg-muted-foreground w-2/3" />
                    <div className="h-0.5 bg-muted-foreground w-1/3" />
                  </div>
                  <span className="text-xs text-foreground">
                    {(token.volume24h / token.marketCap * 100).toFixed(3)}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-1">
                <span className="text-xs text-muted-foreground">TX</span>
                <span className="text-xs text-foreground">
                  {Math.floor(token.volume24h / 1000)}
                </span>
                <div className="w-8 h-1.5 bg-green-500/30 rounded-full overflow-hidden">
                  <div className="h-full bg-green-500 w-1/2" />
                </div>
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="text-xs text-muted-foreground font-mono">
            {truncateAddress(tokenAddress)}...pump
          </div>
        </div>
      </div>
    </TooltipProvider>
  );
});
