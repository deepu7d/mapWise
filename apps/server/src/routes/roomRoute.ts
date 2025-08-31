import { Router } from "express";
import { createRoom, joinRoom } from "../controllers/roomController";

const router = Router();

router.get("/", (req, res) => {
  res.json("Hi from server");
});

router.post("/join/:roomId", joinRoom);

router.post("/create-room", createRoom);

export default router;
