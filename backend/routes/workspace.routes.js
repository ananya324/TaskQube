const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const {
  validateWorkspace,
} = require("../validators/workspace.validator");

const {
  createWorkspace,
  getUserWorkspaces,
  joinWorkspace,
  getWorkspaceById,
  getWorkspaceActivities,
  removeMember,
  exitSpace,
} = require("../controllers/workspace.controller");
const { route } = require("./task.routes");


router.post(
  "/",
  protect,
  validateWorkspace,
  createWorkspace
);
router.get("/", protect, getUserWorkspaces);
router.post("/join", protect, joinWorkspace);
router.get("/:id", protect, getWorkspaceById);
router.get("/:id/activities", protect, getWorkspaceActivities);
router.delete("/:workspaceId/members/:memberId", protect, removeMember);
router.delete("/:workspaceId/leave", protect, exitSpace);


module.exports = router;