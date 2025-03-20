const { sql, poolPromise } = require("../config/db");

class User {
    // Lấy tất cả người dùng
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

    // Lấy thông tin user theo ID
    static async getUserById(userId) {
        try {
            const pool = await poolPromise;
            const result = await pool.request()
                .input("userId", sql.Int, userId)
                .query("SELECT * FROM Users WHERE userId = @userId");

            if (result.recordset.length === 0) {
                return null; // Trả về null nếu không tìm thấy user
            }

            return result.recordset[0];
        } catch (error) {
            console.error("Lỗi khi lấy user:", error);
            throw error;
        }
    }
}

module.exports = User;