import { Router } from "express";
import roomRoutes from "./roomRoute";
const router = Router();

router.use("/room", roomRoutes);

export default router;
