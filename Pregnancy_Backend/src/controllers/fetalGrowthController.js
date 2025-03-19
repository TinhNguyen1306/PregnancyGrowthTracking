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
        const { userId } = req.user; // Dùng userId từ token

        if (!userId) {
            return res.status(400).json({ message: "Missing userId" });
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

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};


module.exports = { getAllFetalGrowth, getFetalGrowthByMother };
