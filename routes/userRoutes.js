import express from "express";
import { loginUser, registerUser } from "../controllers/UserControllers.js";
import { addContact, getContacts } from "../controllers/ContactController.js";
import { dbConnection, getGFS } from "../utils/Db.js";
import dotenv from "dotenv";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";
import messageSchema from "../models/message.js";

dotenv.config();
const router = express.Router();
const storage = new GridFsStorage({
  url: process.env.MongoDb_URI,
  // options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "uploads", // The name of the bucket
      filename: `${Date.now()}-${file.originalname}`, // The file name
    };
  },
});
const upload = multer({ storage });

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addcontact/:userId", addContact);
router.get("/contacts/:userId", getContacts);
//Upload files to bucket
router.post("/upload", upload.single("file"), (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  }
  res.json({ file: req.file });
});

// Get a single file by filename
router.get("/files/:filename", async (req, res) => {
  try {
    const gfs = getGFS();
    if (!gfs) {
      return res.status(500).json({ message: "GridFSBucket not initialized" });
    }
    const file = await gfs.find({ filename: req.params.filename }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }
    res.json(file[0]);
  } catch (error) {
    console.error("Error fetching file:", error);
    res.status(500).json({ message: "Server error" });
  }
});

//Get a specific file from the bucket
router.get("/audio/:filename", async (req, res) => {
  try {
    const gfs = getGFS();
    if (!gfs) {
      return res.status(500).json({ message: "GridFSBucket not initialized" });
    }
    const file = await gfs.find({ filename: req.params.filename }).toArray();
    if (!file || file.length === 0) {
      return res.status(404).json({ message: "File not found" });
    }

    const readstream = gfs.openDownloadStreamByName(req.params.filename);
    res.set("Content-Type", file[0].contentType);
    readstream.pipe(res);
  } catch (error) {
    console.error("Error streaming file:", error);
    res.status(500).json({ message: "Server error" });
  }
});
// Get all files
router.get("/files", async (req, res) => {
  try {
    const gfs = getGFS();
    if (!gfs) {
      return res.status(500).json({ message: "GridFSBucket not initialized" });
    }
    const files = await gfs.find().toArray();
    res.json(files);
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
