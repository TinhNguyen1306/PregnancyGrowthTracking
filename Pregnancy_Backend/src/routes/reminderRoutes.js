const express = require("express");
const router = express.Router();
const { createReminder, getAllReminders } = require("../controllers/reminderController");
const { verifyToken } = require("../middleware/authMiddleware");

// Kiểm tra trạng thái hội viên (có cần đăng ký hội viên không)
router.post("/create", verifyToken, createReminder);
router.get("/all", verifyToken, getAllReminders);
module.exports = router;