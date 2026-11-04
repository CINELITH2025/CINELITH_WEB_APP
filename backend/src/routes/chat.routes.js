import express from "express";
import Message, { conversationKeyFor, serializeMessage } from "../models/Message.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";

const router = express.Router();

router.get("/:friendId", protect, async (req, res, next) => {
  try {
    const me = String(req.user.id);
    const friendId = String(req.params.friendId);

    const friend = await User.findById(friendId).select("name avatar");
    if (!friend) {
      return res.status(404).json({ message: "User not found" });
    }

    const conversationKey = conversationKeyFor(me, friendId);

    const messages = await Message.find({ conversationKey })
      .sort({ createdAt: 1 })
      .limit(200)
      .lean();

    await Message.updateMany(
      { conversationKey, receiver: me, read: false },
      { $set: { read: true } }
    );

    res.json({
      friend: {
        _id: String(friend._id),
        name: friend.name,
        avatar: friend.avatar || null
      },
      messages: messages.map(serializeMessage)
    });
  } catch (err) {
    next(err);
  }
});

export default router;
