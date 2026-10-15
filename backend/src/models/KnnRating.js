import mongoose from "mongoose";

const knnRatingSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, index: true },
    movieId: { type: Number, required: true, index: true },
    title: { type: String, required: true },
    rating: { type: Number, required: true, min: 0.5, max: 5 },
    source: { type: String, enum: ["like", "rate", "review", "onboarding"], default: "rate" }
  },
  { timestamps: true }
);

knnRatingSchema.index({ userId: 1, movieId: 1 }, { unique: true });

export default mongoose.model("KnnRating", knnRatingSchema);
