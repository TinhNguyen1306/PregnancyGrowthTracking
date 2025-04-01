const express = require("express");
const router = express.Router();
const { getAllFetalGrowth, getFetalGrowthByMother, addFetalGrowth, updateFetalGrowth, getExistingWeeks, getFetalGrowthByWeek } = require("../controllers/fetalGrowthController");
const { verifyToken } = require("../middleware/authMiddleware");

router.get("/all", getAllFetalGrowth);
router.get("/motherId", verifyToken, getFetalGrowthByMother);
router.post("/add", verifyToken, addFetalGrowth);
router.put("/update/:id", verifyToken, updateFetalGrowth);
router.get("/checkweeks", verifyToken, getExistingWeeks);
router.get("/week/:week", verifyToken, getFetalGrowthByWeek);

module.exports = router;
