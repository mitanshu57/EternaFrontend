import { Token, TokenCategory } from "@/types/token";

/**
 * Generates mock token data for development and testing
 */
export function generateMockTokens(): Token[] {
  const categories: TokenCategory[] = ["new-pairs", "final-stretch", "migrated"];
  const symbols = [
    "ETH", "BTC", "SOL", "ADA", "DOT", "LINK", "UNI", "AAVE",
    "MATIC", "AVAX", "ATOM", "ALGO", "XTZ", "NEAR", "FTM", "LUNA"
  ];

  const tokens: Token[] = [];
  const now = Date.now();

  categories.forEach((category, categoryIndex) => {
    for (let i = 0; i < 8; i++) {
      const symbolIndex = (categoryIndex * 8 + i) % symbols.length;
      const symbol = symbols[symbolIndex];
      const basePrice = 100 + Math.random() * 900;
      const change24h = (Math.random() - 0.5) * 20;
      const price = basePrice * (1 + change24h / 100);
      const previousPrice = price * (1 - change24h / 100);

      tokens.push({
        id: `${category}-${symbol}-${i}`,
        symbol,
        name: `${symbol} Token`,
        price,
        previousPrice,
        change24h,
        volume24h: Math.random() * 10_000_000,
        liquidity: Math.random() * 5_000_000,
        marketCap: basePrice * (100_000 + Math.random() * 900_000),
        category,
        pair: `${symbol}/USDT`,
        createdAt: now - Math.random() * 7 * 24 * 60 * 60 * 1000,
        ...(category === "migrated" && {
          migratedFrom: `OLD${symbol}`,
        }),
        ...(category === "final-stretch" && {
          finalStretchDays: Math.floor(Math.random() * 30) + 1,
        }),
      });
    }
  });

  return tokens;
}

