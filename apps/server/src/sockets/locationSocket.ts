import { Server, Socket } from "socket.io";
import { prisma } from "../prisma";
import { Position } from "@repo/types";

export function locationHandler(io: Server, socket: Socket) {
  const updateLocation = async ({
    userId,
    position,
  }: {
    userId: string;
    position: Position;
  }) => {
    const { roomId } = socket.data;
    if (!roomId) return;
    // const newPosition = [position[0] + 0.01, position[1] - 0.01];
    try {
      // await prisma.user.update({
      //   where: { id: userId }, // todo
      //   data: {
      //     position: position,
      //   },
      // });
      // console.log(position);
      // console.log(newPosition);
      const userData = { id: userId, position: position };
      socket.to(roomId).emit("location-update", userData);
    } catch (error) {
      console.error(
        `!!! ERROR handling updateLocation for socket ${socket.id}:`,
        error
      );
    }
  };
  socket.on("updateLocation", updateLocation);
}
