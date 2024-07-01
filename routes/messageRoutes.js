import express from "express";
import User from "../models/User.js";
import mongoose from "mongoose";

const router = express.Router();

router.post("/create/:senderId/:receiverId", async (req, res) => {
  const { senderId, receiverId } = req.params;
  const { message } = req.body;

  // Checks if the receiver exists
  try {
    const senderObjectId = new mongoose.Types.ObjectId(senderId);
    const receiverObjectId = new mongoose.Types.ObjectId(receiverId);

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res
        .status(400)
        .json({ status: false, message: "Receiver not found" });
    }
    const sender = await User.findById(senderId);

    const senderMessage = {
      receiverId: receiverObjectId,
      message: message,
      timestamp: new Date(),
    };

    const receiverMessage = {
      senderId: senderObjectId,
      message: message,
      timestamp: new Date(),
    };
    //Checks if the receiver has the sender's contact else saves the sender's contact
    let chat = receiver.chats.find(
      (chat) => chat.member && chat.member.equals(senderObjectId)
    );

    if (!chat) {
      // If chat session does not exist, create a new one
      const newChat = {
        member: senderObjectId,
        messages: [receiverMessage],
      };

      receiver.contactList.push({
        contactId: senderObjectId,
        username: sender.username,
        email: sender.email,
        contact: sender.contact,
      });

      receiver.chats.push(newChat);
    } else {
      // If chat session exists, push the new message to the existing chat
      chat.messages.push(receiverMessage);
    }
    await receiver.save();

    let chatSender = sender.chats.find(
      (chat) => chat.member && chat.member.equals(receiverObjectId)
    );
    chatSender.messages.push(senderMessage);
    await sender.save();

    res
      .status(200)
      .json({ status: true, message: "Message sent successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: "Server error" });
  }
});

export default router;
