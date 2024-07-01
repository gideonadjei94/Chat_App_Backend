import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const protectRoute = async (req, res, next) => {
  try {
    let token = req.token;

    if (token) {
      const decodedToken = jwt.verify(token, process.env.jwt_Secret);
      const resp = await User.findById(decodedToken.userId).select(
        "email username"
      );

      req.User = {
        email: resp.email,
        username: resp.username,
        userId: decodedToken.userId,
      };

      next();
    }
  } catch (error) {
    console.error(error);
  }
};
