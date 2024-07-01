import mongoose, { Schema } from "mongoose";

const contactSchema = new Schema({
  contact: { type: String },
  username: { type: String },
  status: { type: String, default: "unblocked" },
  contactId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
});
export default contactSchema;
