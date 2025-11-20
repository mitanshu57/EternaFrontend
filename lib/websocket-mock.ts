import { Token } from "@/types/token";

/**
 * WebSocket mock for real-time price updates
 * Simulates WebSocket behavior with periodic price updates
 */

export interface PriceUpdate {
  tokenId: string;
  price: number;
  previousPrice: number;
  change24h: number;
  volume24h: number;
}

type PriceUpdateCallback = (update: PriceUpdate) => void;

class WebSocketMock {
  private callbacks: Set<PriceUpdateCallback> = new Set();
  private intervalId: NodeJS.Timeout | null = null;
  private secondaryInterval: NodeJS.Timeout | null = null;
  private isConnected: boolean = false;
  private tokens: Token[] = [];

  /**
   * Connect to the mock WebSocket
   */
  connect(tokens: Token[]): void {
    if (this.isConnected) {
      return;
    }

    this.tokens = tokens;
    this.isConnected = true;

    // Simulate WebSocket connection delay
    setTimeout(() => {
      this.startPriceUpdates();
    }, 100);
  }

  /**
   * Disconnect from the mock WebSocket
   */
  disconnect(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
    if (this.secondaryInterval) {
      clearInterval(this.secondaryInterval);
      this.secondaryInterval = null;
    }
    this.isConnected = false;
    this.callbacks.clear();
  }

  /**
   * Subscribe to price updates
   */
  onPriceUpdate(callback: PriceUpdateCallback): () => void {
    this.callbacks.add(callback);

    // Return unsubscribe function
    return () => {
      this.callbacks.delete(callback);
    };
  }

  /**
   * Start periodic price updates
   */
  private startPriceUpdates(): void {
    // Use multiple intervals for more rapid, varied updates
    // Main update interval - updates most tokens
    this.intervalId = setInterval(() => {
      if (this.tokens.length === 0 || this.callbacks.size === 0) {
        return;
      }

      // Update many tokens frequently for rapid changes
      const tokensToUpdate = Math.floor(Math.random() * 8) + 4; // 4-11 tokens per update
      const shuffled = [...this.tokens].sort(() => Math.random() - 0.5);

      for (let i = 0; i < Math.min(tokensToUpdate, shuffled.length); i++) {
        const token = shuffled[i];
        // More aggressive price changes: ±1% to ±5% for very noticeable updates
        const priceChange = (Math.random() - 0.5) * 0.1; // ±5% change
        const newPrice = Math.max(0.0001, token.price * (1 + priceChange));
        const newChange24h = token.change24h + priceChange * 100;

        // More dynamic volume updates
        const volumeChange = (Math.random() - 0.5) * 0.3; // ±15% volume change
        const newVolume = Math.max(0, token.volume24h * (1 + volumeChange));

        const update: PriceUpdate = {
          tokenId: token.id,
          price: newPrice,
          previousPrice: token.price,
          change24h: newChange24h,
          volume24h: newVolume,
        };

        // Notify all subscribers
        this.callbacks.forEach((callback) => {
          try {
            callback(update);
          } catch (error) {
            console.error("Error in price update callback:", error);
          }
        });
      }
    }, 400); // Update every 400ms for very rapid updates

    // Secondary interval for continuous smaller updates
    setTimeout(() => {
      const secondaryInterval = setInterval(() => {
        if (this.tokens.length === 0 || this.callbacks.size === 0) {
          return;
        }

        // Update a smaller subset more frequently
        const tokensToUpdate = Math.floor(Math.random() * 4) + 2; // 2-5 tokens
        const shuffled = [...this.tokens].sort(() => Math.random() - 0.5);

        for (let i = 0; i < Math.min(tokensToUpdate, shuffled.length); i++) {
          const token = shuffled[i];
          const priceChange = (Math.random() - 0.5) * 0.04; // ±2% change
          const newPrice = Math.max(0.0001, token.price * (1 + priceChange));
          const newChange24h = token.change24h + priceChange * 100;
          const volumeChange = (Math.random() - 0.5) * 0.15;
          const newVolume = Math.max(0, token.volume24h * (1 + volumeChange));

          const update: PriceUpdate = {
            tokenId: token.id,
            price: newPrice,
            previousPrice: token.price,
            change24h: newChange24h,
            volume24h: newVolume,
          };

          this.callbacks.forEach((callback) => {
            try {
              callback(update);
            } catch (error) {
              console.error("Error in price update callback:", error);
            }
          });
        }
      }, 300); // Even faster secondary updates every 300ms

      // Store secondary interval for cleanup
      this.secondaryInterval = secondaryInterval;
    }, 200);
  }
}

// Singleton instance
let wsInstance: WebSocketMock | null = null;

/**
 * Get or create WebSocket mock instance
 */
export function getWebSocketMock(): WebSocketMock {
  if (!wsInstance) {
    wsInstance = new WebSocketMock();
  }
  return wsInstance;
}

