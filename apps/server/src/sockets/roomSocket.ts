import { Server, Socket } from "socket.io";
import { prisma } from "../prisma";
import { sessionData, User } from "@repo/types";

export function roomHandler(io: Server, socket: Socket) {
  const joinRoom = async ({ userId, roomId }: any) => {
    try {
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.id = userId;

      const usersInRoom = await prisma.user.findMany({
        where: { roomId: roomId },
      });

      const formattedUsers: User[] = usersInRoom.map((user) => ({
        id: user.id,
        name: user.name,
        position: [user.position[0], user.position[1]],
      }));
      socket.emit("currentUsers", formattedUsers);
      if (!userId) return;

      const newUser = await prisma.user.findUnique({
        where: {
          id: userId,
        },
      });
      if (!newUser) return;

      console.log(
        `[Room] User ${newUser.name} (${socket.id}) joined room ${roomId}`
      );
      socket.to(roomId).emit("newUser", {
        id: newUser.id,
        name: newUser.name,
        position: [newUser.position[0], newUser.position[1]],
      });
    } catch (error) {
      console.error(`!!! ERROR in joinRoom for socket ${socket.id}:`, error);
      socket.emit("error", "Failed to join room.");
    }
  };
  const disconnect = () => {}; //todo

  socket.on("joinRoom", joinRoom);
}
