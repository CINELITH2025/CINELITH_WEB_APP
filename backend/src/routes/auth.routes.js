import express from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import User from "../models/User.js";
import { serializeUser } from "../utils/user.serializer.js";

const router = express.Router();

const signToken = (userId) =>
  jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });

/* =====================
   REGISTER (includes onboarding)
===================== */
router.post("/register", async (req, res, next) => {
  try {
    const { name, email, password, bio, username, avatar } = req.body;

    if (!name || !email || !password) {
      return res.status(400).json({ message: "name, email, password required" });
    }

    const existing = await User.findOne({ email });

    if (existing) {
      return res.status(409).json({ message: "Email already registered" });
    }

    if (username) {
      const taken = await User.findOne({ username });
      if (taken) {
        return res.status(409).json({ message: "Username already taken" });
      }
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      bio: bio || "",
      username: username || undefined,
      avatar: avatar || null,
      onboardingCompleted: false
    });

    const safeUser = await User.findById(user._id).select("-password").lean();

    res.status(201).json({
      message: "User registered",
      token: signToken(user._id),
      user: serializeUser(safeUser)
    });
  } catch (err) {
    next(err);
  }
});

/* =====================
   LOGIN
===================== */
router.post("/login", async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const ok = await bcrypt.compare(password, user.password);
    if (!ok) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    const safeUser = await User.findById(user._id)
      .select("-password")
      .populate("friends", "name email avatar bio")
      .lean();

    res.json({
      token: signToken(user._id),
      user: serializeUser(safeUser)
    });
  } catch (err) {
    console.error("LOGIN ERROR:", err);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
