import bcrypt from "bcryptjs";
import mongoose, { Schema } from "mongoose";
import contactSchema from "./contacts.js";
import ChatSchema from "./chats.js";

const userSchema = new Schema(
  {
    username: { type: String, required: true, unique: true },
    email: { type: String, unique: true },
    password: { type: String, required: true },
    confirmPassword: { type: String },
    contact: { type: String, required: true },
    contactList: [contactSchema],
    chats: [ChatSchema],
    status: { type: String, default: "online" },
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
  },
  {
    timestamps: true,
  }
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    next();
  }

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};
const User = mongoose.model("User", userSchema);
export default User;
