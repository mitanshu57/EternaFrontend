"use client";

import { useEffect, useRef } from "react";
import { useAppDispatch } from "@/store/hooks";
import { updatePrice } from "@/store/tokenSlice";
import { getWebSocketMock, PriceUpdate } from "@/lib/websocket-mock";
import { Token } from "@/types/token";

/**
 * Custom hook for managing WebSocket connection and price updates
 */
export function useWebSocket(tokens: Token[]) {
  const dispatch = useAppDispatch();
  const wsRef = useRef<ReturnType<typeof getWebSocketMock> | null>(null);
  const unsubscribeRef = useRef<(() => void) | null>(null);

  useEffect(() => {
    if (tokens.length === 0) {
      return;
    }

    const ws = getWebSocketMock();
    wsRef.current = ws;

    // Connect WebSocket
    ws.connect(tokens);

    // Subscribe to price updates
    const unsubscribe = ws.onPriceUpdate((update: PriceUpdate) => {
      dispatch(updatePrice(update));
    });

    unsubscribeRef.current = unsubscribe;

    // Cleanup on unmount
    return () => {
      if (unsubscribeRef.current) {
        unsubscribeRef.current();
      }
      if (wsRef.current) {
        wsRef.current.disconnect();
      }
    };
  }, [tokens, dispatch]);

  return wsRef.current;
}

