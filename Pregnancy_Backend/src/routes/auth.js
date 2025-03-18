const express = require("express");
const passport = require("passport");
const jwt = require("jsonwebtoken");

const router = express.Router();

// Route để bắt đầu xác thực với Google
router.get(
    "/google",
    passport.authenticate("google", { scope: ["profile", "email"] })
);

// Callback sau khi Google xác thực
router.get(
    "/google/callback",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        // Nếu xác thực thành công, tạo JWT token
        const user = req.user;
        const token = jwt.sign({ id: user.id, email: user.email }, "SECRET_KEY", {
            expiresIn: "7d", // Token hết hạn sau 7 ngày
        });

        // Gửi token và thông tin user về FE
        res.redirect(`http://localhost:3000/login?token=${token}&user=${encodeURIComponent(JSON.stringify(user))}`);
    }
);

// Logout
router.get("/logout", (req, res) => {
    req.logout(err => {
        if (err) return res.status(500).json({ error: "Logout failed" });
        res.json({ message: "Logged out successfully!" });
    });
});

module.exports = router;
