const express = require("express");
const router = express.Router();
const memberController = require("../controllers/memberController");
const { verifyToken } = require("../middleware/authMiddleware");

// Kiểm tra trạng thái hội viên (có cần đăng ký hội viên không)
router.get("/status", verifyToken, memberController.getMemberStatus);

module.exports = router;