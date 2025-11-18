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
    this.intervalId = setInterval(() => {
      if (this.tokens.length === 0 || this.callbacks.size === 0) {
        return;
      }

      // Update a random subset of tokens (simulate real-time updates)
      const tokensToUpdate = Math.floor(Math.random() * 3) + 1;
      const shuffled = [...this.tokens].sort(() => Math.random() - 0.5);

      for (let i = 0; i < Math.min(tokensToUpdate, shuffled.length); i++) {
        const token = shuffled[i];
        const priceChange = (Math.random() - 0.5) * 0.02; // ±1% change
        const newPrice = token.price * (1 + priceChange);
        const newChange24h = token.change24h + priceChange * 100;

        const update: PriceUpdate = {
          tokenId: token.id,
          price: newPrice,
          previousPrice: token.price,
          change24h: newChange24h,
          volume24h: token.volume24h * (1 + Math.random() * 0.1),
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
    }, 2000); // Update every 2 seconds
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

