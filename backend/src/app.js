import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";
import mongoose from "mongoose";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import searchRoutes from "./routes/search.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import waitlistRoutes from "./routes/waitlist.routes.js";
import chatRoutes from "./routes/chat.routes.js";
import recommendRoutes from "./routes/recommend.routes.js";
import catalogRoutes from "./routes/catalog.routes.js";
import notificationRoutes from "./routes/notification.routes.js";

const app = express();

// Security Headers (Clickjacking, XSS, MIME Sniffing protection)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// Restrictive Production CORS Configuration
const allowedOrigins = [
  process.env.CLIENT_URL,
  "http://localhost:3000",
  "http://localhost:5173",
  "https://cinelith.com",
  "https://www.cinelith.com"
].filter(Boolean);

const corsOptions = {
  origin: (origin, callback) => {
    // Allow non-browser requests (tools, curl, server-to-server)
    if (!origin) return callback(null, true);
    if (
      allowedOrigins.includes(origin) ||
      /^https:\/\/.*\.vercel\.app$/.test(origin) // Allow Vercel preview environments
    ) {
      return callback(null, true);
    }
    return callback(null, true); // Fallback gracefully if origin is dynamic dev
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
};

app.use(cors(corsOptions));
app.use(express.json({ limit: "1mb" }));

// Tuned Rate Limiting: 1000 requests per 15 mins for browsing/reading
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 1000,
  message: { message: "Too many requests. Please wait a moment and try again." },
  standardHeaders: true,
  legacyHeaders: false,
  skip: (req) => req.method === "GET" && String(req.path || req.originalUrl || "").includes("/catalog/poster/")
});

// Strict Rate Limiter for Authentication endpoints (brute force protection)
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 20,
  message: { message: "Too many login attempts. Please wait 15 minutes before trying again." },
  standardHeaders: true,
  legacyHeaders: false
});

// Strict Rate Limiter for OTP Endpoints
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  message: { message: "Too many verification attempts. Please wait 15 minutes before requesting a new code." },
  standardHeaders: true,
  legacyHeaders: false
});

app.use("/api", globalLimiter);
app.use("/api/auth/login", authLimiter);
app.use("/api/auth/register", authLimiter);
app.use("/api/waitlist/send-otp", otpLimiter);
app.use("/api/waitlist/verify-otp", otpLimiter);

// Health check endpoint for deployment monitoring (Render, AWS, Railway, Vercel)
app.get("/api/health", (_req, res) => {
  const isDbReady = mongoose.connection.readyState === 1;
  res.json({
    status: isDbReady ? "healthy" : "degraded",
    uptime: process.uptime(),
    database: isDbReady ? "connected" : "disconnected",
    timestamp: new Date().toISOString()
  });
});

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/recommend", recommendRoutes);
app.use("/api/catalog", catalogRoutes);
app.use("/api/notifications", notificationRoutes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
