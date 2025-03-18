const { poolPromise, sql } = require("../config/db");

const getAllSubscriptionPlans = async (req, res) => {
    try {
        const pool = await poolPromise;
        const result = await pool.request().query("SELECT * FROM SubscriptionPlans");
        res.json(result.recordset);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// Đảm bảo export đúng
module.exports = { getAllSubscriptionPlans };
