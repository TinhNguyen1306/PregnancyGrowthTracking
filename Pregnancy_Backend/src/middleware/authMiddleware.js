const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyToken = (req, res, next) => {
    const authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).json({ error: "Access Denied! No Token Provided." });

    const token = authHeader.split(" ")[1]; // Lấy token sau "Bearer "
    if (!token) return res.status(401).json({ error: "Invalid Token Format!" });

    try {
        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        req.user = decoded; // Lưu userId vào req để dùng ở API khác
        next();
    } catch (error) {
        res.status(403).json({ error: "Invalid or Expired Token!" });
    }
};

module.exports = verifyToken;
