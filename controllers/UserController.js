import User from "../models/UserLogin.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import validator from "validator";

// Register (Sign up)
export const userSignUp = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    // 1️⃣ Check empty fields
    if (!email || !password || !username) {
      return res.status(400).json({ message: "All fields are required" });
    }

    // 2️⃣ Email validate
    if (!validator.isEmail(email)) {
      return res.status(400).json({ message: "Invalid email format" });
    }

    // 3️⃣ Duplicate email check
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already registered" });
    }

    // 4️⃣ Create user
    const user = await User.create(req.body);

    res.status(201).json({
      message: "User created successfully",
      user: user
    });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// Login
export const Userlogin = async (req, res) => {
  try {
    const { email, password } = req.body;
    console.log("Input password for login:", password);

    const user = await User.findOne({ email });
    
    if (!user) return res.status(400).json({ message: "User not found" });
    console.log("Hashed password from DB:", user.password);

    const isMatch = await user.comparePassword(password);
    console.log("Password match result:", isMatch);
    if (!isMatch) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

    // 🔥 FIX: TOKEN COOKIE ME SET KARO
    res.cookie("token", token, {
      httpOnly: true,
      secure: false,   // production me true karna
      sameSite: "lax",
      maxAge: 7 * 24 * 60 * 60 * 1000   // 7 days
    });

    res.json({
      message: "Login success",
      token,
      userId: user._id,
      user: { _id: user._id, username: user.username, email: user.email }
    });
  } catch (error) {
    console.error("Userlogin error:", error);
    res.status(500).json({ message: error.message });
  }
};


// reset password
export const resetPassword = async (req, res) => {
  try {
    const { email, password } = req.body;
    //console.log("Input password:", password);

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    //const hashedPassword = await bcrypt.hash(password, 10);
    //console.log("Hashed password from DB:", user.password);
    user.password = password; // pre-save hook automatically hash karega
    await user.save();

    res.json({ message: "Password reset successful!" });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};