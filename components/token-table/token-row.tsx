"use client";

import { memo } from "react";
import { Token } from "@/types/token";
import { TableCell } from "./table-cell";
import { TokenActions } from "./token-actions";
import {
  formatCurrency,
  formatCompact,
  formatPercent,
  getPriceDirection,
} from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipTrigger, TooltipProvider } from "@/components/ui/tooltip";

interface TokenRowProps {
  token: Token;
  onTokenClick: (token: Token) => void;
}

/**
 * Token row component displaying all token information
 * Memoized for performance optimization
 */
export const TokenRow = memo(function TokenRow({
  token,
  onTokenClick,
}: TokenRowProps) {
  const priceDirection = getPriceDirection(token.price, token.previousPrice);
  const isPositive = token.change24h >= 0;

  return (
    <TooltipProvider>
      <tr
        className="border-b border-border hover:bg-muted/30 transition-colors duration-150"
        onClick={() => onTokenClick(token)}
      >
        <TableCell className="px-2 sm:px-4">
          <div className="flex items-center gap-2">
            <div className="flex flex-col min-w-0">
              <span className="font-medium truncate">{token.symbol}</span>
              <span className="text-xs text-muted-foreground truncate hidden sm:block">{token.name}</span>
            </div>
          </div>
        </TableCell>

        <TableCell className="hidden sm:table-cell px-2 sm:px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{token.pair}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Trading pair: {token.pair}</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>

        <TableCell priceDirection={priceDirection} className="px-2 sm:px-4">
          <div className="flex flex-col">
            <span className="font-medium text-sm sm:text-base">{formatCurrency(token.price)}</span>
            <span
              className={`text-xs ${
                isPositive ? "text-green-600 dark:text-green-400" : "text-red-600 dark:text-red-400"
              }`}
            >
              {formatPercent(token.change24h)}
            </span>
          </div>
        </TableCell>

        <TableCell className="hidden md:table-cell px-2 sm:px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{formatCompact(token.volume24h)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>24h Volume: {formatCurrency(token.volume24h)}</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>

        <TableCell className="hidden lg:table-cell px-2 sm:px-4">
          <Tooltip>
            <TooltipTrigger asChild>
              <span className="cursor-help">{formatCompact(token.liquidity)}</span>
            </TooltipTrigger>
            <TooltipContent>
              <p>Liquidity: {formatCurrency(token.liquidity)}</p>
            </TooltipContent>
          </Tooltip>
        </TableCell>

        <TableCell className="hidden md:table-cell px-2 sm:px-4">
          {formatCompact(token.marketCap)}
        </TableCell>

        <TableCell className="px-2 sm:px-4" onClick={(e) => e.stopPropagation()}>
          <TokenActions token={token} />
        </TableCell>
      </tr>
    </TooltipProvider>
  );
});

