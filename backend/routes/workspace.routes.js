const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  createWorkspace,
} = require("../controllers/workspace.controller");

router.post("/", protect, createWorkspace);

module.exports = router;