const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  createNote,
  getWorkspaceNotes,
} = require("../controllers/note.controller");

router.post("/", protect, createNote);

router.get("/:workspaceId", protect, getWorkspaceNotes);

module.exports = router;