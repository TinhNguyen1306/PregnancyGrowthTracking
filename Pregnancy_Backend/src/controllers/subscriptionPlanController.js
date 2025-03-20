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

// Lấy chi tiết gói đăng ký theo ID
const getSubscriptionPlanById = async (req, res) => {
    try {
        const { planId } = req.params;
        const pool = await poolPromise;

        const result = await pool.request()
            .input("planId", sql.Int, planId) // đồng bộ kiểu chữ
            .query(`SELECT * FROM SubscriptionPlans WHERE planId = @planId`);

        if (result.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy gói đăng ký với ID này"
            });
        }

        res.status(200).json(result.recordset[0]);
    } catch (error) {
        console.error("Error getting subscription plan:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Lấy thông tin đăng ký của người dùng dựa trên email
const getUserSubscriptionByEmail = async (req, res) => {
    try {
        const { email } = req.params;
        const pool = await poolPromise;

        const userResult = await pool.request()
            .input("Email", sql.VarChar(255), email)
            .query(`SELECT userId FROM Users WHERE email = @Email`);

        if (userResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy người dùng với email này"
            });
        }

        const userId = userResult.recordset[0].userId;

        const subscriptionResult = await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`
                SELECT m.subscriptionPlan as planId, m.subscriptionExpiry, m.isSubscribed,
                       sp.name, sp.price, sp.description, sp.duration
                FROM Members m
                LEFT JOIN SubscriptionPlans sp ON m.subscriptionPlan = sp.planId
                WHERE m.userId = @UserId AND m.isSubscribed = 1
                      AND (m.subscriptionExpiry IS NULL OR m.subscriptionExpiry > GETDATE())
            `);

        if (subscriptionResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Người dùng chưa đăng ký gói nào hoặc đăng ký đã hết hạn"
            });
        }

        res.status(200).json(subscriptionResult.recordset); // Trả về tất cả các gói thay vì chỉ 1 cái
    } catch (error) {
        console.error("Error getting user subscription:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// Tạo gói đăng ký mới (chỉ dành cho admin)
const createSubscriptionPlan = async (req, res) => {
    try {
        const { name, price, duration, description, isAvailable } = req.body;

        // Validate input data
        if (!name || !price || !duration) {
            return res.status(400).json({
                success: false,
                message: "Vui lòng cung cấp đầy đủ thông tin: name, price, duration"
            });
        }

        const pool = await poolPromise;

        const result = await pool.request()
            .input("Name", sql.VarChar(255), name)
            .input("Price", sql.Decimal(10, 2), price)
            .input("Duration", sql.Int, duration)
            .input("Description", sql.Text, description || null)
            .input("IsAvailable", sql.Bit, isAvailable === undefined ? 1 : isAvailable)
            .query(`
                INSERT INTO SubscriptionPlans (name, price, duration, description, isAvailable)
                VALUES (@Name, @Price, @Duration, @Description, @IsAvailable);
                
                SELECT SCOPE_IDENTITY() AS planId;
            `);

        res.status(201).json({
            success: true,
            message: "Gói đăng ký đã được tạo thành công",
            planId: result.recordset[0].planId
        });
    } catch (error) {
        console.error("Error creating subscription plan:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};
// Cập nhật gói đăng ký (chỉ dành cho admin)
const updateSubscriptionPlan = async (req, res) => {
    try {
        const { planId } = req.params;
        const { name, price, duration, description, isAvailable } = req.body;

        if (price !== undefined && price < 0) {
            return res.status(400).json({
                success: false,
                message: "Giá tiền không hợp lệ (phải >= 0)"
            });
        }

        if (duration !== undefined && duration <= 0) {
            return res.status(400).json({
                success: false,
                message: "Thời gian gói không hợp lệ (phải lớn hơn 0)"
            });
        }

        const pool = await poolPromise;

        const checkResult = await pool.request()
            .input("PlanId", sql.Int, planId)
            .query(`SELECT COUNT(*) as count FROM SubscriptionPlans WHERE planId = @PlanId`);

        if (checkResult.recordset[0].count === 0) {
            return res.status(404).json({
                success: false,
                message: "Không tìm thấy gói đăng ký để cập nhật"
            });
        }

        let updateQuery = `UPDATE SubscriptionPlans SET `;
        const updateValues = [];

        if (name !== undefined) updateValues.push(`name = @Name`);
        if (price !== undefined) updateValues.push(`price = @Price`);
        if (duration !== undefined) updateValues.push(`duration = @Duration`);
        if (description !== undefined) updateValues.push(`description = @Description`);
        if (isAvailable !== undefined) updateValues.push(`isAvailable = @IsAvailable`);

        if (updateValues.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Không có thông tin nào được cung cấp để cập nhật"
            });
        }

        updateQuery += updateValues.join(', ');
        updateQuery += ` WHERE planId = @PlanId`;

        const updateRequest = pool.request();
        updateRequest.input("PlanId", sql.Int, planId);
        if (name !== undefined) updateRequest.input("Name", sql.VarChar(255), name);
        if (price !== undefined) updateRequest.input("Price", sql.Decimal(10, 2), price);
        if (duration !== undefined) updateRequest.input("Duration", sql.Int, duration);
        if (description !== undefined) updateRequest.input("Description", sql.Text, description);
        if (isAvailable !== undefined) updateRequest.input("IsAvailable", sql.Bit, isAvailable);

        await updateRequest.query(updateQuery);

        res.status(200).json({
            success: true,
            message: "Gói đăng ký đã được cập nhật thành công"
        });
    } catch (error) {
        console.error("Error updating subscription plan:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    getAllSubscriptionPlans,
    getSubscriptionPlanById,
    getUserSubscriptionByEmail,
    createSubscriptionPlan,
    updateSubscriptionPlan
};
