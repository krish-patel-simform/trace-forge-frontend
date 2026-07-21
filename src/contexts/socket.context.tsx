import React, { createContext, useEffect, useState } from "react";
import { io, Socket } from "socket.io-client";
import { useAuth } from "../hooks/useAuth";
import { useProjects } from "../hooks/useProjects";

export interface SocketContextType {
  socket: Socket | null;
  isConnected: boolean;
}

// eslint-disable-next-line react-refresh/only-export-components
export const SocketContext = createContext<SocketContextType | undefined>(
  undefined,
);

export const SocketProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [socket, setSocket] = useState<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const { user } = useAuth();
  const { activeProject } = useProjects();

  useEffect(() => {
    // Determine backend URL (fallback to localhost:5000)
    const backendUrl = import.meta.env.VITE_API_URL || "http://localhost:5000";

    const socketInstance = io(backendUrl, {
      autoConnect: false,
    });

    function initSocket() {
      setSocket(socketInstance);

      socketInstance.on("connect", () => {
        setIsConnected(true);
      });

      socketInstance.on("disconnect", () => {
        setIsConnected(false);
      });
    }

    initSocket();

    return () => {
      socketInstance.disconnect();
    };
  }, []);

  useEffect(() => {
    const accessToken = localStorage.getItem("tf_access_token");

    if (socket && user && accessToken && activeProject) {
      if (!socket.connected) {
        socket.connect();
      }

      // Join the project room once connected
      socket.emit("join:project", {
        projectId: activeProject._id,
        token: accessToken,
      });

      return () => {
        socket.emit("leave:project", { projectId: activeProject._id });
      };
    } else if (socket && socket.connected) {
      // Disconnect if we no longer have a project or token
      socket.disconnect();
    }
  }, [socket, user, activeProject]);

  return (
    <SocketContext.Provider value={{ socket, isConnected }}>
      {children}
    </SocketContext.Provider>
  );
};
