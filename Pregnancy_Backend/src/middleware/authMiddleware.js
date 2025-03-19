const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).json({ error: "Access Denied! No Token Provided." });
    }

    // Kiểm tra format "Bearer <token>"
    const parts = authHeader.split(" ");
    if (parts.length !== 2 || parts[0] !== "Bearer") {
        return res.status(401).json({ error: "Invalid Token Format!" });
    }

    const token = parts[1];

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);

        console.log("Decoded Token:", decoded); // Debug xem token có `motherId` không

        req.user = decoded; // Lưu thông tin user vào request
        next();
    } catch (error) {
        console.error("JWT Error:", error.message); // Log lỗi JWT để debug
        return res.status(403).json({ error: "Invalid or Expired Token!" });
    }
};

module.exports = verifyToken;
