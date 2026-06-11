import { Router } from "express";
import { authMiddleware } from "../middleware/authMiddleware";

const route = Router();

route.post("/create-room", authMiddleware, async () => {});

route.post("/add-members", authMiddleware, async () => {});

export default route;
