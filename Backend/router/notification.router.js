import express from "express";
import protectRoute from "../middleware/protectRoute.js"; // ✅ keep only this one

import {
  getNotification,
  deleteNotification,
  deleteOneNotification,
} from "../controller/notification.controller.js";

const router = express.Router();

// Routes
router.get("/", protectRoute, getNotification);
router.delete("/delete", protectRoute, deleteNotification);
router.delete("/delete/:id", protectRoute, deleteOneNotification);

export default router;
