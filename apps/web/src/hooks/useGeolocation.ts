import { useEffect, useRef } from "react";
import { useSocketContext } from "@repo/hooks";
import { Position } from "@repo/types";

export function useGeolocation(userId: string | undefined) {
  const { socket } = useSocketContext();
  const currentPositionRef = useRef<Position | null>(null);

  useEffect(() => {
    if (!socket || !userId) return;

    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        currentPositionRef.current = [latitude, longitude];
      },
      (error) => console.error("Geolocation error:", error),
      { enableHighAccuracy: true }
    );

    const intervalId = setInterval(() => {
      if (currentPositionRef.current) {
        socket.emit("update-location", {
          userId: userId,
          position: currentPositionRef.current,
        });
      }
    }, 3000); // Send update every 10 seconds

    return () => {
      console.log("Clearing geolocation watch...");
      navigator.geolocation.clearWatch(watchId);
      clearInterval(intervalId);
    };
  }, [socket, userId]);
}
