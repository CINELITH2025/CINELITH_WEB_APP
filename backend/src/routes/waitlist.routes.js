import express from "express";
import Waitlist from "../models/Waitlist.js";

const router = express.Router();

// @route   POST /api/waitlist
// @desc    Join the early access waitlist
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, country, favoriteMovie } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    // Check if email already registered
    const existing = await Waitlist.findOne({ email: email.toLowerCase().trim() });
    if (existing) {
      return res.status(400).json({ message: "This email is already registered on the waitlist!" });
    }

    const waitlistEntry = new Waitlist({
      name,
      email,
      country: country || "",
      favoriteMovie: favoriteMovie || ""
    });

    await waitlistEntry.save();
    return res.status(201).json({
      message: "Successfully joined early access waitlist!",
      data: {
        name: waitlistEntry.name,
        email: waitlistEntry.email,
        country: waitlistEntry.country,
        favoriteMovie: waitlistEntry.favoriteMovie
      }
    });
  } catch (error) {
    console.error("Waitlist registration error:", error);
    if (error.name === "ValidationError") {
      const messages = Object.values(error.errors).map(val => val.message);
      return res.status(400).json({ message: messages.join(", ") });
    }
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @route   GET /api/waitlist
// @desc    Get all waitlist entries
// @access  Public (for development/demo purposes)
router.get("/", async (req, res) => {
  try {
    const entries = await Waitlist.find().sort({ createdAt: -1 });
    return res.json(entries);
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @route   GET /api/waitlist/count
// @desc    Get total waitlisted users count for proof of traction
// @access  Public
router.get("/count", async (req, res) => {
  try {
    const count = await Waitlist.countDocuments();
    // Return a base offset (e.g. + 284) to make it look premium and active
    return res.json({ count: count + 284 });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
