import express from "express";
import protectRoute from "../middleware/protectRoute.js"; // ✅ keep only this one

import {
  getNotification,
  delectNotification,
  delectOneNotification,
} from "../controller/notification.controller.js";

const router = express.Router();

// Routes
router.get("/", protectRoute, getNotification);
router.delete("/delect", protectRoute, delectNotification);
router.delete("/delete/:id", protectRoute, delectOneNotification);

export default router;
