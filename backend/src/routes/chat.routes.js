import express from "express";
import mongoose from "mongoose";
import Message, { conversationKeyFor, serializeMessage } from "../models/Message.js";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";
import { createNotification } from "../services/notification.service.js";

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

router.post("/:friendId", protect, async (req, res, next) => {
  try {
    const senderId = String(req.user.id);
    const receiverId = String(req.params.friendId);
    const text = String(req.body.text || "").trim();
    if (!mongoose.isValidObjectId(receiverId) || receiverId === senderId) {
      return res.status(400).json({ message: "Invalid conversation user" });
    }
    if (!text) return res.status(400).json({ message: "Message text is required" });

    const [sender, receiver] = await Promise.all([
      User.findById(senderId).select("name"),
      User.findById(receiverId).select("_id")
    ]);
    if (!sender || !receiver) return res.status(404).json({ message: "Conversation user not found" });

    const inputShare = req.body.share && typeof req.body.share === "object" ? req.body.share : null;
    const message = await Message.create({
      conversationKey: conversationKeyFor(senderId, receiverId),
      sender: senderId,
      receiver: receiverId,
      senderName: sender.name || "User",
      text,
      ...(inputShare?.kind ? {
        share: {
          kind: inputShare.kind,
          movieId: inputShare.movieId,
          title: inputShare.title,
          image: inputShare.image,
          year: inputShare.year,
          rating: inputShare.rating,
          text: inputShare.text
        }
      } : {})
    });

    await createNotification({
      userId: receiverId,
      type: "message",
      title: "New message",
      text: message.share?.title
        ? `${sender.name || "Someone"} shared ${message.share.title} with you.`
        : `${sender.name || "Someone"} sent you a message.`
    }).catch(() => null);

    res.status(201).json(serializeMessage(message));
  } catch (err) {
    next(err);
  }
});

export default router;
