import express from "express";
import axios from "axios";
import { protect } from "../middleware/auth.middleware.js";
import { getTVDBToken } from "../services/tvdb.service.js";

const router = express.Router();

router.get("/:type/:id", protect, async (req, res) => {
  const token = await getTVDBToken();

  const tvdbRes = await axios.get(
    `https://api4.thetvdb.com/v4/${req.params.type}/${req.params.id}`,
    { headers: { Authorization: `Bearer ${token}` } }
  );

  res.json(tvdbRes.data.data);
});

export default router;
