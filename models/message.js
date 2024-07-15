import mongoose, { Schema } from "mongoose";

const messageTypeEnum = ["text", "audio", "file", "media"];

const messageSchema = new Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String },
  type: { type: String, enum: messageTypeEnum, default: "text" },
  timestamp: { type: Date, default: Date.now },
});
export default messageSchema;
