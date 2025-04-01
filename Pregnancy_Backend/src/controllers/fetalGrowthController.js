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
// Thêm một sự phát triển của thai nhi
const addFetalGrowth = async (req, res) => {
    try {
        const { week, weight, length, note } = req.body;
        const motherId = req.user?.userId; // Lấy từ token, chính là userId bên bảng Users

        console.log("🔹 Mother ID từ token:", motherId);
        console.log("🔹 Body request nhận được:", req.body);

        if (!motherId) {
            return res.status(400).json({ message: "Không tìm thấy motherId từ token" });
        }

        if (!week || !weight || !length) {
            return res.status(400).json({ message: "Thiếu dữ liệu bắt buộc (week, weight, length)" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("motherId", sql.Int, motherId)
            .input("week", sql.Int, week)
            .input("weight", sql.Float, weight)
            .input("length", sql.Float, length)
            .input("note", sql.NVarChar, note || null)
            .query(`
                INSERT INTO FetalGrowth (motherId, gestationalAge, weight, length, notes, recordedAt)
                VALUES (@motherId, @week, @weight, @length, @note, GETDATE());
            `);

        console.log("Kết quả INSERT:", result);

        res.status(201).json({ message: "Thêm dữ liệu phát triển thai nhi thành công" });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};

const updateFetalGrowth = async (req, res) => {
    try {
        const { id } = req.params; // ID của bản ghi cần cập nhật
        const { week, weight, length, note } = req.body;
        const motherId = req.user?.userId; // Lấy từ token

        console.log("🔹 Mother ID từ token:", motherId);
        console.log("🔹 Cập nhật ID:", id);
        console.log("🔹 Body request nhận được:", req.body);

        if (!motherId) {
            return res.status(400).json({ message: "Không tìm thấy motherId từ token" });
        }

        if (!id) {
            return res.status(400).json({ message: "Thiếu ID bản ghi để cập nhật" });
        }

        const pool = await poolPromise;
        const result = await pool.request()
            .input("id", sql.Int, id)
            .input("motherId", sql.Int, motherId)
            .input("week", sql.Int, week)
            .input("weight", sql.Float, weight)
            .input("length", sql.Float, length)
            .input("note", sql.NVarChar, note || null)
            .query(`
                UPDATE FetalGrowth
                SET gestationalAge = @week, weight = @weight, length = @length, notes = @note
                WHERE growthId = @id AND motherId = @motherId;
            `);

        console.log("Kết quả UPDATE:", result);

        if (result.rowsAffected[0] === 0) {
            return res.status(404).json({ message: "Không tìm thấy bản ghi hoặc không có quyền cập nhật" });
        }

        res.status(200).json({ message: "Cập nhật thành công" });
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Lỗi server", error: error.message });
    }
};
const getExistingWeeks = async (req, res) => {
    try {
        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({ message: "User not found in token" });
        }

        // Truy vấn các tuần thai đã có của người dùng, chỉ lấy các tuần duy nhất và trong khoảng từ tuần 8 đến tuần 40
        const pool = await poolPromise;
        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .query(`
                SELECT DISTINCT gestationalAge
                FROM FetalGrowth
                WHERE motherId = @userId
                AND gestationalAge BETWEEN 8 AND 40
            `);

        const existingWeeks = result.recordset.map(row => row.gestationalAge);

        res.status(200).json({ existingWeeks });
    } catch (error) {
        console.error("Error getting existing weeks:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};
// Lấy dữ liệu tăng trưởng thai nhi theo tuần
const getFetalGrowthByWeek = async (req, res) => {
    try {
        const { week } = req.params; // Nhận tham số tuần từ URL

        // Kiểm tra xem tuần có hợp lệ hay không
        if (!week || isNaN(week) || week < 8 || week > 40) {
            return res.status(400).json({ message: "Tuần không hợp lệ, vui lòng nhập từ 8 đến 40" });
        }

        const userId = req.user?.userId;

        if (!userId) {
            return res.status(400).json({ message: "User không tìm thấy trong token" });
        }

        // Truy vấn dữ liệu tăng trưởng của thai nhi theo tuần từ cơ sở dữ liệu
        const pool = await poolPromise;
        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .input("week", sql.Int, week)
            .query(`
                SELECT weight, length, recordedAt
                FROM FetalGrowth
                WHERE motherId = @userId AND gestationalAge = @week
                ORDER BY recordedAt DESC
            `);

        // Kiểm tra nếu không có dữ liệu
        if (result.recordset.length === 0) {
            return res.status(404).json({ message: `Không có dữ liệu cho tuần ${week}` });
        }

        res.status(200).json(result.recordset); // Trả về dữ liệu
    } catch (error) {
        console.error("DB Error:", error);
        res.status(500).json({ message: "Internal Server Error", error: error.message });
    }
};

module.exports = { getAllFetalGrowth, getFetalGrowthByMother, addFetalGrowth, updateFetalGrowth, getExistingWeeks, getFetalGrowthByWeek };
