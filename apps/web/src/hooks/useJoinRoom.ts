import { sessionData } from "@repo/types";
import { useEffect } from "react";
import { Socket } from "socket.io-client";

export default function useJoinRoom(
  socket: Socket | null,
  sessionData: sessionData | null
) {
  useEffect(() => {
    if (!socket || !sessionData) return;
    const handleConnect = () => {
      socket.emit("joinRoom", {
        userId: sessionData.userId,
        roomId: sessionData.roomId,
      });
    };
    socket.on("connect", handleConnect);

    return () => {
      socket.off("connect", handleConnect);
    };
  }, [socket, sessionData]);
}
