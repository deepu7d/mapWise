import { useEffect, useState } from "react";
import { Message, sessionData } from "@repo/types";
import { Socket } from "socket.io-client";
import { sortMessages } from "./helper/index";

export function useMessageSession(
  socket: Socket | null,
  sessionData: sessionData,
  messageToast?: ({ data }: { data: Message }) => void
) {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (data: Message) => {
      messageToast?.({ data });
      setMessages((prev) => [...prev, data]);
    };
    const handleCurrentMessages = (data: Message[]) => {
      setMessages(sortMessages(data));
    };
    socket.on("current-messages", handleCurrentMessages);
    socket.on("new-message", handleReceiveMessage);
    return () => {
      socket.off("new-message", handleReceiveMessage);
    };
  }, [socket]);
  return messages;
}
