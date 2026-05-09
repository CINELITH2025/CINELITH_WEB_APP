import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";
import { tvdbSearch } from "../services/tvdb.service.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const q = req.query.q;

    const [movies, people] = await Promise.all([
      tvdbSearch(q),
      User.find({ name: { $regex: q, $options: "i" } }).select("name")
    ]);

    res.json({
      movies_series: movies || [],
      people
    });
  } catch (err) {
    next(err);
  }
});

export default router;
