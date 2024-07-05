import express from "express";
import User from "../models/User.js";

const router = express.Router();
//to fetch userChats
router.get("/getchats/:userId", async (req, res) => {
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
            member: memberId._id,
            Id: c._id,
            messages: c.messages,
          };
        }
        return null;
      })
    );

    res.status(200).json(chats);
  } catch (error) {
    res.status(400).json({ message: error });
  }
});

export default router;
