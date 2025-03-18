const express = require("express");
const router = express.Router();
const { getAllSubscriptionPlans } = require("../controllers/subscriptionPlanController");

// Không cần "/subscription-plans/all" vì nó đã được định nghĩa ở server.js
router.get("/all", getAllSubscriptionPlans);

module.exports = router;