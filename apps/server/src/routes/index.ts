import { Router } from "express";
import roomRoutes from "./roomRoute";
import messagesRoutes from "./messagesRoute";
import usersRoute from "./usersRoute";
const router = Router();

router.use("/room", roomRoutes);
router.use("/messages", messagesRoutes);
router.use("/users", usersRoute);

export default router;
