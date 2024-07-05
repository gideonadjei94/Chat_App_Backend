import User from "../models/User.js";
import bcrypt from "bcryptjs";
import { createJwt } from "../utils/Db.js";

export const registerUser = async (req, res) => {
  try {
    const { username, email, password, confirmpassword, contact } = req.body;
    const userExist = await User.findOne({ email });

    if (userExist) {
      return res.status(400).json({
        status: false,
        message: "User already exists",
      });
    }
    if (password === confirmpassword) {
      const user = new User({
        username,
        email,
        password,
        contact,
        chats: { messages: [] },
      });
      await user.save();
      if (user) {
        const token = createJwt(res, user._id);
        user.password = undefined;

        res.status(201).json({
          user,
          token,
        });
      }
    } else {
      return res
        .status(500)
        .json({ status: false, message: "Invalid user data" });
    }
  } catch (error) {
    console.log(error);
    return res.status(404).json({ error: error.message });
  }
};

export const loginUser = async (req, res) => {
  const { email, password } = req.body;
  try {
    let user = await User.findOne({ email });
    const isValidPassword = await bcrypt.compare(password, user.password);

    if (!user || !isValidPassword) {
      return res.status(400).json("Invalid email or password..", error.message);
    } else {
      const token = createJwt(res, user._id);
      return res.status(201).json(user);
    }
  } catch (error) {
    res.status(400).json("An error occured " + error.message);
  }
};
