const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const { sql, poolPromise } = require('../config/db');
require("dotenv").config();

// Đăng ký
const registerUser = async (req, res) => {
    const { email, password, phone, role } = req.body;
    try {
        console.log("📌 Nhận request:", req.body);

        // Kiểm tra kết nối DB
        const pool = await poolPromise;
        console.log("✅ Đã kết nối DB!");

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thực hiện truy vấn
        const result = await pool
            .request()
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, hashedPassword)
            .input("phone", sql.VarChar, phone)
            .input("role", sql.VarChar, role || "User")
            .query(
                "INSERT INTO Users (email, password, phone, role) VALUES (@email, @password, @phone, @role)"
            );

        console.log("✅ User đăng ký thành công:", result);
        res.status(201).json({ message: "User registered successfully!" });
    } catch (error) {
        console.error("❌ Lỗi khi đăng ký:", error);
        res.status(500).json({ error: error.message });
    }
};


// Đăng nhập
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await poolPromise;
        const user = await pool
            .request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM Users WHERE email = @email");

        if (!user.recordset[0]) return res.status(400).json({ error: "User not found!" });

        const validPassword = await bcrypt.compare(password, user.recordset[0].password);
        if (!validPassword) return res.status(400).json({ error: "Invalid password!" });

        const token = jwt.sign({ userId: user.recordset[0].userId }, process.env.JWT_SECRET, { expiresIn: "1h" });

        res.json({ token, userId: user.recordset[0].userId });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

module.exports = { registerUser, loginUser };
