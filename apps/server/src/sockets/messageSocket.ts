import { Message } from "@repo/types";
import { Server, Socket } from "socket.io";
import { prisma } from "../prisma";

export function messageHandler(io: Server, socket: Socket) {
  const sendMessage = async ({ content, userId, username }: Message) => {
    const { roomId } = socket.data;
    if (!roomId) return;

    try {
      const message = await prisma.message.create({
        data: {
          roomId: roomId,
          userId: userId,
          content: content,
          username: username,
        },
      });

      const newMessage: Message = {
        content: content,
        userId: userId,
        username: username,
      };
      socket.to(roomId).emit("new-message", newMessage);
    } catch (error) {}
  };
  socket.on("send-message", sendMessage);
}
