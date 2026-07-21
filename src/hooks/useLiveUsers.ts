import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";

export const useLiveUsers = () => {
  const { socket, isConnected } = useSocket();
  const [activeUsers, setActiveUsers] = useState<number>(0);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);

  useEffect(() => {
    if (!socket || !isConnected) return;

    const handleActiveUsers = (data: { count: number; timestamp: string }) => {
      setActiveUsers(data.count);
      setLastUpdated(data.timestamp);
    };

    socket.on("active-users", handleActiveUsers);

    return () => {
      socket.off("active-users", handleActiveUsers);
    };
  }, [socket, isConnected]);

  return { activeUsers, lastUpdated, isConnected };
};
