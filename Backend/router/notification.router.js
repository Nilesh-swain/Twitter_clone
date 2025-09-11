import express from "express";
import protectRoute from "../middleware/protectRoute";

import {
  getNotification,
  delectNotification,
  // delectOneNotification,
} from "../controller/notification.controller.js";

import { protectRoute } from "../middleware/protectRoute";

const router = express.Router();

router.get("/", protectRoute, getNotification);
router.delete("/delect", protectRoute, delectNotification);
// router.delete("/delete/:id", protectRoute, delectOneNotification);

export default router;
