import express from "express";
import nodemailer from "nodemailer";
import { Resend } from "resend";
import Waitlist from "../models/Waitlist.js";

const router = express.Router();

// Initialize Resend SDK strictly from environment variables
const getResendClient = () => {
  const apiKey = process.env.RESEND_API_KEY;
  if (apiKey) {
    return new Resend(apiKey);
  }
  return null;
};

// Helper to send email via Resend or Nodemailer SMTP
const sendEmailOTP = async (email, otp) => {
  const resend = getResendClient();

  const htmlContent = `
    <div style="font-family: Arial, sans-serif; background-color: #090909; color: #ffffff; padding: 30px; border-radius: 16px; max-width: 500px; margin: 0 auto; border: 1px solid #333333;">
      <h2 style="color: #FACC15; font-size: 24px; margin-bottom: 8px;">CINELITH Pre-Launch</h2>
      <p style="color: #cccccc; font-size: 14px;">Your 6-digit email verification code is:</p>
      <div style="background-color: #151515; border: 1px solid #FACC15; color: #FACC15; font-size: 32px; font-weight: bold; letter-spacing: 8px; padding: 16px; text-align: center; border-radius: 12px; margin: 24px 0;">
        ${otp}
      </div>
      <p style="color: #888888; font-size: 12px; leading-relaxed: 1.5;">This code will expire in 10 minutes. If you did not request early access to CINELITH, please ignore this email.</p>
    </div>
  `;

  if (resend) {
    try {
      const { data, error } = await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || 'CINELITH <onboarding@resend.dev>',
        to: email,
        subject: `${otp} is your CINELITH verification code`,
        html: htmlContent
      });

      if (error) {
        console.error("⚠️ Resend Email Error:", error);
        throw new Error(error.message || "Resend email sending failed");
      }

      console.log(`✉️ Resend OTP email delivered to ${email}`, data);
      return;
    } catch (err) {
      console.warn("⚠️ Resend delivery warning:", err.message);
    }
  }

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
        subject: `${otp} is your CINELITH verification code`,
        html: htmlContent
      });
      console.log(`✉️ SMTP Email OTP sent to ${email}`);
    } catch (err) {
      console.warn("⚠️ SMTP email sending failed:", err.message);
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

  if (!name || !email || typeof email !== 'string' || typeof name !== 'string') {
    return res.status(400).json({ message: "Valid name and email are required" });
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

    const isProduction = process.env.NODE_ENV === 'production' || !!process.env.VERCEL || !!process.env.VERCEL_ENV;

    return res.status(200).json({
      message: `Verification code sent to ${cleanEmail}`,
      email: cleanEmail,
      demoOtp: (isProduction || process.env.EMAIL_USER) ? undefined : otp
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

  if (!email || !otp || typeof email !== 'string' || typeof otp !== 'string') {
    return res.status(400).json({ message: "Valid email and verification code are required" });
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
