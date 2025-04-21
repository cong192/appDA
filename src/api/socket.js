import { useRef, useCallback } from "react";
import { Client } from "@stomp/stompjs";

export const useWebSocket = (sub, onMessageReceived) => {
  const stompClient = useRef(null);
  const reconnectAttempts = useRef(0);
  const maxReconnectAttempts = 10;

  const connectWS = useCallback(() => {
    if (stompClient.current && stompClient.current.connected) {
      console.warn("⚠️ WebSocket already connected.");
      return;
    }

    if (!sub) {
      console.error("❌ WebSocket Error: Subscription topic is required!");
      return;
    }

    stompClient.current = new Client({
      brokerURL: "ws://192.168.40.108:8080/ws", // 👈 dùng brokerURL thay vì webSocketFactory
      reconnectDelay: 5000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: (frame) => {
        console.log("✅ WebSocket Connected in hook:", frame);
        reconnectAttempts.current = 0;

        stompClient.current.subscribe(sub, (message) => {
          const newMsg = message.body;
          console.log(`📩 New Message from ${sub}:`, newMsg);
          if (onMessageReceived) {
            onMessageReceived(newMsg);
          }
        });
      },
      onStompError: (frame) => {
        console.error("❌ STOMP Error:", frame.headers["message"]);
      },
      onWebSocketClose: (event) => {
        console.warn("⚠️ WebSocket Closed:", event);
        if (reconnectAttempts.current < maxReconnectAttempts) {
          reconnectAttempts.current += 1;
          console.log(`🔄 Reconnecting (${reconnectAttempts.current}/${maxReconnectAttempts})`);
        } else {
          console.error("❌ Max reconnect attempts reached.");
        }
      },
      onWebSocketError: (error) => {
        console.error("❌ WebSocket Error:", error);
      },
      debug: (str) => console.log("🛠 WebSocket Debug:", str),
    });

    stompClient.current.activate();

    return () => {
      if (stompClient.current) {
        stompClient.current.deactivate();
      }
    };
  }, [sub, onMessageReceived]);

  const disconnectWS = useCallback(() => {
    if (stompClient.current) {
      stompClient.current.deactivate();
      stompClient.current = null;
      console.log("❎ WebSocket Disconnected");
    }
  }, []);

  const isConnected = () => {
    return stompClient.current && stompClient.current.connected;
  };

  return { connectWS, disconnectWS, isConnected };
};
