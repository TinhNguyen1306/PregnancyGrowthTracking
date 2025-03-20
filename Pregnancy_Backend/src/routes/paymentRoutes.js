const express = require("express");
const router = express.Router();
const paymentController = require("../controllers/paymentController");

// Route tạo thanh toán
router.post("/checkout", paymentController.createPayment);

// Route xác nhận thanh toán (callback từ cổng thanh toán)
router.post("/confirm", paymentController.confirmPayment);

module.exports = router;