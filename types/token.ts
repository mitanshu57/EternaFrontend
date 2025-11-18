/**
 * Token data types for the trading table
 */

export type TokenCategory = "new-pairs" | "final-stretch" | "migrated";

export interface Token {
  id: string;
  symbol: string;
  name: string;
  price: number;
  previousPrice: number;
  change24h: number;
  volume24h: number;
  liquidity: number;
  marketCap: number;
  category: TokenCategory;
  pair: string;
  createdAt: number;
  migratedFrom?: string;
  finalStretchDays?: number;
}

export interface TokenTableState {
  tokens: Token[];
  filteredTokens: Token[];
  sortColumn: keyof Token | null;
  sortDirection: "asc" | "desc";
  selectedCategory: TokenCategory | "all";
  searchQuery: string;
  isLoading: boolean;
  error: string | null;
}

export type SortableColumn = keyof Token;

