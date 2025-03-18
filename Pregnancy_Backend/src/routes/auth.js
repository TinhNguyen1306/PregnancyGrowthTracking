const express = require("express");
const passport = require("passport");

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
        res.json({ message: "Google login successful!", user: req.user });
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
