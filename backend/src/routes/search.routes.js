import express from "express";
import User from "../models/User.js";
import { protect } from "../middleware/auth.middleware.js";
import { tvdbSearch } from "../services/tvdb.service.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const q = (req.query.q || "").trim();
    const excludeId = req.user.id;

    const peopleQuery = q
      ? {
          _id: { $ne: excludeId },
          $or: [
            { name: { $regex: q, $options: "i" } },
            { username: { $regex: q, $options: "i" } },
            { email: { $regex: q, $options: "i" } }
          ]
        }
      : { _id: { $ne: excludeId } };

    const peopleSelect =
      "name username avatar bio location topGenres topActors topMovies favoriteMovies";

    const [movies, people] = await Promise.all([
      q ? tvdbSearch(q) : Promise.resolve([]),
      User.find(peopleQuery).select(peopleSelect).limit(24).lean()
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
