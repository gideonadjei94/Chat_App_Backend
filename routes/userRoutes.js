import express from "express";
import { loginUser, registerUser } from "../controllers/UserControllers.js";
import { addContact, getContacts } from "../controllers/ContactController.js";

const router = express.Router();

router.post("/register", registerUser);
router.post("/login", loginUser);
router.post("/addcontact/:userId", addContact);
router.get("/contacts/:userId", getContacts);
//router.post("/auth/google", googleAuth);

export default router;
