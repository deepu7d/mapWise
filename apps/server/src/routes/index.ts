import { Router } from "express";
import roomRoutes from "./roomRoute";
import messagesRoutes from "./messagesRoute";
import usersRoute from "./usersRoute";
const router = Router();

router.use("/room", roomRoutes);
router.use("/messages", messagesRoutes);
router.use("/users", usersRoute);
router.use("/", (req, res) => {
  res.send("API is running...");
});

export default router;

// pm2 start ecosystem.config.js --env production
