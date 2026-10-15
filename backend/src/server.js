import http from "http";
import dotenv from "dotenv";
import app from "./app.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./sockets/chat.socket.js";
import { rebuildKnnIndex } from "./services/knn-rebuild.service.js";

dotenv.config();

process.on("unhandledRejection", (reason, promise) => {
  console.error("UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

connectDB().then(() => {
  rebuildKnnIndex().catch((err) => console.error("KNN startup rebuild failed", err));
});

const server = http.createServer(app);
initSocket(server);

server.listen(process.env.PORT, () => {
  console.log(`🚀 Server running on port ${process.env.PORT}`);
});
