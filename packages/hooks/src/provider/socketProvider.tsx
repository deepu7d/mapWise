import React, { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../useSocket";
import { useJoinRoom } from "../useJoinRoom";

type SocketContextType = Socket | null;

const SocketContext = createContext<SocketContextType>(null);

export function SocketProvider({
  children,
  sessionData,
  apiBaseUrl,
}: {
  children: React.ReactNode;
  sessionData: any;
  apiBaseUrl: string;
}) {
  const socket = useSocket(apiBaseUrl || "");
  useJoinRoom(socket, sessionData);
  return (
    <SocketContext.Provider value={socket}>{children}</SocketContext.Provider>
  );
}

export const useSocketContext = () => {
  const socket = useContext(SocketContext);
  return socket;
};
