import KnnRating from "../models/KnnRating.js";
import { findCatalogMovie } from "./recommend.service.js";
import { scheduleKnnRebuild } from "./knn-rebuild.service.js";
import { invalidateLiveRatings } from "./rating.service.js";

const toMovieLensScale = (value) => {
  const numeric = Number(value);
  if (!Number.isFinite(numeric)) return 5;
  if (numeric > 5) return Math.max(0.5, Math.min(5, numeric / 2));
  return Math.max(0.5, Math.min(5, numeric));
};

const resolveMovie = (title, movieId) => {
  if (movieId != null) {
    const existing = findCatalogMovie({ movieId });
    if (existing) return existing;
  }
  if (title) {
    const existing = findCatalogMovie({ title });
    if (existing) return existing;
  }
  const normalized = String(title || "Untitled").trim();
  let hash = 0;
  for (let i = 0; i < normalized.length; i += 1) {
    hash = (hash * 31 + normalized.toLowerCase().charCodeAt(i)) >>> 0;
  }
  return {
    movieId: 2_000_000 + (hash % 799_999),
    title: normalized
  };
};

export const recordUserRating = async ({ userId, title, movieId, rating = 5, source = "rate" }) => {
  if (!userId || !title) return null;

  const movie = resolveMovie(title, movieId);
  await KnnRating.findOneAndUpdate(
    { userId, movieId: movie.movieId },
    {
      userId,
      movieId: movie.movieId,
      title: movie.title || title,
      rating: toMovieLensScale(rating),
      source
    },
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  invalidateLiveRatings();
  scheduleKnnRebuild();
  return movie;
};

export const removeLikeRating = async ({ userId, title, movieId }) => {
  if (!userId || !title) return null;
  const movie = resolveMovie(title, movieId);
  const existing = await KnnRating.findOne({ userId, movieId: movie.movieId });
  if (existing?.source !== "like") return existing;
  await KnnRating.deleteOne({ _id: existing._id });
  invalidateLiveRatings();
  scheduleKnnRebuild();
  return movie;
};
