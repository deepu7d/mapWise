import { Server, Socket } from "socket.io";
import { prisma } from "../prisma";
import { Position } from "@repo/types";

export function locationHandler(io: Server, socket: Socket) {
    const updateLocation = async (data: {name: string, position: Position}) => {
        const { roomId } = socket.data;
        if (!roomId) return;
    
        try {
          await prisma.user.update({
            where: { id: socket.id }, // todo
            data: {
              position: data.position,
            },
          });
    
          const userData = { ...data, id: socket.id, name: socket.data.name };
          socket.to(roomId).emit("locationUpdate", userData);
        } catch (error) {
          console.error(
            `!!! ERROR handling updateLocation for socket ${socket.id}:`,
            error
          );
        }
    }
    socket.on("updateLocation", updateLocation)
}