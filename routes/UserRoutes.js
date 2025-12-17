import express from "express";
import  { userSignUp, Userlogin, resetPassword } from "../controllers/UserController.js";

const router = express.Router();

router.post("/register", userSignUp);
router.post("/login", Userlogin);
router.post("/reset-password", resetPassword);

export default router;
