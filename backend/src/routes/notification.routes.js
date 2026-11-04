import express from "express";
import { protect } from "../middleware/auth.middleware.js";
import { listNotifications, markNotificationRead } from "../services/notification.service.js";

const router = express.Router();

router.get("/", protect, async (req, res, next) => {
  try {
    const notifications = await listNotifications(req.user.id);
    res.json({ notifications });
  } catch (err) {
    next(err);
  }
});

router.post("/:id/read", protect, async (req, res, next) => {
  try {
    await markNotificationRead(req.user.id, req.params.id);
    res.json({ ok: true });
  } catch (err) {
    next(err);
  }
});

export default router;
