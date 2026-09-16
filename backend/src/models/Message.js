import mongoose from "mongoose";

export const conversationKeyFor = (userA, userB) =>
  [String(userA), String(userB)].sort().join(":");

const messageSchema = new mongoose.Schema(
  {
    conversationKey: {
      type: String,
      required: true,
      index: true
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    receiver: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true
    },
    senderName: {
      type: String,
      required: true
    },
    text: {
      type: String,
      required: true,
      trim: true
    },
    read: {
      type: Boolean,
      default: false
    }
  },
  { timestamps: true }
);

messageSchema.index({ conversationKey: 1, createdAt: 1 });

export const serializeMessage = (msg) => ({
  _id: String(msg._id),
  conversationKey: msg.conversationKey,
  senderId: String(msg.sender),
  receiverId: String(msg.receiver),
  senderName: msg.senderName,
  text: msg.text,
  read: Boolean(msg.read),
  createdAt: msg.createdAt
});

export default mongoose.model("Message", messageSchema);
