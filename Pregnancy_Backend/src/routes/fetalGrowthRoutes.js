const express = require("express");
const router = express.Router();
const { getAllFetalGrowth, getFetalGrowthByMother, addFetalGrowth, updateFetalGrowth } = require("../controllers/fetalGrowthController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/all", getAllFetalGrowth);
router.get("/motherId", verifyToken, getFetalGrowthByMother);
router.post("/add", verifyToken, addFetalGrowth);
router.post("/update/:id", verifyToken, updateFetalGrowth);

module.exports = router;
