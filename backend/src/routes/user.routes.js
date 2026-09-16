import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";
import { serializeUser } from "../utils/user.serializer.js";
import { buildOnboardingFields } from "../utils/onboarding.js";

const router = express.Router();

const loadSafeUser = (id) =>
  User.findById(id)
    .select("-password")
    .populate("friends", "name email avatar bio")
    .populate("followers", "name email avatar bio")
    .populate("following", "name email avatar bio")
    .populate("pendingRequests", "name email avatar bio")
    .lean();

const getUserOr404 = async (id, res) => {
  const user = await User.findById(id);
  if (!user) {
    res.status(404).json({ message: "User not found" });
    return null;
  }
  return user;
};

/**
 * GET PROFILE
 */
router.get("/me", protect, async (req, res, next) => {
  try {
    const user = await loadSafeUser(req.user.id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    res.json(serializeUser(user));
  } catch (err) {
    next(err);
  }
});

/**
 * UPDATE BASIC PROFILE
 */
router.patch("/me", protect, async (req, res, next) => {
  try {
    const { name, avatar, bio, location } = req.body;
    const user = await getUserOr404(req.user.id, res);
    if (!user) return;

    if (name !== undefined) user.name = name;
    if (avatar !== undefined) user.avatar = avatar;
    if (bio !== undefined) user.bio = bio;
    if (location !== undefined) user.location = location;

    await user.save();

    const updated = await loadSafeUser(req.user.id);
    res.json(serializeUser(updated));
  } catch (err) {
    next(err);
  }
});

/**
 * SAVE ONBOARDING PREFERENCES
 */
router.put("/onboarding", protect, async (req, res, next) => {
  try {
    const user = await getUserOr404(req.user.id, res);
    if (!user) return;

    Object.assign(user, buildOnboardingFields(req.body));
    await user.save();

    const updated = await loadSafeUser(req.user.id);
    res.json(serializeUser(updated));
  } catch (err) {
    next(err);
  }
});

/**
 * CONNECT USERS (mutual friends)
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
    }

    if (!friend.friends.map(String).includes(userId)) {
      friend.friends.push(userId);
    }

    user.pendingRequests = user.pendingRequests.filter(
      (id) => String(id) !== friendId
    );
    friend.pendingRequests = friend.pendingRequests.filter(
      (id) => String(id) !== userId
    );

    await Promise.all([user.save(), friend.save()]);

    res.json({ message: "Connected mutually" });
  } catch (err) {
    next(err);
  }
});

/**
 * SEND FRIEND REQUEST
 */
router.post("/friend-request/:id", protect, async (req, res, next) => {
  try {
    const userId = String(req.user.id);
    const targetId = String(req.params.id);

    if (userId === targetId) {
      return res.status(400).json({ message: "Cannot send request to yourself" });
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.friends.map(String).includes(targetId)) {
      return res.status(400).json({ message: "Already connected" });
    }

    if (target.pendingRequests.map(String).includes(userId)) {
      return res.status(400).json({ message: "Request already pending" });
    }

    target.pendingRequests.push(userId);
    await target.save();

    res.json({ message: "Friend request sent" });
  } catch (err) {
    next(err);
  }
});

/**
 * FOLLOW USER
 */
router.post("/follow/:id", protect, async (req, res, next) => {
  try {
    const userId = String(req.user.id);
    const targetId = String(req.params.id);

    if (userId === targetId) {
      return res.status(400).json({ message: "Cannot follow yourself" });
    }

    const user = await User.findById(userId);
    const target = await User.findById(targetId);

    if (!target) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!user.following.map(String).includes(targetId)) {
      user.following.push(targetId);
      await user.save();
    }

    if (!target.followers.map(String).includes(userId)) {
      target.followers.push(userId);
      await target.save();
    }

    res.json({ message: "Followed user" });
  } catch (err) {
    next(err);
  }
});

/**
 * LIKE MOVIE / SERIES
 */
router.post("/like", protect, async (req, res, next) => {
  try {
    const { tvdbId, title, type } = req.body;

    if (!tvdbId || !title || !type) {
      return res.status(400).json({ message: "tvdbId, title, type required" });
    }

    const user = await User.findById(req.user.id);

    if (!user.favoriteMovies.some((m) => m.tvdbId === tvdbId)) {
      user.favoriteMovies.push({ tvdbId, title, type });
      await user.save();
    }

    res.json({ message: "Liked", title });
  } catch (err) {
    next(err);
  }
});

/**
 * ADD TO WATCHLIST
 */
router.post("/watchlist", protect, async (req, res, next) => {
  try {
    const { tvdbId, title, type } = req.body;

    if (!userFieldsValid(tvdbId, title, type, res)) return;

    const user = await User.findById(req.user.id);

    if (!user.watchlist.some((m) => m.tvdbId === tvdbId)) {
      user.watchlist.push({ tvdbId, title, type });
      await user.save();
    }

    res.json({ message: "Added to watchlist", title });
  } catch (err) {
    next(err);
  }
});

/**
 * RATE MOVIE
 */
router.post("/rate", protect, async (req, res, next) => {
  try {
    const { tvdbId, title, type, rating } = req.body;

    if (rating < 0 || rating > 10) {
      return res.status(400).json({ message: "Rating must be 0–10" });
    }

    const user = await User.findById(req.user.id);

    user.ratings = user.ratings.filter((r) => r.tvdbId !== tvdbId);
    user.ratings.push({ tvdbId, title, type, rating });

    await user.save();

    res.json({ message: "Rated", title, rating });
  } catch (err) {
    next(err);
  }
});

/**
 * ADD REVIEW
 */
router.post("/review", protect, async (req, res, next) => {
  try {
    const { tvdbId, title, type, content, rating } = req.body;

    if (!tvdbId || !title || !type || !content) {
      return res.status(400).json({ message: "tvdbId, title, type, content required" });
    }

    const user = await User.findById(req.user.id);

    user.reviews = user.reviews.filter((r) => r.tvdbId !== tvdbId);
    user.reviews.push({ tvdbId, title, type, content, rating });

    await user.save();

    res.json({ message: "Review saved", title });
  } catch (err) {
    next(err);
  }
});

/**
 * TRACK RECENTLY VIEWED
 */
router.post("/recently-viewed", protect, async (req, res, next) => {
  try {
    const { tvdbId, title, type } = req.body;

    if (!userFieldsValid(tvdbId, title, type, res)) return;

    const user = await User.findById(req.user.id);

    const isNewView = !user.recentlyViewed.some((m) => m.tvdbId === tvdbId);

    user.recentlyViewed = user.recentlyViewed.filter((m) => m.tvdbId !== tvdbId);
    user.recentlyViewed.unshift({ tvdbId, title, type, viewedAt: new Date() });
    user.recentlyViewed = user.recentlyViewed.slice(0, 50);

    if (isNewView) {
      user.moviesWatched += 1;
    }

    await user.save();

    res.json({ message: "Recently viewed updated", title });
  } catch (err) {
    next(err);
  }
});

/**
 * CREATE COLLECTION
 */
router.post("/collections", protect, async (req, res, next) => {
  try {
    const { name, description, movies } = req.body;

    if (!name) {
      return res.status(400).json({ message: "Collection name required" });
    }

    const user = await User.findById(req.user.id);

    user.collections.push({
      name,
      description: description || "",
      movies: movies || []
    });

    await user.save();

    res.status(201).json({ message: "Collection created", name });
  } catch (err) {
    next(err);
  }
});

/**
 * UPDATE NOTIFICATION PREFERENCES
 */
router.patch("/notifications", protect, async (req, res, next) => {
  try {
    const { unreadCount, notificationPreferences } = req.body;
    const user = await getUserOr404(req.user.id, res);
    if (!user) return;

    if (unreadCount !== undefined) user.unreadCount = unreadCount;

    if (notificationPreferences) {
      user.notificationPreferences = {
        ...user.notificationPreferences,
        ...notificationPreferences
      };
    }

    await user.save();

    const updated = await loadSafeUser(req.user.id);
    res.json(serializeUser(updated));
  } catch (err) {
    next(err);
  }
});

function userFieldsValid(tvdbId, title, type, res) {
  if (!tvdbId || !title || !type) {
    res.status(400).json({ message: "tvdbId, title, type required" });
    return false;
  }
  return true;
}

export default router;
