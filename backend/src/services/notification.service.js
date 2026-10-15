import Notification from "../models/Notification.js";
import User from "../models/User.js";

export const createNotification = async ({ userId, type, title, text }) => {
  if (!userId || !title) return null;
  const notification = await Notification.create({ userId, type, title, text });
  await User.findByIdAndUpdate(userId, { $inc: { unreadCount: 1 } });
  return notification;
};

export const listNotifications = async (userId) => {
  return Notification.find({ userId }).sort({ createdAt: -1 }).limit(50).lean();
};

export const markNotificationRead = async (userId, notificationId) => {
  const notification = await Notification.findOneAndUpdate(
    { _id: notificationId, userId, read: false },
    { read: true },
    { new: true }
  );
  if (notification) {
    await User.findByIdAndUpdate(userId, { $inc: { unreadCount: -1 } });
  }
  return notification;
};
