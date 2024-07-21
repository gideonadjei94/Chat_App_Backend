import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();
let gfs;
let gfStories;
export const dbConnection = async () => {
  try {
    mongoose.connect(process.env.MongoDb_URI);
    const db = mongoose.connection;
    db.once("open", () => {
      gfs = new GridFSBucket(db.db, { bucketName: "uploads" });
      gfStories = new GridFSBucket(db.db, { bucketName: "stories" });
      console.log("MongoDB connected and GridFSBucket initialized");
    });
  } catch (error) {
    console.log("Db error" + error);
  }
};
export const getGFS = () => gfs;
export const storiesGfs = () => gfStories;
export default { dbConnection, getGFS, storiesGfs };

//creation jwt Token
export const createJwt = (res, userId) => {
  return jwt.sign({ userId }, process.env.jwt_Secret, {
    expiresIn: "3d",
  });
};
