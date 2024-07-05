import express from "express";
import User from "../models/User.js";
import mongoose from "mongoose";
import { getIo } from "../utils/Socket.js";

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
      senderId: senderObjectId,
      message: message,
      timestamp: new Date(),
    };

    const receiverMessage = {
      receiverId: receiverObjectId,
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

    const io = getIo();
    io.to(receiverId).emit("message", receiverMessage);

    res.status(200).json(senderMessage);
  } catch (error) {
    console.error(error);
    res.status(500).json({ status: false, message: error.message });
  }
});

router.get("/getmessages/:userId/:chatId", async (req, res) => {
  const { userId, chatId } = req.params;
  try {
    //const senderObjectId = new mongoose.Types.ObjectId(userId);
    const Id = new mongoose.Types.ObjectId(chatId);

    const user = await User.findById(userId);
    const chat = user.chats.find((chat) => chat._id && chat._id.equals(Id));
    if (!chat) {
      return res.status(404).json({ status: false, message: "Chat not found" });
    }
    res.status(200).json(chat.messages);
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
});

export default router;
