import React, { useEffect, useRef } from "react";
import { Message } from "@repo/types";
import { useMessageSession, useSocketContext } from "@repo/hooks";
import toast from "react-hot-toast";
import MessageItem from "./message-item";

export default function ChatMessages() {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const { socket, sessionData } = useSocketContext();

  const messageToast = ({ data }: { data: Message }) => {
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
      },
    );
  };

  const messages = useMessageSession(socket, messageToast);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);
  return (
    <div
      ref={chatContainerRef}
      className="flex-1 space-y-2 overflow-y-auto p-2"
    >
      {messages.map((message: Message, index) => {
        const isOwnMessage = message.userId === sessionData.userId;
        const showUsername =
          message.userId != sessionData.userId &&
          (index === 0 || messages[index - 1].userId !== message.userId);
        return (
          <MessageItem
            message={message}
            showUsername={showUsername}
            key={message.id}
            isOwnMessage={isOwnMessage}
          />
        );
      })}
    </div>
  );
}
