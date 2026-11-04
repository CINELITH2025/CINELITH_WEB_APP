import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import mongoose from "mongoose";
import KnnRating from "../models/KnnRating.js";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const RATINGS_PATH = path.join(__dirname, "../../data/knn-ratings.json");

/** IMDb-style prior: pull sparse titles toward the global mean. */
const MIN_VOTES = 25;

let baseByMovie = null;
let globalMean = 3.5;
let liveCache = { at: 0, map: new Map() };

const loadBaseStats = () => {
  if (baseByMovie) return baseByMovie;
  baseByMovie = new Map();
  if (!fs.existsSync(RATINGS_PATH)) return baseByMovie;

  const rows = JSON.parse(fs.readFileSync(RATINGS_PATH, "utf8"));
  let totalSum = 0;
  let totalCount = 0;
  for (const [, movieId, rating] of rows) {
    const id = Number(movieId);
    const value = Number(rating);
    if (!baseByMovie.has(id)) baseByMovie.set(id, { sum: 0, n: 0 });
    const entry = baseByMovie.get(id);
    entry.sum += value;
    entry.n += 1;
    totalSum += value;
    totalCount += 1;
  }
  if (totalCount) globalMean = totalSum / totalCount;
  return baseByMovie;
};

const loadLiveStats = async () => {
  if (mongoose.connection.readyState !== 1) return liveCache.map;
  if (Date.now() - liveCache.at < 4000) return liveCache.map;

  const rows = await KnnRating.aggregate([
    { $group: { _id: "$movieId", sum: { $sum: "$rating" }, n: { $sum: 1 } } }
  ]);
  const map = new Map();
  for (const row of rows) {
    map.set(Number(row._id), { sum: row.sum, n: row.n });
  }
  liveCache = { at: Date.now(), map };
  return map;
};

export const invalidateLiveRatings = () => {
  liveCache = { at: 0, map: new Map() };
};

/**
 * CL Score: Bayesian weighted rating on a 0–100 scale.
 * User Score: unweighted mean of all votes on a 0–100 scale.
 * Ratings in storage are MovieLens 0.5–5; display multiplies by 20.
 */
export const scoreMovie = (movieId, liveMap = new Map()) => {
  loadBaseStats();
  const id = Number(movieId);
  const base = baseByMovie.get(id) || { sum: 0, n: 0 };
  const live = liveMap.get(id) || { sum: 0, n: 0 };
  const v = base.n + live.n;
  if (!v) {
    return { clScore: null, userScore: null, voteCount: 0, liveVoteCount: 0, average: null };
  }

  const R = (base.sum + live.sum) / v;
  const m = MIN_VOTES;
  const C = globalMean;
  const weighted = (v / (v + m)) * R + (m / (v + m)) * C;

  return {
    clScore: Math.round(weighted * 20),
    userScore: Math.round(R * 20),
    voteCount: v,
    liveVoteCount: live.n,
    average: Number((R * 2).toFixed(1))
  };
};

export const scoreMovies = async (movieIds = []) => {
  const liveMap = await loadLiveStats();
  const scores = {};
  for (const movieId of movieIds) {
    scores[movieId] = scoreMovie(movieId, liveMap);
  }
  return scores;
};

export const attachScores = async (movie) => {
  if (!movie) return movie;
  const id = Number(movie.id || movie.movieId);
  const table = await scoreMovies([id]);
  const scores = table[id] || {};
  return { ...movie, ...scores, rating: scores.average || 0 };
};

export const attachScoresMany = async (movies = []) => {
  const ids = movies.map((movie) => Number(movie.id || movie.movieId)).filter(Boolean);
  const table = await scoreMovies(ids);
  return movies.map((movie) => {
    const scores = table[Number(movie.id || movie.movieId)] || {};
    return { ...movie, ...scores, rating: scores.average || 0 };
  });
};
