import express from "express";
import userRoutes from "./userRoutes.js";
import chatRoutes from "./chatRoutes.js";
import messageRoutes from "./messageRoutes.js";
import storiesRoutes from "./storiesRoutes.js";

const router = express.Router();

router.use("/user", userRoutes);
router.use("/chats", chatRoutes);
router.use("/messages", messageRoutes);
router.use("/stories", storiesRoutes);

export default router;
