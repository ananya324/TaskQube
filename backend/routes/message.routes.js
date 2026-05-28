const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const { getWorkspaceMessages, createMessage } = require("../controllers/message.controller");

router.get("/:workspaceId", protect, getWorkspaceMessages);
router.post("/", protect, createMessage);

module.exports = router;