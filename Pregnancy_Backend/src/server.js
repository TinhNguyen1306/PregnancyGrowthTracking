const express = require("express");
const cors = require("cors");
const passport = require("passport");
require("./config/passport");
const session = require("express-session");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5001;

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

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
