const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const {
  createNote,
  getWorkspaceNotes,
  updateNote,
  deleteNote,
} = require("../controllers/note.controller");

router.post("/", protect, createNote);
router.get("/:workspaceId", protect, getWorkspaceNotes);
router.put("/:noteId", protect, updateNote);
router.delete("/:noteId", protect, deleteNote);

module.exports = router;