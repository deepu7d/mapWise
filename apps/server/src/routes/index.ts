import { Router } from "express";
import roomRoutes from "./roomRoute";
import messagesRoutes from "./messagesRoute";
const router = Router();

router.use("/room", roomRoutes);
router.use("/messages", messagesRoutes);

export default router;
