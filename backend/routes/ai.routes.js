const express = require("express");

const router = express.Router();

const protect = require("../middleware/auth.middleware");

const {
  generateTaskSummary,
} = require("../controllers/ai.controller");

router.post(
  "/task-summary",
  protect,
  generateTaskSummary
);

module.exports = router;