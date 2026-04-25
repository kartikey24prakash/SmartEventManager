import { Router } from "express";

import {
  assignCoordinator,
  createEvent,
  deleteEvent,
  getEventById,
  getEvents,
  removeCoordinator,
  updateEvent,
} from "../controllers/eventController.js";
import {
  getEventRegistrations,
  removeRegistrationByManager,
} from "../controllers/registerationController.js";
import { getEventTeams, removeTeamByManager } from "../controllers/teamController.js";
import { getWinners, markWinner } from "../controllers/winnerController.js";
import authMiddleware from "../middleware/authMiddleware.js";
import ensureCoordinatorEventAccess from "../middleware/eventAccessMiddleware.js";
import allowRoles from "../middleware/roleMiddleware.js";

const router = Router();

router.get("/", getEvents);
router.get("/:id", getEventById);

router.post("/", authMiddleware, allowRoles("admin"), createEvent);
router.put("/:id", authMiddleware, allowRoles("admin"), updateEvent);
router.delete("/:id", authMiddleware, allowRoles("admin"), deleteEvent);

router.post("/:eventId/coordinators", authMiddleware, allowRoles("admin"), assignCoordinator);
router.delete(
  "/:eventId/coordinators/:coordinatorId",
  authMiddleware,
  allowRoles("admin"),
  removeCoordinator
);

router.get(
  "/:eventId/registrations",
  authMiddleware,
  allowRoles("admin", "coordinator"),
  ensureCoordinatorEventAccess,
  getEventRegistrations
);

router.get(
  "/:eventId/teams",
  authMiddleware,
  allowRoles("admin", "coordinator"),
  ensureCoordinatorEventAccess,
  getEventTeams
);

router.delete(
  "/:eventId/registrations/:registrationId",
  authMiddleware,
  allowRoles("admin", "coordinator"),
  ensureCoordinatorEventAccess,
  removeRegistrationByManager
);

router.delete(
  "/:eventId/teams/:teamId",
  authMiddleware,
  allowRoles("admin", "coordinator"),
  ensureCoordinatorEventAccess,
  removeTeamByManager
);

router.post(
  "/:eventId/winners",
  authMiddleware,
  allowRoles("admin", "coordinator"),
  ensureCoordinatorEventAccess,
  markWinner
);

router.get(
  "/:eventId/winners",
  authMiddleware,
  allowRoles("admin", "coordinator"),
  ensureCoordinatorEventAccess,
  getWinners
);

export default router;
