import { Router } from "express";
import { getUser } from "../controllers/userController";

const router = Router();

router.get("/:roomId", getUser);

export default router;
