import { Router } from "express";

import {
  getAdminEventsReport,
  getEventAnalytics,
  getOverviewAnalytics,
} from "../controllers/analyticsController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ensureCoordinatorEventAccess from "../middleware/eventAccessMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/overview", authMiddleware, allowRoles("admin"), getOverviewAnalytics);
router.get("/events", authMiddleware, allowRoles("admin"), getAdminEventsReport);
router.get(
  "/events/:eventId",
  authMiddleware,
  allowRoles("admin", "coordinator"),
  ensureCoordinatorEventAccess,
  getEventAnalytics
);

export default router;
