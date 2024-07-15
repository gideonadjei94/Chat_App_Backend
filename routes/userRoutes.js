import express from "express";
import { loginUser, registerUser } from "../controllers/UserControllers.js";
import { addContact, getContacts } from "../controllers/ContactController.js";
import { dbConnection, getGFS } from "../utils/Db.js";
import dotenv from "dotenv";
import { GridFsStorage } from "multer-gridfs-storage";
import multer from "multer";

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
router.post("/upload", upload.single("file"), (req, res) => {
  res.json({ file: req.file });
});
router.get("/audio/:filename", async (req, res) => {
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
});

export default router;
