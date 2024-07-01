import mongoose, { Schema } from "mongoose";
import messageSchema from "./message.js";

const ChatSchema = new Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  messages: [messageSchema],
});

export default ChatSchema;
