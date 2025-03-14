const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('../models/user'); // Import model User

passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: "/auth/google/callback"
},
    async (accessToken, refreshToken, profile, done) => {
        try {
            // Tìm user trong database dựa trên Google ID
            let user = await User.findOne({ googleId: profile.id });

            if (user) {
                // Nếu user đã tồn tại, trả về user đó
                return done(null, user);
            } else {
                // Nếu user chưa tồn tại, tạo user mới
                const newUser = new User({
                    googleId: profile.id,
                    email: profile.emails[0].value,
                    name: profile.displayName,
                    // Thêm các thông tin khác từ profile nếu cần
                });

                await newUser.save();
                return done(null, newUser);
            }
        } catch (err) {
            return done(err);
        }
    }
));

passport.serializeUser((user, done) => {
    done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id);
        done(null, user);
    } catch (err) {
        done(err);
    }
});