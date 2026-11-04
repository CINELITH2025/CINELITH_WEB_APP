import { io } from "socket.io-client";
import { getToken } from "./api";

let socket = null;
let onMessage = null;

export const connectSocket = (userId, handleMessage) => {
  if (handleMessage) onMessage = handleMessage;

  if (socket?.connected) {
    if (userId) socket.emit("join", String(userId));
    return socket;
  }

  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
  }

  const socketUrl = import.meta.env.VITE_SOCKET_URL ||
    (import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/api\/?$/, "") : undefined);

  socket = io(socketUrl, {
    auth: { token: getToken() },
    transports: ["websocket", "polling"],
    reconnectionAttempts: 5,
    reconnectionDelay: 1000
  });

  const join = () => {
    if (userId) socket.emit("join", String(userId));
  };

  socket.on("connect", join);
  socket.on("reconnect", join);
  socket.on("receive_message", (msg) => {
    if (onMessage) onMessage(msg);
  });

  return socket;
};

export const disconnectSocket = () => {
  if (socket) {
    socket.removeAllListeners();
    socket.disconnect();
    socket = null;
  }
};

export const getSocket = () => socket;

export const sendChatMessage = ({ senderId, senderName, receiverId, text, share }) => {
  if (!socket?.connected) {
    throw new Error("Chat is not connected");
  }
  socket.emit("send_message", { senderId, senderName, receiverId, text, share });
};
