import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

/**
 * GET PROFILE
 */
router.get("/me", protect, async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id)
      .select("-password")
      .lean();

    user._id = String(user._id);
    user.friends = user.friends.map(String);

    res.json(user);
  } catch (err) {
    next(err);
  }
});

/**
 * CONNECT USERS
 */
router.post("/connect/:id", protect, async (req, res, next) => {
  try {
    const userId = String(req.user.id);
    const friendId = String(req.params.id);

    if (userId === friendId) {
      return res.status(400).json({ message: "Cannot connect to yourself" });
    }

    const user = await User.findById(userId);
    const friend = await User.findById(friendId);

    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.friends.map(String).includes(friendId)) {
      user.friends.push(friendId);
      await user.save();
    }

    if (!friend.friends.map(String).includes(userId)) {
      friend.friends.push(userId);
      await friend.save();
    }

    res.json({ message: "Connected mutually" });
  } catch (err) {
    next(err);
  }
});

/**
 * LIKE MOVIE / SERIES
 */
router.post("/like", protect, async (req, res) => {
  try {
    const { tvdbId, title, type } = req.body;

    if (!tvdbId || !title || !type) {
      return res.status(400).json({ message: "tvdbId, title, type required" });
    }

    const user = await User.findById(req.user.id);

    if (!user.favoriteMovies.some(m => m.tvdbId === tvdbId)) {
      user.favoriteMovies.push({ tvdbId, title, type });
      await user.save();
    }

    res.json({ message: "Liked", title });
  } catch (err) {
    console.error("LIKE ERROR:", err);
    res.status(500).json({ message: "Like failed" });
  }
});

/**
 * ADD TO WATCHLIST
 */
router.post("/watchlist", protect, async (req, res) => {
  try {
    const { tvdbId, title, type } = req.body;

    const user = await User.findById(req.user.id);

    if (!user.watchlist) user.watchlist = [];

    if (!user.watchlist.some(m => m.tvdbId === tvdbId)) {
      user.watchlist.push({ tvdbId, title, type });
      await user.save();
    }

    res.json({ message: "Added to watchlist", title });
  } catch (err) {
    console.error("WATCHLIST ERROR:", err);
    res.status(500).json({ message: "Watchlist failed" });
  }
});

/**
 * RATE MOVIE
 */
router.post("/rate", protect, async (req, res) => {
  try {
    const { tvdbId, title, type, rating } = req.body;

    if (rating < 0 || rating > 10) {
      return res.status(400).json({ message: "Rating must be 0–10" });
    }

    const user = await User.findById(req.user.id);

    user.ratings = user.ratings || [];

    user.ratings = user.ratings.filter(r => r.tvdbId !== tvdbId);
    user.ratings.push({ tvdbId, title, type, rating });

    await user.save();

    res.json({ message: "Rated", title, rating });
  } catch (err) {
    console.error("RATING ERROR:", err);
    res.status(500).json({ message: "Rating failed" });
  }
});

export default router;
