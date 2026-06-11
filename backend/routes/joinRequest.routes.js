const express = require("express");
const router = express.Router();
const protect = require("../middleware/auth.middleware");
const {
  requestToJoin,
  getPendingRequests,
  acceptRequest,
  rejectRequest,
} = require("../controllers/joinRequest.controller");

router.post("/request", protect, requestToJoin);
router.get("/:workspaceId/requests", protect, getPendingRequests);
router.put("/:requestId/accept", protect, acceptRequest);
router.put("/:requestId/reject", protect, rejectRequest);

module.exports = router;