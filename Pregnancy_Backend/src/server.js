const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({ origin: "*" }));
app.use(express.json());

// Routes
app.use("/api/users", require("./routes/userRoutes"));

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
