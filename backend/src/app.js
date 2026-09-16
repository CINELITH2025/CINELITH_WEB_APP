import express from "express";
import cors from "cors";
import helmet from "helmet";
import rateLimit from "express-rate-limit";

import authRoutes from "./routes/auth.routes.js";
import userRoutes from "./routes/user.routes.js";
import searchRoutes from "./routes/search.routes.js";
import movieRoutes from "./routes/movie.routes.js";
import waitlistRoutes from "./routes/waitlist.routes.js";
import chatRoutes from "./routes/chat.routes.js";

const app = express();

// Security Headers (Clickjacking, XSS, MIME Sniffing protection)
app.use(helmet({
  crossOriginResourcePolicy: { policy: "cross-origin" }
}));

// CORS Configuration
app.use(cors());
app.use(express.json({ limit: '10kb' })); // Prevents Payload Denial of Service attacks

// Rate Limiter to prevent API Abuse / DDoS
const globalLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: { message: "Too many requests from this IP, please try again after 15 minutes." }
});

// Strict Rate Limiter for OTP Endpoints (Brute-force protection)
const otpLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 10, // Limit each IP to 10 OTP requests per 15 minutes
  message: { message: "Too many verification attempts. Please wait 15 minutes before requesting a new code." }
});

app.use("/api", globalLimiter);
app.use("/api/waitlist/send-otp", otpLimiter);
app.use("/api/waitlist/verify-otp", otpLimiter);

app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/search", searchRoutes);
app.use("/api/movies", movieRoutes);
app.use("/api/waitlist", waitlistRoutes);
app.use("/api/chats", chatRoutes);

app.use((err, req, res, next) => {
  console.error("GLOBAL ERROR:", err);
  res.status(500).json({ message: "Internal server error" });
});

export default app;
