import mongoose, { Schema } from "mongoose";

const messageSchema = new Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  receiverId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  message: { type: String },
  timestamp: { type: Date, default: Date.now },
});
export default messageSchema;
