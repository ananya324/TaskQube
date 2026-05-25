const express = require("express");
const router = express.Router();
const {createReminder} = require("../controllers/reminder.controller");
const protect = require("../middleware/auth.middleware");

router.post("/",protect,createReminder);

module.exports = router;
