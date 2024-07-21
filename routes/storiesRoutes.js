import express from "express";
import multer from "multer";
import { storiesGfs } from "../utils/Db.js";
import { GridFsStorage } from "multer-gridfs-storage";
import dotenv from "dotenv";
import Stories from "../models/Stories.js";

dotenv.config();
const router = express.Router();
const storage = new GridFsStorage({
  url: process.env.MongoDb_URI,
  // options: { useNewUrlParser: true, useUnifiedTopology: true },
  file: (req, file) => {
    return {
      bucketName: "stories", // The name of the bucket
      filename: `${Date.now()}-${file.originalname}`, // The file name
    };
  },
});
const upload = multer({ storage });

router.post("/upload", upload.single("file"), async (req, res) => {
  const { userId } = req.body;
  // const { filename } = req.file;
  if (!req.file) {
    return res.status(400).json({ message: "No file uploaded" });
  } else {
    // const response = res.json({ file: req.file });

    const Story = new Stories({
      userId: userId,
      filename: req.file.filename,
      uri: `http://10.132.62.10:8800/api/stories/download/${req.file.filename}`,
    });

    await Story.save();
    res.status(200).json(Story);
  }
});
router.get("/story", async (req, res) => {
  try {
    const stories = await Stories.find().populate("userId", "username");
    return res.status(200).json(stories);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

router.get("/download/:filename", async (req, res) => {
  try {
    const gfs = getGFSStories();
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

export default router;
