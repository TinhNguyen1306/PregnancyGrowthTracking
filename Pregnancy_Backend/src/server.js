const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./config/passport");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;
app.use((req, res, next) => {
    res.setHeader("Cross-Origin-Opener-Policy", "same-origin-allow-popups");
    next();
});

app.use(cors({ origin: "*" }));
app.use(express.json());
app.use(
    session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false,
    })
);
app.use(passport.initialize());
app.use(passport.session());
// Routes
app.use("/api/users", require("./routes/userRoutes"));
app.use("/auth", require("./routes/auth"));
app.use("/api/subscription", require("./routes/subscriptionRoutes"));
app.use("/api/fetalgrowth", require("./routes/fetalGrowthRoutes"));
app.use("/api/payments", require("./routes/paymentRoutes"));
app.use("/api/members", require("./routes/memberRoutes"));
app.use("/api/reminders", require("./routes/reminderRoutes"));
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
