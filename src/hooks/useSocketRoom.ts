import { useEffect } from "react";
import { useSocket } from "./useSocket";

/**
 * Joins a Socket.IO project room when connected, and leaves on unmount.
 * Must be called inside a page/component that knows the projectId (e.g. from useParams).
 */
export const useSocketRoom = (projectId: string | undefined) => {
  const { socket, isConnected } = useSocket();

  useEffect(() => {
    if (!socket || !isConnected || !projectId) return;

    const accessToken = localStorage.getItem("tf_access_token");
    if (!accessToken) return;

    // Join the project-specific room
    socket.emit("join:project", { projectId, token: accessToken });

    return () => {
      socket.emit("leave:project", { projectId });
    };
  }, [socket, isConnected, projectId]);
};
