import { createSlice, PayloadAction } from "@reduxjs/toolkit";
import { Token, TokenTableState, TokenCategory, SortableColumn } from "@/types/token";
import { PriceUpdate } from "@/lib/websocket-mock";

const initialState: TokenTableState = {
  tokens: [],
  filteredTokens: [],
  sortColumn: null,
  sortDirection: "desc",
  selectedCategory: "all",
  searchQuery: "",
  isLoading: false,
  error: null,
};

const tokenSlice = createSlice({
  name: "tokens",
  initialState,
  reducers: {
    setTokens: (state, action: PayloadAction<Token[]>) => {
      state.tokens = action.payload;
      state.filteredTokens = action.payload;
    },
    updatePrice: (state, action: PayloadAction<PriceUpdate>) => {
      const { tokenId, price, previousPrice, change24h, volume24h } = action.payload;
      
      const tokenIndex = state.tokens.findIndex((t) => t.id === tokenId);
      if (tokenIndex !== -1) {
        state.tokens[tokenIndex] = {
          ...state.tokens[tokenIndex],
          price,
          previousPrice,
          change24h,
          volume24h,
        };
      }

      const filteredIndex = state.filteredTokens.findIndex((t) => t.id === tokenId);
      if (filteredIndex !== -1) {
        state.filteredTokens[filteredIndex] = {
          ...state.filteredTokens[filteredIndex],
          price,
          previousPrice,
          change24h,
          volume24h,
        };
      }
    },
    setSort: (
      state,
      action: PayloadAction<{ column: SortableColumn; direction: "asc" | "desc" }>
    ) => {
      state.sortColumn = action.payload.column;
      state.sortDirection = action.payload.direction;
    },
    setCategory: (state, action: PayloadAction<TokenCategory | "all">) => {
      state.selectedCategory = action.payload;
    },
    setSearchQuery: (state, action: PayloadAction<string>) => {
      state.searchQuery = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    applyFilters: (state) => {
      let filtered = [...state.tokens];

      // Filter by category
      if (state.selectedCategory !== "all") {
        filtered = filtered.filter((token) => token.category === state.selectedCategory);
      }

      // Filter by search query
      if (state.searchQuery) {
        const query = state.searchQuery.toLowerCase();
        filtered = filtered.filter(
          (token) =>
            token.symbol.toLowerCase().includes(query) ||
            token.name.toLowerCase().includes(query) ||
            token.pair.toLowerCase().includes(query)
        );
      }

      // Apply sorting
      if (state.sortColumn) {
        filtered.sort((a, b) => {
          const aVal = a[state.sortColumn!];
          const bVal = b[state.sortColumn!];

          if (typeof aVal === "number" && typeof bVal === "number") {
            return state.sortDirection === "asc" ? aVal - bVal : bVal - aVal;
          }

          if (typeof aVal === "string" && typeof bVal === "string") {
            return state.sortDirection === "asc"
              ? aVal.localeCompare(bVal)
              : bVal.localeCompare(aVal);
          }

          return 0;
        });
      }

      state.filteredTokens = filtered;
    },
  },
});

export const {
  setTokens,
  updatePrice,
  setSort,
  setCategory,
  setSearchQuery,
  setLoading,
  setError,
  applyFilters,
} = tokenSlice.actions;

export default tokenSlice.reducer;

