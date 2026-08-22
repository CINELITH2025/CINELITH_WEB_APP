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
      default: undefined
    },
    queuePosition: {
      type: Number,
      default: undefined
    }
  },
  { timestamps: true }
);

const WaitlistModel = mongoose.model("Waitlist", waitlistSchema);

// Automatically drop broken null-key indexes if they exist from previous schema migrations
WaitlistModel.collection.dropIndex("passId_1").catch(() => {});
WaitlistModel.collection.dropIndex("queuePosition_1").catch(() => {});

export default WaitlistModel;
