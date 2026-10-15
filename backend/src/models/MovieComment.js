import mongoose from "mongoose";

const movieCommentSchema = new mongoose.Schema(
  {
    movieId: { type: Number, required: true, index: true },
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    userName: { type: String, required: true },
    avatar: { type: String, default: "/images/actor_1.png" },
    text: { type: String, required: true },
    likes: { type: Number, default: 0 }
  },
  { timestamps: true }
);

export default mongoose.model("MovieComment", movieCommentSchema);
