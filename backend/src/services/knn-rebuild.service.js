import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import KnnRating from "../models/KnnRating.js";
import { invalidateRecommendIndex } from "./recommend.service.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const DATA_DIR = path.join(__dirname, "../../data");
const INDEX_PATH = path.join(DATA_DIR, "knn-recommend.json");
const RATINGS_PATH = path.join(DATA_DIR, "knn-ratings.json");
const NEIGHBORS_PER_MOVIE = 15;

let rebuildTimer = null;
let rebuilding = false;

const cosineNeighbors = (ratings, k) => {
  const vectors = new Map();
  const byUser = new Map();

  for (const [userKey, movieId, rating] of ratings) {
    if (!vectors.has(movieId)) vectors.set(movieId, new Map());
    vectors.get(movieId).set(userKey, rating);
    if (!byUser.has(userKey)) byUser.set(userKey, []);
    byUser.get(userKey).push([movieId, rating]);
  }

  const norms = new Map();
  for (const [movieId, users] of vectors) {
    let sum = 0;
    for (const value of users.values()) sum += value * value;
    norms.set(movieId, Math.sqrt(sum) || 1);
  }

  const dots = new Map();
  const addDot = (left, right, score) => {
    if (!dots.has(left)) dots.set(left, new Map());
    dots.get(left).set(right, (dots.get(left).get(right) || 0) + score);
  };

  for (const pairs of byUser.values()) {
    if (pairs.length < 2) continue;
    for (let i = 0; i < pairs.length; i += 1) {
      const [leftId, leftRating] = pairs[i];
      for (let j = i + 1; j < pairs.length; j += 1) {
        const [rightId, rightRating] = pairs[j];
        const score = leftRating * rightRating;
        addDot(leftId, rightId, score);
        addDot(rightId, leftId, score);
      }
    }
  }

  const neighbors = {};
  for (const movieId of vectors.keys()) {
    const ranked = [];
    for (const [otherId, dot] of dots.get(movieId) || []) {
      const cosine = dot / (norms.get(movieId) * norms.get(otherId));
      ranked.push({ movieId: otherId, distance: Number((1 - cosine).toFixed(6)) });
    }
    ranked.sort((a, b) => a.distance - b.distance);
    neighbors[String(movieId)] = ranked.slice(0, k);
  }

  return { neighbors, movieIds: [...vectors.keys()] };
};

export const rebuildKnnIndex = async () => {
  if (!fs.existsSync(INDEX_PATH) || !fs.existsSync(RATINGS_PATH)) {
    console.warn("KNN base files missing; skip live rebuild");
    return null;
  }

  if (rebuilding) return null;
  rebuilding = true;
  try {
    const base = JSON.parse(fs.readFileSync(INDEX_PATH, "utf8"));
    const baseRatings = JSON.parse(fs.readFileSync(RATINGS_PATH, "utf8"));
    const live = await KnnRating.find().lean();

    const ratings = [
      ...baseRatings.map(([userId, movieId, rating]) => [`ml:${userId}`, Number(movieId), Number(rating)]),
      ...live.map((row) => [`cl:${row.userId}`, Number(row.movieId), Number(row.rating)])
    ];

    const { neighbors, movieIds } = cosineNeighbors(ratings, NEIGHBORS_PER_MOVIE);
    const catalogById = new Map((base.movies || []).map((movie) => [Number(movie.movieId), movie]));

    for (const row of live) {
      if (catalogById.has(row.movieId)) continue;
      catalogById.set(row.movieId, {
        movieId: row.movieId,
        tmdbId: null,
        title: row.title,
        year: "",
        overview: "",
        poster: "",
        genres: []
      });
    }

    const movies = movieIds
      .map((movieId) => catalogById.get(movieId))
      .filter(Boolean)
      .sort((a, b) => a.movieId - b.movieId);

    const payload = {
      ...base,
      liveRatingCount: live.length,
      lastBuiltAt: new Date().toISOString(),
      movies,
      neighbors
    };

    fs.writeFileSync(INDEX_PATH, JSON.stringify(payload));
    invalidateRecommendIndex();
    console.log(`KNN index rebuilt with ${live.length} live CINELITH ratings`);
    return payload;
  } finally {
    rebuilding = false;
  }
};

export const scheduleKnnRebuild = () => {
  clearTimeout(rebuildTimer);
  rebuildTimer = setTimeout(() => {
    rebuildKnnIndex().catch((err) => console.error("KNN rebuild failed", err));
  }, 2500);
};
