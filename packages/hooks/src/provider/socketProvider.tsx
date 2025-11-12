import React, { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../useSocket";
import { useJoinRoom } from "../useJoinRoom";
import { useMapSession } from "../useMapSession";

type SocketContextType = {
  socket: Socket | null;
  sessionData: any; // Or use a more specific type
};

// 2. Update the context
const SocketContext = createContext<SocketContextType | null>(null);

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
  useMapSession(sessionData, socket);

  return (
    <SocketContext.Provider value={{ socket, sessionData }}>
      {children}
    </SocketContext.Provider>
  );
}

export const useSocketContext = () => {
  // 1. Get the full context object: { socket, sessionData }
  const context = useContext(SocketContext);

  // 2. Add a check to make sure it's used inside the provider
  if (context === null) {
    throw new Error("useSocketContext must be used within a SocketProvider");
  }

  // 3. Return the full object
  return context;
};
