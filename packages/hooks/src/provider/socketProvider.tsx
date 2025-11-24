import React, { createContext, useContext } from "react";
import { Socket } from "socket.io-client";
import { useSocket } from "../useSocket";
import { useJoinRoom } from "../useJoinRoom";
import { useMapSession } from "../useMapSession";
import { sessionData, User } from "@repo/types";

type SocketContextType = {
  socket: Socket | null;
  sessionData: sessionData; // Or use a more specific type
  isConnected: boolean;
};

// 2. Update the context
const SocketContext = createContext<SocketContextType | null>(null);

export function SocketProvider({
  children,
  sessionData,
  apiBaseUrl,
  userOnlineToast,
  userOfflineToast,
}: {
  children: React.ReactNode;
  sessionData: any;
  apiBaseUrl: string;
  userOnlineToast?: ({ newUser }: { newUser: User }) => void;
  userOfflineToast?: ({ username }: { username: string }) => void;
}) {
  const socket = useSocket(apiBaseUrl || "");
  const isConnected = useJoinRoom(socket, sessionData);
  useMapSession(sessionData, socket, userOnlineToast, userOfflineToast);

  return (
    <SocketContext.Provider value={{ socket, sessionData, isConnected }}>
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
