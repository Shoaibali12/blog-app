import express from "express";
import { protect } from "../middleware/authMiddleware.js";
import Notification from "../models/Notification.js";

const router = express.Router();

// ✅ Fetch Notifications
router.get("/", protect, async (req, res) => {
  const notifications = await Notification.find({ user: req.user._id })
    .populate("fromUser", "name email")
    .sort({ createdAt: -1 });

  res.json(notifications);
});

// ✅ Mark Single Notification as Read
router.put("/:id/read", protect, async (req, res) => {
  await Notification.findByIdAndUpdate(req.params.id, { isRead: true });
  res.json({ message: "Notification marked as read" });
});

// ✅ Mark All Notifications as Read
router.put("/read-all", protect, async (req, res) => {
  await Notification.updateMany({ user: req.user._id }, { isRead: true });
  res.json({ message: "All notifications marked as read" });
});

export default router;
