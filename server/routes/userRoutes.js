import express from "express";
import {
  registerUser,
  authUser,
  getUserProfile,
  updateUserProfile,
  updateProfilePicture,
} from "../controllers/userController.js";
import { protect } from "../middleware/authMiddleware.js";
import upload from "../utils/multerConfig.js";

const router = express.Router();
router.put(
  "/profile/upload",
  protect,
  upload.single("image"),
  updateProfilePicture
);

router.post("/register", registerUser);
router.post("/login", authUser);
router.get("/profile", protect, getUserProfile);
router
  .route("/profile")
  .get(protect, getUserProfile)
  .put(protect, updateUserProfile);

export default router;
