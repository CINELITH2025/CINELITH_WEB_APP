import { Server } from "socket.io";
import mongoose from "mongoose";
import jwt from "jsonwebtoken";
import Message, { conversationKeyFor, serializeMessage } from "../models/Message.js";
import { createNotification } from "../services/notification.service.js";
import { applyStreak, refreshCinephileScore } from "../services/cinephile-score.service.js";
import User from "../models/User.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  const userRoom = (userId) => `user:${String(userId)}`;

  io.use((socket, next) => {
    try {
      const token = socket.handshake.auth?.token;
      if (!token) return next(new Error("Authentication required"));
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      if (!decoded.id) return next(new Error("Invalid authentication token"));
      socket.data.userId = String(decoded.id);
      next();
    } catch {
      next(new Error("Invalid authentication token"));
    }
  });

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);
    socket.join(userRoom(socket.data.userId));

    socket.on("send_message", async (msg) => {
      try {
        const senderId = socket.data.userId;
        const receiverId = String(msg.receiverId || "");
        const text = String(msg.text || "").trim();
        const share = msg.share && typeof msg.share === "object" ? msg.share : null;

        if (!senderId || !mongoose.isValidObjectId(receiverId) || senderId === receiverId || !text) {
          socket.emit("message_error", { message: "Invalid message" });
          return;
        }

        const sender = await User.findById(senderId);
        const receiver = await User.findById(receiverId).select("_id");
        if (!sender || !receiver) {
          socket.emit("message_error", { message: "Conversation user not found" });
          return;
        }

        const saved = await Message.create({
          conversationKey: conversationKeyFor(senderId, receiverId),
          sender: senderId,
          receiver: receiverId,
          senderName: sender.name || "User",
          text,
          ...(share?.kind
            ? {
                share: {
                  kind: share.kind,
                  movieId: share.movieId,
                  title: share.title,
                  image: share.image,
                  year: share.year,
                  rating: share.rating,
                  text: share.text
                }
              }
            : {})
        });

        const payload = serializeMessage(saved);

        io.to(userRoom(receiverId)).emit("receive_message", payload);
        socket.emit("message_sent", payload);

        await createNotification({
          userId: receiverId,
          type: "message",
          title: "New message",
          text: payload.share?.title
            ? `${payload.senderName || "Someone"} shared ${payload.share.title} with you.`
            : `${payload.senderName || "Someone"} sent you a message.`
        }).catch(() => null);

        applyStreak(sender);
        await refreshCinephileScore(sender).catch(() => null);
      } catch (err) {
        console.error("CHAT SAVE ERROR:", err);
        socket.emit("message_error", { message: "Failed to save message" });
      }
    });

    socket.on("disconnect", () => {
      console.log("Socket disconnected:", socket.id);
    });
  });
};
