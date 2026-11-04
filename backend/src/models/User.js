import mongoose from "mongoose";

const movieSchema = new mongoose.Schema(
  {
    tvdbId: { type: Number, required: true },
    title: { type: String, required: true },
    type: { type: String, enum: ["movie", "series"], required: true }
  },
  { _id: false }
);

const actorSchema = new mongoose.Schema(
  {
    tvdbId: Number,
    name: String
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

const reviewSchema = new mongoose.Schema(
  {
    tvdbId: Number,
    title: String,
    type: String,
    content: String,
    rating: Number,
    createdAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const recentlyViewedSchema = new mongoose.Schema(
  {
    tvdbId: Number,
    title: String,
    type: String,
    viewedAt: { type: Date, default: Date.now }
  },
  { _id: false }
);

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: true },
    description: String,
    movies: [movieSchema],
    createdAt: { type: Date, default: Date.now }
  },
  { timestamps: true }
);

const notificationPreferencesSchema = new mongoose.Schema(
  {
    friendRequests: { type: Boolean, default: true },
    messages: { type: Boolean, default: true },
    recommendations: { type: Boolean, default: true },
    streakReminders: { type: Boolean, default: true }
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    // Basic Information
    name: { type: String, required: true },
    username: { type: String, unique: true, sparse: true, default: null },
    password: { type: String, required: true },
    avatar: { type: String, default: null },
    bio: { type: String, default: "" },
    location: { type: String, default: "" },

    // Onboarding Preferences
    topGenres: { type: [String], default: [] },
    topMovies: { type: [movieSchema], default: [] },
    topActors: { type: [actorSchema], default: [] },
    preferredLanguages: { type: [String], default: [] },
    preferredPlatforms: { type: [String], default: [] },
    onboardingCompleted: { type: Boolean, default: false },

    // Social
    friends: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    followers: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    following: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
    pendingRequests: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

    // Activity
    favoriteMovies: { type: [movieSchema], default: [] },
    watchlist: { type: [movieSchema], default: [] },
    ratings: { type: [ratingSchema], default: [] },
    reviews: { type: [reviewSchema], default: [] },
    recentlyViewed: { type: [recentlyViewedSchema], default: [] },
    collections: { type: [collectionSchema], default: [] },

    // Analytics
    cinephileScore: { type: Number, default: 0, min: 0, max: 10 },
    cinephileBreakdown: {
      type: new mongoose.Schema(
        {
          wa: { type: Number, default: 0 },
          eg: { type: Number, default: 0 },
          ac: { type: Number, default: 0 },
          rq: { type: Number, default: 0 },
          dv: { type: Number, default: 0 },
          ct: { type: Number, default: 0 },
          cr: { type: Number, default: 0 }
        },
        { _id: false }
      ),
      default: () => ({ wa: 0, eg: 0, ac: 0, rq: 0, dv: 0, ct: 0, cr: 0 })
    },
    cinephileLevel: { type: String, default: "Newcomer" },
    cinephileScoreUpdatedAt: { type: Date, default: null },
    lastActiveAt: { type: Date, default: null },
    streak: { type: Number, default: 0 },
    quizzesPlayed: { type: Number, default: 0 },
    quizzesWon: { type: Number, default: 0 },
    battlesPlayed: { type: Number, default: 0 },
    battlesWon: { type: Number, default: 0 },
    moviesWatched: { type: Number, default: 0 },
    hoursWatched: { type: Number, default: 0 },

    // Recommendation
    tasteVector: { type: [Number], default: [] },
    recommendationVersion: { type: Number, default: 0 },
    lastRecommendationUpdate: { type: Date, default: null },

    // Notifications
    unreadCount: { type: Number, default: 0 },
    notificationPreferences: {
      type: notificationPreferencesSchema,
      default: () => ({})
    }
  },
  { timestamps: true }
);

export default mongoose.model("User", userSchema);
