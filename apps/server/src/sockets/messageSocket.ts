import { Message } from "@repo/types";
import { Server, Socket } from "socket.io";
import { prisma } from "../prisma";

export function messageHandler(io: Server, socket: Socket) {
  const sendMessage = async ({ content, userId, username }: Message) => {
    console.log("Message received:", { content, userId });
    const { roomId } = socket.data;
    if (!roomId) {
      console.error("No roomId found for socket:", socket.id);
      return;
    }

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
        id: message.id,
        content: message.content,
        userId: message.userId,
        username: message.username,
        createdAt: message.createdAt,
      };
      io.to(roomId).emit("new-message", newMessage);
    } catch (error) {}
  };
  socket.on("send-message", sendMessage);
}
