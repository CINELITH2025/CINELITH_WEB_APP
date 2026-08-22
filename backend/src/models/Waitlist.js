import mongoose from "mongoose";

const waitlistSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true
    },
    email: {
      type: String,
      required: [true, "Email is required"],
      unique: true,
      trim: true,
      lowercase: true,
      match: [/\S+@\S+\.\S+/, "Please enter a valid email address"]
    },
    country: {
      type: String,
      trim: true,
      default: ""
    },
    favoriteMovie: {
      type: String,
      trim: true,
      default: ""
    },
    otp: {
      type: String,
      default: null
    },
    otpExpiresAt: {
      type: Date,
      default: null
    },
    isVerified: {
      type: Boolean,
      default: false
    },
    passId: {
      type: String,
      unique: true,
      sparse: true,
      default: null
    },
    queuePosition: {
      type: Number,
      unique: true,
      sparse: true,
      default: null
    }
  },
  { timestamps: true }
);

export default mongoose.model("Waitlist", waitlistSchema);
