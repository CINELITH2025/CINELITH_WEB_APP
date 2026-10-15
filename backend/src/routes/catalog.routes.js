import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import MovieComment from "../models/MovieComment.js";
import User from "../models/User.js";
import {
  getCatalogFilters,
  getCatalogMovie,
  getHomeCatalog,
  listCatalogMovies
} from "../services/recommend.service.js";
import { attachScores, attachScoresMany } from "../services/rating.service.js";
import { applyStreak, refreshCinephileScore } from "../services/cinephile-score.service.js";

const router = express.Router();

router.get("/home", async (_req, res) => {
  try {
    const home = getHomeCatalog();
    res.json({
      trending: await attachScoresMany(home.trending),
      classics: await attachScoresMany(home.classics)
    });
  } catch (err) {
    res.status(503).json({ message: err.message });
  }
});

router.get("/filters", (_req, res) => {
  try {
    res.json(getCatalogFilters());
  } catch (err) {
    res.status(503).json({ message: err.message });
  }
});

router.get("/movies", async (req, res) => {
  try {
    const result = listCatalogMovies({
      q: req.query.q,
      genre: req.query.genre,
      year: req.query.year,
      sort: req.query.sort,
      limit: req.query.limit,
      offset: req.query.offset
    });
    const movies = await attachScoresMany(result.movies);
    if (req.query.sort === "rating") {
      movies.sort((a, b) => (b.clScore || 0) - (a.clScore || 0));
    }
    res.json({ ...result, movies });
  } catch (err) {
    res.status(503).json({ message: err.message });
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const movie = getCatalogMovie(req.params.id);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    const scored = await attachScores(movie);
    scored.related = await attachScoresMany(movie.related || []);
    res.json(scored);
  } catch (err) {
    res.status(503).json({ message: err.message });
  }
});

router.get("/movies/:id/comments", async (req, res, next) => {
  try {
    const comments = await MovieComment.find({ movieId: Number(req.params.id) })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();
    res.json({
      comments: comments.map((comment) => ({
        id: comment._id,
        user: comment.userName,
        avatar: comment.avatar,
        text: comment.text,
        likes: comment.likes,
        time: comment.createdAt
      }))
    });
  } catch (err) {
    next(err);
  }
});

router.post("/movies/:id/comments", protect, async (req, res, next) => {
  try {
    const text = String(req.body.text || "").trim();
    if (!text) return res.status(400).json({ message: "text required" });
    const author = await User.findById(req.user.id).select("name avatar");
    const comment = await MovieComment.create({
      movieId: Number(req.params.id),
      userId: req.user.id,
      userName: author?.name || "Cinephile",
      avatar: author?.avatar || "/images/actor_1.png",
      text
    });
    const scorer = await User.findById(req.user.id);
    if (scorer) {
      applyStreak(scorer);
      await refreshCinephileScore(scorer).catch(() => null);
    }
    res.status(201).json({
      id: comment._id,
      user: comment.userName,
      avatar: comment.avatar,
      text: comment.text,
      likes: comment.likes,
      time: comment.createdAt
    });
  } catch (err) {
    next(err);
  }
});

export default router;
