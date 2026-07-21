import { useState, useEffect } from "react";
import { useSocket } from "./useSocket";

export interface LiveEvent {
  id: string;
  type: string;
  name: string;
  sessionId: string;
  timestamp: string;
}

export const useLiveEvents = (maxEvents = 20) => {
  const { socket, isConnected } = useSocket();
  const [liveEvents, setLiveEvents] = useState<LiveEvent[]>([]);

  useEffect(() => {
    if (!socket || !isConnected) return;

    // Listen to various event types
    const eventTypes = ["page_view", "click", "scroll", "search", "custom"];

    const handleNewEvent = (data: Omit<LiveEvent, "id">, eventType: string) => {
      const newEvent: LiveEvent = {
        ...data,
        id: crypto.randomUUID(), // Assign a unique ID for React rendering
        type: eventType,
      };

      setLiveEvents((prev) => {
        const updated = [newEvent, ...prev];
        return updated.slice(0, maxEvents);
      });
    };

    // Attach listeners
    eventTypes.forEach((type) => {
      socket.on(type, (data) => handleNewEvent(data, type));
    });

    return () => {
      eventTypes.forEach((type) => {
        socket.off(type);
      });
    };
  }, [socket, isConnected, maxEvents]);

  return { liveEvents, isConnected };
};
