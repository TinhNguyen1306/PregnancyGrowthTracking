const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const User = require('../models/User'); // Import model User

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.GOOGLE_CLIENT_ID,
            clientSecret: process.env.GOOGLE_CLIENT_SECRET,
            callbackURL: "/auth/google/callback",
        },
        async (accessToken, refreshToken, profile, done) => {
            try {
                let user = await findOrCreateUser(profile);
                return done(null, user);
            } catch (error) {
                return done(error, null);
            }
        }
    )
);

passport.serializeUser((user, done) => {
    done(null, user.id); // Serialize user.id
});

passport.deserializeUser(async (id, done) => {
    try {
        const user = await User.findById(id); // Find user by ID
        done(null, user);
    } catch (error) {
        done(error, null);
    }
});

async function findOrCreateUser(profile) {
    try {
        // Kiểm tra user trong database bằng googleId
        let user = await User.findOne({ googleId: profile.id });

        if (!user) {
            // Nếu chưa có thì tạo mới
            user = await User.create({
                googleId: profile.id,
                name: profile.displayName,
                email: profile.emails[0].value,
                avatar: profile.photos && profile.photos.length > 0 ? profile.photos[0].value : null,
            });
            console.log('Created new user:', user);
        }
        return user;
    } catch (error) {
        console.error("Error finding or creating user", error);
        throw error;
    }
}