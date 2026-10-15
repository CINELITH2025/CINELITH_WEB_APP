import express from "express";
import { recommendFromMovie, searchRecommendCatalog } from "../services/recommend.service.js";

const router = express.Router();

router.get("/movies", (req, res) => {
  try {
    const movies = searchRecommendCatalog(req.query.q, Number(req.query.limit) || 24);
    res.json({ movies });
  } catch (err) {
    console.error("RECOMMEND SEARCH ERROR:", err);
    res.status(503).json({ message: err.message || "Recommendation catalog unavailable" });
  }
});

router.post("/", (req, res) => {
  try {
    const { title, movieId, limit } = req.body || {};
    const result = recommendFromMovie({ title, movieId }, Number(limit) || 10);
    if (!result.movie) {
      return res.status(404).json({ message: result.message, recommendations: [] });
    }
    if (result.message === "Not enough reviews") {
      return res.status(422).json({ message: result.message, movie: result.movie, recommendations: [] });
    }
    res.json(result);
  } catch (err) {
    console.error("RECOMMEND ERROR:", err);
    res.status(503).json({ message: err.message || "Recommendation engine unavailable" });
  }
});

export default router;
