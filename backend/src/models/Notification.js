import mongoose from "mongoose";

const notificationSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    type: {
      type: String,
      enum: ["follow", "connect", "friend_request", "message"],
      required: true
    },
    title: { type: String, required: true },
    text: { type: String, required: true },
    read: { type: Boolean, default: false }
  },
  { timestamps: true }
);

export default mongoose.model("Notification", notificationSchema);
