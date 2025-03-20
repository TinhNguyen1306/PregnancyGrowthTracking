const express = require("express");
const router = express.Router();
const { getAllFetalGrowth, getFetalGrowthByMother } = require("../controllers/fetalGrowthController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/all", getAllFetalGrowth);
router.get("/motherId", verifyToken, getFetalGrowthByMother);

module.exports = router;
