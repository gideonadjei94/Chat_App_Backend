import mongoose, { Schema } from "mongoose";

const groupSchema = new Schema({
  groupname: { type: String, required: true },
  groupMembers: [
    { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  ],
});

const Group = mongoose.model("Group", groupSchema);
export default Group;
