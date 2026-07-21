import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<SocketContextType | undefined>(
  undefined,
);

/**
 * Derives the Socket.IO server URL from the REST API base URL.
 * Socket.IO must connect to the HTTP server root, not an API sub-path.
 * e.g. "http://localhost:4000/api" → "http://localhost:4000"
 */
function buildSocketUrl(): string {
  const apiUrl =
    (import.meta.env.VITE_API_URL as string | undefined) ??
    "http://localhost:4000";
  return apiUrl.replace(/\/api$/, "");
}

/**
 * Module-level singleton socket instance.
 * Created once when this module is loaded — this is the correct way to avoid
 * the react-hooks/refs lint rule while keeping a stable socket reference in state.
 */
const socketSingleton: Socket = io(buildSocketUrl(), { autoConnect: false });

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const handleConnect = () => setIsConnected(true);
    const handleDisconnect = () => setIsConnected(false);

    socketSingleton.on("connect", handleConnect);
    socketSingleton.on("disconnect", handleDisconnect);

    return () => {
      socketSingleton.off("connect", handleConnect);
      socketSingleton.off("disconnect", handleDisconnect);
      socketSingleton.disconnect();
    };
  }, []);

  useEffect(() => {
    if (user) {
      // Connect once the user is authenticated; room join is handled per-page
      if (!socketSingleton.connected) {
        socketSingleton.connect();
      }
    } else if (socketSingleton.connected) {
      // Disconnect when the user logs out
      socketSingleton.disconnect();
    }
  }, [user]);

  return (
    <SocketContext.Provider value={{ socket: socketSingleton, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
