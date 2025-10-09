import React, { useEffect, useState } from "react";
import { Message, sessionData } from "@repo/types";
import { Socket } from "socket.io-client";
import toast from "react-hot-toast";
import { sortMessages } from "@/helper/helperFunctions";

export default function useMessageSession(
  socket: Socket | null,
  sessionData: sessionData
) {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (data: Message) => {
      toast(
        <span>
          {data.userId === sessionData.userId ? (
            "Message Sent"
          ) : (
            <>
              <span className="font-bold">{data.username}</span> sent Message
            </>
          )}
        </span>,
        {
          icon: "🗨️",
          className: "border border-solid border-black p-4 rounded-md bg-white",
        }
      );
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
