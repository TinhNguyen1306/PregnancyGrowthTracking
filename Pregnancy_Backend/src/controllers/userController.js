const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const UserModel = require("../models/user");
const { sql, poolPromise } = require('../config/db');
require("dotenv").config();

// Đăng ký
const registerUser = async (req, res) => {
    const { email, password, phone, role, firstName, lastName, gender } = req.body;

    try {
        console.log("Nhận request:", req.body);

        // Kết nối DB
        const pool = await poolPromise;

        // Kiểm tra email đã tồn tại chưa
        const checkUser = await pool
            .request()
            .input("email", sql.VarChar, email)
            .query("SELECT userId FROM Users WHERE email = @email");

        if (checkUser.recordset.length > 0) {
            return res.status(400).json({ error: "Email đã tồn tại!" });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Thêm vào bảng Users
        const userResult = await pool
            .request()
            .input("email", sql.VarChar, email)
            .input("password", sql.VarChar, hashedPassword)
            .input("phone", sql.VarChar, phone)
            .input("role", sql.VarChar, role || "User")
            .input("isVerified", sql.Bit, 0)
            .input("createdAt", sql.DateTime, new Date())
            .query(`
                INSERT INTO Users (email, password, phone, role, isVerified, createdAt) 
                OUTPUT INSERTED.userId
                VALUES (@email, @password, @phone, @role, @isVerified, @createdAt)
            `);

        const newUserId = userResult.recordset[0].userId; // Lấy userId vừa tạo

        // Thêm vào bảng Members
        await pool
            .request()
            .input("userId", sql.Int, newUserId)
            .input("firstName", sql.VarChar, firstName)
            .input("lastName", sql.VarChar, lastName)
            .input("gender", sql.VarChar, gender)
            .input("subscriptionPlan", sql.Int, null) // Mặc định chưa có gói
            .input("subscriptionExpiry", sql.DateTime, null)
            .input("isSubscribed", sql.Bit, 0)
            .input("createdAt", sql.DateTime, new Date())
            .query(`
                INSERT INTO Members (userId, firstName, lastName, gender, subscriptionPlan, subscriptionExpiry, isSubscribed, createdAt)
                VALUES (@userId, @firstName, @lastName, @gender, @subscriptionPlan, @subscriptionExpiry, @isSubscribed, @createdAt)
            `);

        console.log("User và Member đăng ký thành công!");
        res.status(201).json({ message: "User registered successfully!" });

    } catch (error) {
        console.error("Lỗi khi đăng ký:", error);
        res.status(500).json({ error: error.message });
    }
};


// Đăng nhập
const loginUser = async (req, res) => {
    const { email, password } = req.body;
    try {
        const pool = await poolPromise;

        // Lấy thông tin từ bảng Users
        const userResult = await pool
            .request()
            .input("email", sql.VarChar, email)
            .query("SELECT * FROM Users WHERE email = @email");

        const user = userResult.recordset[0];
        if (!user) return res.status(401).json({ error: "Invalid email or password" });

        // Kiểm tra password
        const validPassword = await bcrypt.compare(password, user.password);
        if (!validPassword) return res.status(401).json({ error: "Invalid email or password" });

        // Lấy thông tin từ bảng Members
        const memberResult = await pool
            .request()
            .input("userId", sql.Int, user.userId)
            .query("SELECT firstName, lastName FROM Members WHERE userId = @userId");

        const member = memberResult.recordset[0] || { firstName: null, lastName: null };

        // Tạo token
        const token = jwt.sign({ userId: user.userId, role: user.role }, process.env.JWT_SECRET, { expiresIn: "1h" });

        // Trả về dữ liệu
        res.json({
            message: "Login successful",
            token,
            user: {
                userId: user.userId,
                email: user.email,
                role: user.role,
                phone: user.phone,
                firstName: member.firstName,
                lastName: member.lastName
            }
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Lấy danh sách tất cả user
const getAllUsers = async (req, res) => {
    try {
        const users = await UserModel.getAllUsers();
        res.status(200).json(users);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy danh sách user" });
    }
};

// Lấy user theo ID
const getUserById = async (req, res) => {
    try {
        const userId = req.params.id;
        const user = await UserModel.getUserById(userId);
        if (!user) {
            return res.status(404).json({ message: "User không tồn tại" });
        }
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({ message: "Lỗi server khi lấy user" });
    }
};
const getUserInfo = async (req, res) => {
    try {
        const pool = await poolPromise;
        const user = await pool
            .request()
            .input("userId", sql.Int, req.user.userId) // Lấy userId từ token
            .query("SELECT email, phone, role FROM Users WHERE userId = @userId");

        if (!user.recordset[0]) {
            return res.status(404).json({ error: "User not found!" });
        }

        res.json(user.recordset[0]);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};
//Update User
const updateUser = async (req, res) => {
    try {
        const { userId } = req.params; // Lấy userId từ URL
        const { email, phone, role, isVerified } = req.body;

        const pool = await poolPromise;
        await pool
            .request()
            .input("userId", sql.Int, userId)
            .input("email", sql.NVarChar, email)
            .input("phone", sql.NVarChar, phone)
            .input("role", sql.NVarChar, role)
            .input("isVerified", sql.Bit, isVerified)
            .query(`
                UPDATE Users 
                SET email = @email, phone = @phone, role = @role, isVerified = @isVerified 
                WHERE userId = @userId
            `);

        res.json({ message: "User updated successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Delete User
const deleteUser = async (req, res) => {
    try {
        const { userId } = req.params; // Lấy userId từ URL

        const pool = await poolPromise;
        await pool
            .request()
            .input("userId", sql.Int, userId)
            .query("DELETE FROM Users WHERE userId = @userId");

        res.json({ message: "User deleted successfully" });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};


module.exports = { registerUser, loginUser, getAllUsers, getUserInfo, updateUser, deleteUser };
