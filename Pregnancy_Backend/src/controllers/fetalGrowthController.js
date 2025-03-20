const { poolPromise, sql } = require("../config/db");

// Lấy tất cả dữ liệu tăng trưởng thai nhi
const getAllFetalGrowth = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query(`
            SELECT * FROM FetalGrowth
            ORDER BY recordedAt DESC
        `);
        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("DB Error:", error); // Log lỗi chi tiết hơn
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

const getFetalGrowthByMother = async (req, res) => {
    try {
        console.log("req.user:", req.user); // Kiểm tra userId có đúng không

        // Kiểm tra cả userId và id, vì không biết token lưu trường nào
        const userId = req.user && (req.user.userId || req.user.id);

        if (!userId) {
            return res.status(400).json({ message: "Missing userId in token" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .query(`
                SELECT gestationalAge, weight, length, recordedAt
                FROM FetalGrowth
                WHERE motherId = @userId
                ORDER BY recordedAt DESC
            `);

        console.log("Query Result:", result.recordset); // Kiểm tra dữ liệu trả về từ SQL

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { getAllFetalGrowth, getFetalGrowthByMother };