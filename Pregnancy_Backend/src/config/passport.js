const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { sql, poolPromise } = require("../config/db");
require("dotenv").config();

// Kiểm tra nếu thiếu biến môi trường quan trọng
if (!process.env.GOOGLE_CLIENT_ID || !process.env.GOOGLE_CLIENT_SECRET || !process.env.GOOGLE_CALLBACK_URL) {
    console.error("Thiếu GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET hoặc GOOGLE_CALLBACK_URL trong .env");
    process.exit(1);
}

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: process.env.GOOGLE_CALLBACK_URL,
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                const pool = await poolPromise;
                const email = profile.emails[0].value;

                // Kiểm tra user có tồn tại không
                let result = await pool
                    .request()
                    .input("email", sql.VarChar, email)
                    .query("SELECT * FROM Users WHERE email = @email");

                let user = result.recordset[0];

                if (!user) {
                    // Nếu chưa có, tạo user mới
                    await pool
                        .request()
                        .input("email", sql.VarChar, email)
                        .input("password", sql.VarChar, null) // Google không dùng password
                        .input("phone", sql.VarChar, null)
                        .input("role", sql.VarChar, "User")
                        .query(
                            "INSERT INTO Users (email, password, phone, role) VALUES (@email, @password, @phone, @role)"
                        );

                    // Truy vấn lại để lấy user mới
                    result = await pool
                        .request()
                        .input("email", sql.VarChar, email)
                        .query("SELECT * FROM Users WHERE email = @email");

                    user = result.recordset[0];
                }

                return done(null, user);
            } catch (error) {
                console.error("🔥 Lỗi khi xác thực Google OAuth:", error);
                return done(error, null);
            }
        }
    )
);

// Serialize user để lưu vào session
passport.serializeUser((user, done) => {
    done(null, user.userId);
});

// Deserialize user để lấy thông tin từ session
passport.deserializeUser(async (id, done) => {
    try {
        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("userId", sql.Int, id)
            .query("SELECT * FROM Users WHERE userId = @userId");

        done(null, result.recordset[0]);
    } catch (error) {
        console.error("🔥 Lỗi khi deserialize user:", error);
        done(error, null);
    }
});

module.exports = passport;
