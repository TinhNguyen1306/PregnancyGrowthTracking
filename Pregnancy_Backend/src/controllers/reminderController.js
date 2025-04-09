const { sql, poolPromise } = require('../config/db');

// Tạo lịch hẹn
const createReminder = async (req, res) => {
    const { title, reminderDate, reminderType } = req.body;
    const userId = req.user.userId;

    if (!title || !reminderDate) {
        return res.status(400).json({ message: "Tiêu đề và ngày nhắc nhở là bắt buộc." });
    }

    try {
        const pool = await poolPromise;
        await pool.request() // 🛠️ thiếu .request()
            .input("userId", sql.Int, userId)
            .input("title", sql.NVarChar(255), title)
            .input("reminderDate", sql.DateTime, new Date(reminderDate))
            .input("reminderType", sql.VarChar(50), reminderType || 'Other')
            .query(`
                INSERT INTO Reminders (userId, title, reminderDate, reminderType)
                VALUES (@userId, @title, @reminderDate, @reminderType)
            `);

        res.status(201).json({ message: "Tạo lịch hẹn thành công." });
    } catch (error) {
        console.error("Lỗi khi tạo lịch hẹn:", error);
        res.status(500).json({ message: "Lỗi khi tạo lịch hẹn." });
    }
};

const getAllReminders = async (req, res) => {
    const userId = req.user.userId;

    try {
        const pool = await poolPromise;
        const result = await pool.request()
            .input("userId", sql.Int, userId)
            .query(`
                SELECT * FROM Reminders
                WHERE userId = @userId
                ORDER BY reminderDate ASC
            `);

        res.status(200).json(result.recordset);
    } catch (error) {
        console.error("Lỗi khi lấy danh sách lịch hẹn:", error);
        res.status(500).json({ message: "Lỗi khi lấy danh sách lịch hẹn." });
    }
};

module.exports = { createReminder, getAllReminders };