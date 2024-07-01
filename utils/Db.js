import mongoose from "mongoose";
import { GridFSBucket } from "mongodb";
import jwt from "jsonwebtoken";

let gfs;
export const dbConnection = async () => {
  try {
    mongoose.connect(process.env.MongoDb_URI);
    const db = mongoose.connection;
    db.once("open", () => {
      gfs = new GridFSBucket(db.db, { bucketName: "uploads" });
      console.log("MongoDB connected and GridFSBucket initialized");
    });
  } catch (error) {
    console.log("Db error" + error);
  }
};
export const getGFS = () => gfs;
export default { dbConnection, getGFS };

//creation jwt Token
export const createJwt = (res, userId) => {
  return jwt.sign({ userId }, process.env.jwt_Secret, {
    expiresIn: "3d",
  });
};
