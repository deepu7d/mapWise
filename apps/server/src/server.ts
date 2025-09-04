import { Socket } from "socket.io";
import { prisma } from "./prisma";
import { roomHandler } from "./sockets/roomSocket";
import { locationHandler } from "./sockets/locationSocket";
import { messageHandler } from "./sockets/messageSocket";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();
const PORT = 8000;

// http server
const server = http.createServer(app);

// socket.io setup
const io = new Server(server, {
  cors: {
    origin: "*",
    methods: ["GET", "POST"],
  },
});

io.on("connection", async (socket: Socket) => {
  console.log(`› User connected: ${socket.id}`);

  roomHandler(io, socket);
  locationHandler(io, socket);
  messageHandler(io, socket);

  // socket.on("disconnect", async () => {
  //   console.log(`‹ User disconnected: ${socket.id}`);
  //   const { roomId } = socket.data;

  //   try {
  //     const user = await prisma.user.delete({ where: { id: socket.data.id } });
  //     console.log("User deleted, name ->", user.name);
  //     if (roomId) {
  //       // Check if the room is now empty
  //       const remainingUsers = await prisma.user.count({ where: { roomId } });
  //       if (remainingUsers === 0) {
  //         // If empty, delete the room
  //         await prisma.room.delete({ where: { id: roomId } });
  //         console.log(`[Room] Deleted empty room ${roomId}`);
  //       } else {
  //         // Otherwise, just notify the remaining users
  //         io.to(roomId).emit("userDisconnected", socket.id);
  //       }
  //     }
  //   } catch (error) {
  //     console.log("Error deleting user or room");
  //   }
  // });
});

server.listen(PORT, () => {
  console.log("Server is running on port", PORT);
});
