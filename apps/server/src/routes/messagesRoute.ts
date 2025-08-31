import { Router } from "express";
import { getMessages } from "../controllers/messageController";

const router = Router();

router.get("/:roomId", getMessages);

export default router;
