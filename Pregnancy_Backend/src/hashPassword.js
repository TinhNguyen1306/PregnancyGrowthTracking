const bcrypt = require("bcryptjs");
const { poolPromise, sql } = require("../src/config/db");

const hashPasswords = async () => {
    try {
        const pool = await poolPromise;

        // Lấy danh sách user có password chưa mã hóa (tùy theo logic của mày, ở đây giả sử password chưa hash thì nó ngắn hơn 60 ký tự)
        const result = await pool.request().query(`
            SELECT userId, password FROM Users WHERE LEN(password) < 60
        `);

        if (result.recordset.length === 0) {
            console.log("Không có user nào cần mã hóa password.");
            return;
        }

        for (let user of result.recordset) {
            const hashedPassword = await bcrypt.hash(user.password, 10);

            await pool.request()
                .input("userId", sql.Int, user.userId)
                .input("hashedPassword", sql.NVarChar, hashedPassword)
                .query(`
                    UPDATE Users SET password = @hashedPassword WHERE userId = @userId
                `);

            console.log(`Đã mã hóa password cho userId: ${user.userId}`);
        }

        console.log("Hoàn thành cập nhật password!");
    } catch (error) {
        console.error("Lỗi khi hash password:", error);
    }
};

hashPasswords();