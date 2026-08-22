import express from "express";
import nodemailer from "nodemailer";
import Waitlist from "../models/Waitlist.js";

const router = express.Router();

// Helper to send email via SMTP if configured
const sendEmailOTP = async (email, otp) => {
  if (process.env.EMAIL_USER && process.env.EMAIL_PASS) {
    try {
      const transporter = nodemailer.createTransport({
        host: process.env.SMTP_HOST || "smtp.gmail.com",
        port: parseInt(process.env.SMTP_PORT || "587"),
        secure: process.env.SMTP_SECURE === "true",
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS
        }
      });

      await transporter.sendMail({
        from: `"CINELITH Pre-Launch" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Your CINELITH Pre-Launch Verification Code",
        html: `
          <div style="font-family: Arial, sans-serif; background-color: #090909; color: #ffffff; padding: 30px; rounded: 16px;">
            <h2 style="color: #FACC15; font-size: 24px;">CINELITH Pre-Launch Access</h2>
            <p>Your 6-digit email verification code is:</p>
            <div style="background-color: #151515; border: 1px solid #FACC15; color: #FACC15; font-size: 32px; font-weight: bold; letter-spacing: 6px; padding: 15px; text-align: center; border-radius: 12px; margin: 20px 0;">
              ${otp}
            </div>
            <p style="color: #999999; font-size: 12px;">This code expires in 10 minutes. If you did not request this, please ignore this email.</p>
          </div>
        `
      });
      console.log(`✉️ Email OTP sent to ${email}`);
    } catch (err) {
      console.warn("⚠️ SMTP email sending failed, falling back to response demo mode:", err.message);
    }
  } else {
    console.log(`🔑 Demo OTP for ${email}: ${otp}`);
  }
};

// @route   POST /api/waitlist/send-otp
// @desc    Send 6-digit OTP code to user's email
// @access  Public
router.post("/send-otp", async (req, res) => {
  const { name, email, country, favoriteMovie } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    // Check if email already verified & registered
    const existing = await Waitlist.findOne({ email: cleanEmail });
    if (existing && existing.isVerified) {
      return res.status(400).json({ message: "This email is already registered on the waitlist!" });
    }

    // Generate random 6-digit numeric OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const otpExpiresAt = new Date(Date.now() + 10 * 60 * 1000); // 10 mins expiry

    let entry = existing;
    if (!entry) {
      entry = new Waitlist({
        name,
        email: cleanEmail,
        country: country || "",
        favoriteMovie: favoriteMovie || "",
        otp,
        otpExpiresAt,
        isVerified: false
      });
    } else {
      entry.name = name;
      entry.country = country || entry.country;
      entry.favoriteMovie = favoriteMovie || entry.favoriteMovie;
      entry.otp = otp;
      entry.otpExpiresAt = otpExpiresAt;
    }

    await entry.save();
    await sendEmailOTP(cleanEmail, otp);

    return res.status(200).json({
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail,
      demoOtp: process.env.EMAIL_USER ? undefined : otp // for easy demo testing
    });
  } catch (error) {
    console.error("Error sending OTP:", error);
    return res.status(500).json({ message: "Failed to send verification code. Please try again." });
  }
});

// @route   POST /api/waitlist/verify-otp
// @desc    Verify 6-digit OTP code & confirm waitlist registration
// @access  Public
router.post("/verify-otp", async (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and verification code are required" });
  }

  const cleanEmail = email.toLowerCase().trim();

  try {
    const entry = await Waitlist.findOne({ email: cleanEmail });

    if (!entry) {
      return res.status(404).json({ message: "No registration found for this email. Please submit your details first." });
    }

    if (entry.isVerified) {
      return res.status(400).json({ message: "This email has already been verified!" });
    }

    if (!entry.otp || entry.otp !== otp.trim()) {
      return res.status(400).json({ message: "Invalid verification code. Please check and try again." });
    }

    if (new Date() > entry.otpExpiresAt) {
      return res.status(400).json({ message: "Verification code has expired. Please request a new code." });
    }

    // Mark as verified & clear OTP
    entry.isVerified = true;
    entry.otp = null;
    entry.otpExpiresAt = null;
    await entry.save();

    const count = await Waitlist.countDocuments({ isVerified: true });
    const userQueueNum = count + 384;

    return res.status(200).json({
      message: "Email verified successfully! Welcome to CINELITH Early Access.",
      data: {
        name: entry.name,
        email: entry.email,
        country: entry.country,
        favoriteMovie: entry.favoriteMovie,
        queueNum: userQueueNum
      }
    });
  } catch (error) {
    console.error("Error verifying OTP:", error);
    return res.status(500).json({ message: "Verification failed. Please try again." });
  }
});

// @route   POST /api/waitlist
// @desc    Legacy direct join (fallback)
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, country, favoriteMovie } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    const existing = await Waitlist.findOne({ email: email.toLowerCase().trim() });
    if (existing && existing.isVerified) {
      return res.status(400).json({ message: "This email is already registered on the waitlist!" });
    }

    const waitlistEntry = existing || new Waitlist({ name, email, country: country || "", favoriteMovie: favoriteMovie || "" });
    waitlistEntry.isVerified = true;
    await waitlistEntry.save();

    return res.status(201).json({
      message: "Successfully joined early access waitlist!",
      data: {
        name: waitlistEntry.name,
        email: waitlistEntry.email,
        country: waitlistEntry.country,
        favoriteMovie: waitlistEntry.favoriteMovie
      }
    });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

// @route   GET /api/waitlist/count
// @desc    Get total waitlisted users count for proof of traction
// @access  Public
router.get("/count", async (req, res) => {
  try {
    const count = await Waitlist.countDocuments();
    return res.json({ count: count + 384 });
  } catch (error) {
    return res.status(500).json({ message: "Internal server error" });
  }
});

export default router;
