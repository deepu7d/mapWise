import { Message } from "@repo/types";
import React from "react";
import { motion } from "motion/react";

export default React.memo(function MessageItem({
  message,
  showUsername,
  isOwnMessage,
}: {
  message: Message;
  showUsername: boolean;
  isOwnMessage: boolean;
}) {
  return (
    <motion.div
      key={message.id}
      initial={{ opacity: 0, x: isOwnMessage ? 50 : -50 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ type: "spring", stiffness: 200, damping: 20, duration: 1 }}
      className={`flex flex-col ${isOwnMessage ? "items-end" : "items-start"}`}
    >
      <h1 className="text-xs truncate max-w-[30%]">
        {showUsername && message.username}
      </h1>
      <p
        className={`${
          isOwnMessage
            ? "bg-blue-400  rounded-tl-lg rounded-br-lg"
            : "bg-slate-200  rounded-tr-lg rounded-bl-lg"
        } text-slate-800 text-md  w-fit max-w-[70%] px-2 py-0.5 break-words`}
      >
        {message.content}
      </p>
    </motion.div>
  );
});
