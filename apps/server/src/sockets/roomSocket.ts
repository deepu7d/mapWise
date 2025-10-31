import { Server, Socket } from "socket.io";
import { prisma } from "../prisma";
import { Message, OsrmApiResponse, User } from "@repo/types";

export function roomHandler(io: Server, socket: Socket) {
  const joinRoom = async ({ userId, roomId }: any) => {
    try {
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.id = userId;

      const newUser = await prisma.user.update({
        where: {
          id: userId,
        },
        data: {
          online: true,
        },
      });
      if (!newUser) return;
      console.log(
        `[Room] User ${newUser.name} (${socket.id}) joined room ${roomId}`
      );

      const usersInRoom = await prisma.user.findMany({
        where: { roomId: roomId },
      });

      const formattedUsers: User[] = usersInRoom.map((user) => ({
        id: user.id,
        name: user.name,
        position: [user.position[0], user.position[1]],
        online: user.online,
        routeData: user.routeData as unknown as OsrmApiResponse,
      }));
      socket.emit("currentUsers", formattedUsers);

      socket.to(roomId).emit("newUser", {
        id: newUser.id,
        name: newUser.name,
        position: [newUser.position[0], newUser.position[1]],
        online: newUser.online,
        routeData: newUser.routeData as unknown as OsrmApiResponse,
      });

      const messagesInRoom: Message[] = await prisma.message.findMany({
        where: { roomId: roomId },
      });

      socket.emit("current-messages", messagesInRoom);
    } catch (error) {
      console.error(`!!! ERROR in joinRoom for socket ${socket.id}:`, error);
      socket.emit("error", "Failed to join room.");
    }
  };
  const disconnect = async () => {
    const id = socket.data.id;
    const roomId = socket.data.roomId;
    const lastPosition = socket.data.lastPosition;
    if (!id || !roomId) return;
    try {
      const disconnectedUser = await prisma.user.update({
        where: {
          id: id,
        },
        data: {
          online: false,
          position: lastPosition,
        },
      });

      console.log("User offline: ", disconnectedUser.name);
      io.to(roomId).emit("user-disconneted", disconnectedUser);
    } catch (error) {
      console.log("Error disconnecting user:", id);
    }
  };

  socket.on("joinRoom", joinRoom);
  socket.on("disconnect", disconnect);
}
