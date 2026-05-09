import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tvdbId: {
      type: Number,
      required: true
    },
    title: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ["movie", "series"],
      required: true
    }
  },
  { _id: false }
);

const ratingSchema = new mongoose.Schema(
  {
    tvdbId: Number,
    title: String,
    type: String,
    rating: Number
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true
    },
    email: {
      type: String,
      unique: true,
      required: true
    },
    password: {
      type: String,
      required: true
    },

    friends: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

    favoriteMovies: [movieSchema],

    watchlist: [movieSchema],

    ratings: [ratingSchema]
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
