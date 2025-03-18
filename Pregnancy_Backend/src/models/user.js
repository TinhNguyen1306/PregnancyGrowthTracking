const { sql, poolPromise } = require("../config/db");

class user {
    // Get all users
    static async getAllUsers() {
        try {
            const pool = await poolPromise;
            const result = await pool.request().query("SELECT * FROM Users");
            return result.recordset;
        } catch (error) {
            console.error("Lỗi khi lấy danh sách user:", error);
            throw error;
        }
    }

    // Get user by ID
    static async getUserById(userId) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("userId", sql.Int, userId)
                .query("SELECT * FROM Users WHERE userId = @userId");
            return result.recordset[0]; // Trả về 1 user
        } catch (error) {
            console.error("Lỗi khi lấy user:", error);
            throw error;
        }
    }
}

module.exports = user;
