const express = require("express");
const router = express.Router();

const protect = require("../middleware/auth.middleware");
const { createTask,
    getWorkspaceTasks,
    updateTaskStatus,
    deleteTask,} = require("../controllers/task.controller");

router.post("/", protect, createTask);
router.get("/:workspaceId", protect, getWorkspaceTasks);
router.put("/:taskId/status", protect, updateTaskStatus);
router.delete("/:taskId", protect, deleteTask);

module.exports = router;