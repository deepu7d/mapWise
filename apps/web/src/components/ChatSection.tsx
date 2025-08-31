import useSocket from "@/hooks/useSocket";
import { SendHorizontal } from "lucide-react";
import React, { FormEvent, useEffect, useState } from "react";
import { Message, sessionData } from "@repo/types";
import { Socket } from "socket.io-client";

const ChatSection = ({
  socket,
  sessionData,
}: {
  socket: Socket;
  sessionData: sessionData;
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  useEffect(() => {
    if (!socket) return;
    const handleReceiveMessage = (data: Message) => {
      setMessages((prev) => [...prev, data]);
    };
    socket.on("receive-message", handleReceiveMessage);
    return () => {
      socket.off("receive-message", handleReceiveMessage);
    };
  }, [socket]);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const message = formData.get("message");
    if (!message) return;
    setMessages((prev) => [
      ...prev,
      {
        userId: sessionData.userId,
        username: sessionData.username,
        content: message.toString(),
      },
    ]);

    socket?.emit("send-message", {
      content: message,
      userId: sessionData.userId,
      username: sessionData.username,
    });
    event.currentTarget.reset();
  };

  return (
    <div className="flex flex-col h-full w-full bg-slate-100 shadow-lg rounded-2xl">
      {/* heading */}
      <div className="py-2 px-4 border-b border-gray-200">
        <h1 className="text-md font-semibold text-gray-800">Chat Here</h1>
      </div>

      {/* Message Area */}
      <div className="flex-1 p-2 space-y-4 overflow-y-auto">
        {messages.map((message: Message) => (
          <div
            key={Math.random()}
            className={`flex flex-col ${
              message.userId == sessionData.userId ? "items-end" : "items-start"
            }`}
          >
            <h1 className="text-xs">
              {message.username == sessionData.username
                ? "You"
                : message.username}
            </h1>
            <p
              className={`${
                message.userId == sessionData.userId
                  ? "bg-blue-400  rounded-tl-lg rounded-br-lg"
                  : "bg-slate-200  rounded-tr-lg rounded-bl-lg"
              } text-slate-800 text-md  w-fit max-w-[70%] px-2 py-0.5`}
            >
              {message.content}
            </p>
          </div>
        ))}
        {/* Received Message Example */}
        {/* <div className="flex justify-start">
          <div className="bg-gray-200 text-gray-800 p-3 rounded-l-lg rounded-br-lg max-w-xs lg:max-w-md">
            <p className="text-sm">
              Hello! Welcome to our support. How can I help you today?
            </p>
          </div>
        </div> */}

        {/* Sent Message Example */}
        {/* <div className="flex justify-end">
          <div className="bg-blue-500 text-white p-3 rounded-r-lg rounded-bl-lg max-w-xs lg:max-w-md">
            <p className="text-sm">
              Hi, I'm having trouble with my account settings. I can't seem to
              update my profile picture.
            </p>
          </div>
        </div>  */}
      </div>

      {/* Input Area */}
      <div className="p-4 border-t border-gray-200 bg-gray-50">
        <form onSubmit={handleSubmit} className="flex items-center space-x-3">
          <input
            type="text"
            name="message"
            placeholder="Type your message here..."
            className="w-full px-4 py-2 bg-gray-200 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-400"
            required
          />
          <button
            type="submit"
            className="flex-shrink-0 p-3 text-white bg-blue-500 rounded-full hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors duration-200"
          >
            <SendHorizontal />
          </button>
        </form>
      </div>
    </div>
  );
};

export default ChatSection;
