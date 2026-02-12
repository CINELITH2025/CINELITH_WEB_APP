import { Server } from "socket.io";

export const initSocket = (server) => {
  const io = new Server(server, {
    cors: { origin: "*" }
  });

  const users = new Map();

  io.on("connection", (socket) => {
    console.log("Socket connected:", socket.id);

    socket.on("join", (userId) => {
      const uid = String(userId);
      users.set(uid, socket.id);
      console.log("User joined chat:", uid);
    });

    socket.on("send_message", (msg) => {
      const receiverId = String(msg.receiverId);
      const receiverSocketId = users.get(receiverId);

      if (receiverSocketId) {
        io.to(receiverSocketId).emit("receive_message", msg);
      }
    });

    socket.on("disconnect", () => {
      for (const [uid, sid] of users.entries()) {
        if (sid === socket.id) {
          users.delete(uid);
          break;
        }
      }
      console.log("Socket disconnected:", socket.id);
    });
  });
};
