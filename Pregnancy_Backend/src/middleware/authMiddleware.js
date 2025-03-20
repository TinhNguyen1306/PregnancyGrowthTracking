const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/user");

if (!process.env.JWT_SECRET) {
    console.error("JWT_SECRET is missing in .env file!");
    process.exit(1);
}
const verifyToken = (req, res, next) => {
    const authHeader = req.header("Authorization");
    if (!authHeader) {
        return res.status(401).json({ error: "Access Denied! No Authorization header" });
    }
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.slice(7)
        : authHeader;
    try {
        console.log("Token received:", token);

        const verified = jwt.verify(token, process.env.JWT_SECRET);
        console.log("Decoded token:", verified);
        if (!verified || typeof verified !== 'object') {
            return res.status(403).json({ error: "Invalid Token Structure!" });
        }
        req.user = verified;

        console.log("req.user sau khi xác thực:", req.user);

        next();
    } catch (error) {
        console.error("Token verification error:", error.message);

        if (error.name === 'JsonWebTokenError') {
            return res.status(403).json({ error: "Invalid Token!" });
        } else if (error.name === 'TokenExpiredError') {
            return res.status(401).json({ error: "Token Expired!" });
        } else {
            return res.status(403).json({ error: "Invalid Token Payload!" });
        }
    }
};
const verifyAdmin = async (req, res, next) => {
    const userId = req.user && (req.user.userId || req.user.id);

    if (!req.user || !userId) {
        return res.status(403).json({ error: "Access Denied! No User Information." });
    }
    try {
        const user = await User.getUserById(userId);
        if (!user) {
            return res.status(404).json({ error: "User Not Found!" });
        }
        if (user.role !== "admin") {
            return res.status(403).json({ error: "Access Denied! Admins only." });
        }
        next();
    } catch (error) {
        console.error("Admin Check Error:", error.message);
        return res.status(500).json({ error: "Server Error!" });
    }
};
module.exports = { verifyToken, verifyAdmin };