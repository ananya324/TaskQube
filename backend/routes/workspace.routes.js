const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");
const {
  validateWorkspace,
} = require("../validators/workspace.validator");

const {
  createWorkspace, getUserWorkspaces, joinWorkspace,getWorkspaceById
} = require("../controllers/workspace.controller");

router.post(
  "/",
  protect,
  validateWorkspace,
  createWorkspace
);
router.get("/", protect, getUserWorkspaces);
router.post("/join", protect, joinWorkspace);
router.get("/:id", protect, getWorkspaceById);

module.exports = router;