import { SendHorizontal } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Message, sessionData } from "@repo/types";
import { useMessageSession, useSocketContext } from "@repo/hooks";
import toast from "react-hot-toast";
import ChatMessages from "./chat-messages";

const ChatSection = ({ sessionData }: { sessionData: sessionData }) => {
  const { socket } = useSocketContext();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);
    const message = formData.get("message");
    if (!message) return;

    socket?.emit("send-message", {
      content: message,
      userId: sessionData.userId,
      username: sessionData.username,
    });
    event.currentTarget.reset();
  };

  return (
    <div className="flex flex-col h-full w-full max-w-3xl bg-slate-100 shadow-lg rounded-2xl mx-auto">
      <div className="py-2 px-4 border-b border-gray-200">
        <h1 className="text-md font-semibold text-gray-800">Chat Here</h1>
      </div>
      <ChatMessages />
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
