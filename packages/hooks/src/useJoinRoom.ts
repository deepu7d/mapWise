import { useAppDispatch, userOffline } from "@repo/store";
import { sessionData } from "@repo/types";
import { useEffect, useState } from "react";
import { Socket } from "socket.io-client";

export function useJoinRoom(
  socket: Socket | null,
  sessionData: sessionData | null
) {
  const [isConnected, setIsConnected] = useState(false);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (!socket || !sessionData) return;
    const handleConnect = () => {
      setIsConnected(true);
      socket.emit("joinRoom", {
        userId: sessionData.userId,
        roomId: sessionData.roomId,
      });
    };
    const handleDisconnect = () => {
      setIsConnected(false);
      dispatch(userOffline({ id: sessionData.userId }));
    };
    socket.on("connect", handleConnect);
    socket.on("disconnect", handleDisconnect); // Listen for disconnect

    return () => {
      socket.off("connect", handleConnect);
      socket.off("disconnect", handleDisconnect); // Clean up the listener
    };
  }, [socket, sessionData]);
  return isConnected;
}
