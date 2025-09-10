import { Socket } from "socket.io";
import { roomHandler } from "./sockets/roomSocket";
import { locationHandler } from "./sockets/locationSocket";
import { messageHandler } from "./sockets/messageSocket";
import http from "http";
import { Server } from "socket.io";
import app from "./app";
import dotenv from "dotenv";

dotenv.config();

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
});

server.listen(process.env.PORT, () => {
  console.log("Server is running on port", process.env.PORT);
});
