import express from "express";
import User from "../models/User.js";

const router = express.Router();
//to fetch userChats
router.get("/get-chats/:userId", async (req, res) => {
  const { userId } = req.params;
  const user = await User.findById(userId);
  try {
    const chats = await Promise.all(
      user.chats.map(async (c) => {
        const memberId = await User.findById(c.member);
        if (memberId) {
          return {
            username: memberId.username,
            contact: memberId.contact,
          };
        }
        return null;
      })
    );

    res.status(200).json({ userChats: chats });
  } catch (error) {
    res.status(400).json(error);
  }
});

export default router;
