import mongoose, { Schema } from "mongoose";

const StoriesSchema = new Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  filename: { type: String, required: true },
  uri: { type: String },
  createdAt: { type: Date, default: Date.now, expires: 86400 },
});

const Stories = mongoose.model("Stories", StoriesSchema);
export default Stories;
