import { Message, User } from "@repo/types";
import { PrismaClient, User as DBUSer } from "./generated/prisma";
import { Socket } from "socket.io";

const prisma = new PrismaClient()
const { Server } = require("socket.io");
require("dotenv").config();

const io = new Server(8000, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

console.log("WebSocket server started on port 8000");

io.on("connection", async (socket: Socket) => {
  console.log(`› User connected: ${socket.id}`);

  socket.on("joinRoom", async ({ roomId, name, destination, position }) => {
    try {
      socket.join(roomId);
      socket.data.roomId = roomId;
      socket.data.name = name;

      if (destination) {
        await prisma.room.upsert({
          where: { id: roomId },
          update: {},
          create: {
            id: roomId,
            destinationName: destination.name,
            destinationPosition: [destination.position[0], destination.position[1]]
          },
        });
      }

      const user = await prisma.user.create({
        data: {
          id: socket.id,
          name: name,
          roomId: roomId,
          position: position
        },
      });
      console.log("user created", user.id);

      const roomData = await prisma.room.findUnique({ where: { id: roomId } });
      if(!roomData){
        console.log("error fetching room data")
         return
      } 
      socket.emit("roomData", {
          name: roomData.destinationName,
          position: roomData.destinationPosition
      });

      const usersInRoom = await prisma.user.findMany({
        where: { roomId: roomId },
      });
      const formattedUsers: User[] = usersInRoom.map((user) => ({
        id: user.id,
        name: user.name,
        position: position
      }));
      socket.emit("currentUsers", formattedUsers);

      console.log(`[Room] User ${name} (${socket.id}) joined room ${roomId}`);
      socket.to(roomId).emit("newUser", { id: socket.id, name, position });
    } catch (error) {
      console.error(`!!! ERROR in joinRoom for socket ${socket.id}:`, error);
      socket.emit("error", "Failed to join room.");
    }
  });

  socket.on("updateLocation", async (data) => {
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
  });

  socket.on("send-message", (data: string) => {
    const { roomId } = socket.data;
    if (!roomId) return;
    const message: Message = { content: data, id: socket.id, name: socket.data.name };
    socket.to(roomId).emit("receive-message", message);
  });

  socket.on("disconnect", async () => {
    console.log(`‹ User disconnected: ${socket.id}`);
    const { roomId } = socket.data;

    try {
      const user = await prisma.user.delete({ where: { id: socket.id } });
      console.log("User deleted, name ->", user.name);

      if (roomId) {
        // Check if the room is now empty
        const remainingUsers = await prisma.user.count({ where: { roomId } });
        if (remainingUsers === 0) {
          // If empty, delete the room
          await prisma.room.delete({ where: { id: roomId } });
          console.log(`[Room] Deleted empty room ${roomId}`);
        } else {
          // Otherwise, just notify the remaining users
          io.to(roomId).emit("userDisconnected", socket.id);
        }
      }
    } catch (error) {
      console.log("Error deleting user or room");
    }
  });
});
