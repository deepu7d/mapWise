import { Message } from "@repo/types";
import { Server, Socket } from "socket.io";

export function messageHandler(io: Server, socket: Socket) {
  const sendMessage = ({ content, userId, username }: Message) => {
    const { roomId } = socket.data;
    if (!roomId) return;
    const message: Message = {
      content: content,
      userId: userId,
      username: username,
    };
    socket.to(roomId).emit("receive-message", message);
  };
  socket.on("send-message", sendMessage);
}
