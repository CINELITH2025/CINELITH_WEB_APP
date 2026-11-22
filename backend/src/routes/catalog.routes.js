import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import MovieComment from "../models/MovieComment.js";
import User from "../models/User.js";
import {
  findCatalogMovie,
  knnIdForTvdb,
  relatedForTvdb
} from "../services/recommend.service.js";
import { resolvePoster } from "../services/poster.service.js";
import {
  getTvdbHomeCatalog,
  getTvdbMovieDetails,
  listTvdbMovies,
  tvdbCatalogFilters
} from "../services/tvdb.service.js";
import { attachScores, attachScoresMany } from "../services/rating.service.js";
import { applyStreak, refreshCinephileScore } from "../services/cinephile-score.service.js";

const router = express.Router();

const withKnnScores = async (movies) => {
  const mapped = (movies || []).map((movie) => ({
    ...movie,
    movieId: knnIdForTvdb(movie.tvdbId) || movie.movieId || movie.tvdbId
  }));
  return attachScoresMany(mapped);
};

router.get("/home", async (_req, res) => {
  try {
    const home = await getTvdbHomeCatalog();
    res.json({
      trending: await withKnnScores(home.trending),
      classics: await withKnnScores(home.classics)
    });
  } catch (err) {
    res.status(503).json({ message: err.message || "TVDB catalog unavailable" });
  }
});

router.get("/filters", async (_req, res) => {
  try {
    res.json(await tvdbCatalogFilters());
  } catch (err) {
    res.status(503).json({ message: err.message || "TVDB catalog unavailable" });
  }
});

router.get("/poster/:id", async (req, res) => {
  try {
    const result = await resolvePoster(req.params.id);
    res.set("Cache-Control", "public, max-age=86400");
    if (result.type === "url") {
      return res.redirect(result.value);
    }
    res.type("image/svg+xml").send(result.value);
  } catch (err) {
    res.status(404).type("image/svg+xml").send(
      `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 400 600"><rect width="400" height="600" fill="#08060d"/></svg>`
    );
  }
});

router.get("/movies", async (req, res) => {
  try {
    const result = await listTvdbMovies({
      q: req.query.q,
      genre: req.query.genre,
      year: req.query.year,
      sort: req.query.sort,
      limit: req.query.limit,
      offset: req.query.offset
    });
    const movies = await withKnnScores(result.movies);
    if (req.query.sort === "rating") {
      movies.sort((a, b) => (b.clScore || 0) - (a.clScore || 0));
    }
    res.json({ ...result, movies });
  } catch (err) {
    res.status(503).json({ message: err.message || "TVDB catalog unavailable" });
  }
});

router.get("/movies/:id", async (req, res) => {
  try {
    const byTvdb = findCatalogMovie({ tvdbId: req.params.id });
    const byMl = findCatalogMovie({ movieId: req.params.id });
    const local = byTvdb || byMl;
    const tvdbId = byTvdb ? req.params.id : local?.tvdbId || req.params.id;
    const movie = await getTvdbMovieDetails(tvdbId);
    if (!movie) return res.status(404).json({ message: "Movie not found" });
    const knnMovieId = knnIdForTvdb(movie.tvdbId) || local?.movieId;
    const scored = await attachScores({ ...movie, movieId: knnMovieId || movie.tvdbId });
    scored.related = await withKnnScores(relatedForTvdb(movie.tvdbId));
    res.json(scored);
  } catch (err) {
    res.status(503).json({ message: err.message || "TVDB catalog unavailable" });
  }
});

const serializeComment = (comment) => ({
  id: String(comment._id),
  user: comment.userName,
  userId: comment.userId ? String(comment.userId) : null,
  avatar: comment.avatar,
  text: comment.text,
  likes: comment.likes || 0,
  likedBy: (comment.likedBy || []).map(String),
  time: comment.createdAt,
  parentId: comment.parentId ? String(comment.parentId) : null,
  replies: []
});

const nestComments = (rows) => {
  const items = rows.map(serializeComment);
  const replies = new Map();
  for (const item of items) {
    if (!item.parentId) continue;
    if (!replies.has(item.parentId)) replies.set(item.parentId, []);
    replies.get(item.parentId).push(item);
  }
  return items
    .filter((item) => !item.parentId)
    .map((item) => ({
      ...item,
      replies: (replies.get(item.id) || []).sort(
        (a, b) => new Date(a.time) - new Date(b.time)
      )
    }));
};

router.get("/movies/:id/comments", async (req, res, next) => {
  try {
    if (mongoose.connection.readyState !== 1) {
      return res.json({ comments: [] });
    }
    const comments = await MovieComment.find({ movieId: Number(req.params.id) })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();
    res.json({ comments: nestComments(comments) });
  } catch (err) {
    res.json({ comments: [] });
  }
});

router.post("/movies/:id/comments", protect, async (req, res, next) => {
  try {
    const text = String(req.body.text || "").trim();
    const parentId = req.body.parentId || null;
    if (!text) return res.status(400).json({ message: "text required" });
    if (parentId) {
      const parent = await MovieComment.findById(parentId);
      if (!parent || Number(parent.movieId) !== Number(req.params.id)) {
        return res.status(404).json({ message: "Parent review not found" });
      }
    }
    const author = await User.findById(req.user.id).select("name avatar");
    const comment = await MovieComment.create({
      movieId: Number(req.params.id),
      userId: req.user.id,
      userName: author?.name || "Cinephile",
      avatar: author?.avatar || "/images/actor_1.png",
      text,
      parentId
    });
    const scorer = await User.findById(req.user.id);
    if (scorer) {
      applyStreak(scorer);
      await refreshCinephileScore(scorer).catch(() => null);
    }
    res.status(201).json(serializeComment(comment));
  } catch (err) {
    next(err);
  }
});

router.post("/movies/:id/comments/:commentId/like", protect, async (req, res, next) => {
  try {
    const comment = await MovieComment.findOne({
      _id: req.params.commentId,
      movieId: Number(req.params.id)
    });
    if (!comment) return res.status(404).json({ message: "Review not found" });

    const userId = String(req.user.id);
    const liked = comment.likedBy.some((id) => String(id) === userId);
    if (liked) {
      comment.likedBy = comment.likedBy.filter((id) => String(id) !== userId);
      comment.likes = Math.max(0, (comment.likes || 0) - 1);
    } else {
      comment.likedBy.push(req.user.id);
      comment.likes = (comment.likes || 0) + 1;
    }
    await comment.save();
    res.json(serializeComment(comment));
  } catch (err) {
    next(err);
  }
});

export default router;
