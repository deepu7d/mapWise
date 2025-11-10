import { SendHorizontal } from "lucide-react";
import React, { useEffect, useRef } from "react";
import { Message, sessionData } from "@repo/types";
import { useMessageSession, useSocketContext } from "@repo/hooks";
import toast from "react-hot-toast";

const ChatSection = ({ sessionData }: { sessionData: sessionData }) => {
  const chatContainerRef = useRef<HTMLDivElement>(null);
  const socket = useSocketContext();

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
      }
    );
  };

  const messages = useMessageSession(socket, sessionData, messageToast);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop =
        chatContainerRef.current.scrollHeight;
    }
  }, [messages]);

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
      <div
        ref={chatContainerRef}
        className="flex-1 p-2 space-y-2 overflow-y-auto"
      >
        {messages.map((message: Message, index) => {
          const showUsername =
            message.userId != sessionData.userId &&
            (index === 0 || messages[index - 1].userId !== message.userId);
          return (
            <div
              key={message.id}
              className={`flex flex-col ${
                message.userId === sessionData.userId
                  ? "items-end"
                  : "items-start"
              }`}
            >
              <h1 className="text-xs truncate max-w-[30%]">
                {showUsername && message.username}
              </h1>
              <p
                className={`${
                  message.userId == sessionData.userId
                    ? "bg-blue-400  rounded-tl-lg rounded-br-lg"
                    : "bg-slate-200  rounded-tr-lg rounded-bl-lg"
                } text-slate-800 text-md  w-fit max-w-[70%] px-2 py-0.5 break-words`}
              >
                {message.content}
              </p>
            </div>
          );
        })}
      </div>
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
