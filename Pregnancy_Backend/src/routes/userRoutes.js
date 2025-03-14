const express = require("express");
const router = express.Router();
const { sql, poolPromise } = require('../config/db');
const verifyToken = require("../middleware/authMiddleware");
const { registerUser, loginUser } = require("../controllers/userController");

router.post("/register", registerUser);
router.post("/login", loginUser);
router.get("/userinfo", verifyToken, async (req, res) => {
    try {
        const pool = await poolPromise;
        const user = await pool
            .request()
            .input("userId", sql.Int, req.user.userId) // Lấy từ token đã decode
            .query("SELECT email, phone, role FROM Users WHERE userId = @userId");

        if (!user.recordset[0]) return res.status(404).json({ error: "User not found!" });

        res.json(user.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports = router;
