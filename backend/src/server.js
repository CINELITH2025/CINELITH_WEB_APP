import http from "http";
import app from "./app.js";
import { validateEnv } from "./config/env.js";
import { connectDB } from "./config/db.js";
import { initSocket } from "./sockets/chat.socket.js";
import { rebuildKnnIndex } from "./services/knn-rebuild.service.js";

// Validate environment variables on startup
validateEnv();

process.on("unhandledRejection", (reason, _promise) => {
  console.error("UNHANDLED REJECTION:", reason);
});

process.on("uncaughtException", (err) => {
  console.error("UNCAUGHT EXCEPTION:", err);
});

const server = http.createServer(app);
initSocket(server);

const PORT = process.env.PORT || 5050;

connectDB()
  .then((conn) => {
    if (!conn) {
      console.error("❌ MongoDB connection failed — server will NOT start.");
      process.exit(1);
    }
    rebuildKnnIndex().catch((err) => console.error("KNN startup rebuild failed", err));
    server.listen(PORT, () => {
      console.log(`🚀 CINELITH Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("❌ Fatal startup error:", err);
    process.exit(1);
  });
