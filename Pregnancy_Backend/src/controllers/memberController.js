const { sql, poolPromise } = require('../config/db');

// Kiểm tra trạng thái hội viên
const getMemberStatus = async (req, res) => {
    try {
        const userId = req.user.userId || req.user.id; // Lấy userId từ token

        if (!userId) {
            return res.status(400).json({ message: "Không tìm thấy userId!" });
        }

        const pool = await poolPromise;
        const result = await pool
            .request()
            .input("userId", sql.Int, userId)
            .query(`
                SELECT m.isSubscribed, m.subscriptionPlan, m.subscriptionExpiry, s.name AS planName, s.price, s.duration, s.description
                FROM Members m
                LEFT JOIN SubscriptionPlans s ON m.subscriptionPlan = s.planId
                WHERE m.userId = @userId
            `);

        if (result.recordset.length === 0) {
            return res.status(404).json({ message: "Người dùng chưa có hồ sơ hội viên." });
        }

        const member = result.recordset[0];

        res.json({
            isSubscribed: member.isSubscribed || 0, // Nếu null thì mặc định là 0 (chưa đăng ký)
            subscriptionPlan: member.subscriptionPlan || null, // Nếu null thì trả về null
            subscriptionExpiry: member.subscriptionExpiry
                ? new Date(member.subscriptionExpiry).toISOString().split("T")[0]
                : null, // Chuyển sang format YYYY-MM-DD
            planDetails: member.subscriptionPlan
                ? {
                    planName: member.planName,
                    price: member.price,
                    duration: member.duration,
                    description: member.description,
                }
                : null, // Thông tin chi tiết của gói đăng ký nếu có
        });

    } catch (error) {
        console.error("Lỗi khi lấy trạng thái hội viên:", error);
        res.status(500).json({ message: "Lỗi server" });
    }
};

module.exports = { getMemberStatus };
