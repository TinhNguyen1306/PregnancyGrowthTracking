const express = require("express");
const router = express.Router();
const { verifyToken, verifyAdmin } = require("../middleware/authMiddleware");
const { getAllSubscriptionPlans, getSubscriptionPlanById, getUserSubscriptionByEmail, createSubscriptionPlan, updateSubscriptionPlan } = require("../controllers/subscriptionPlanController");

router.get("/all", getAllSubscriptionPlans);
router.get("/:planId", getSubscriptionPlanById);
router.get("/user/:email", getUserSubscriptionByEmail);
router.post("/", verifyToken, verifyAdmin, createSubscriptionPlan);
router.put("/:planId", verifyToken, verifyAdmin, updateSubscriptionPlan);

module.exports = router;