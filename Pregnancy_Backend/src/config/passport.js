const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { sql, poolPromise } = require("../config/db");
require("dotenv").config();

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
                let user = await pool
                    .request()
                    .input("email", sql.VarChar, email)
                    .query("SELECT * FROM Users WHERE email = @email");

                if (!user.recordset[0]) {
                    // Nếu chưa có, tạo user mới
                    const result = await pool
                        .request()
                        .input("email", sql.VarChar, email)
                        .input("password", sql.VarChar, null) // Google không dùng password
                        .input("phone", sql.VarChar, null)
                        .input("role", sql.VarChar, "User")
                        .query(
                            "INSERT INTO Users (email, password, phone, role) VALUES (@email, @password, @phone, @role)"
                        );

                    user = await pool
                        .request()
                        .input("email", sql.VarChar, email)
                        .query("SELECT * FROM Users WHERE email = @email");
                }

                return done(null, user.recordset[0]);
            } catch (error) {
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
        const user = await pool
            .request()
            .input("userId", sql.Int, id)
            .query("SELECT * FROM Users WHERE userId = @userId");

        done(null, user.recordset[0]);
    } catch (error) {
        done(error, null);
    }
});

module.exports = passport;
