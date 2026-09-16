import { Server } from "socket.io";
import Message, { conversationKeyFor, serializeMessage } from "../models/Message.js";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  const userRoom = (userId) => `user:${String(userId)}`;

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
      const uid = String(userId);
      if (socket.data.userId && socket.data.userId !== uid) {
        socket.leave(userRoom(socket.data.userId));
      }
      socket.data.userId = uid;
      socket.join(userRoom(uid));
      console.log("User joined chat:", uid, socket.id);
    });

    socket.on("send_message", async (msg) => {
      try {
        const senderId = String(msg.senderId || socket.data.userId || "");
        const receiverId = String(msg.receiverId || "");
        const text = String(msg.text || "").trim();

        if (!senderId || !receiverId || !text) {
          socket.emit("message_error", { message: "Invalid message" });
          return;
        }

        const saved = await Message.create({
          conversationKey: conversationKeyFor(senderId, receiverId),
          sender: senderId,
          receiver: receiverId,
          senderName: msg.senderName || "User",
          text
        });

        const payload = serializeMessage(saved);

        io.to(userRoom(receiverId)).emit("receive_message", payload);
        socket.emit("message_sent", payload);
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
