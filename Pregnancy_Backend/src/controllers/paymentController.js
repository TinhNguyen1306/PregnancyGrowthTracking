const { sql, poolPromise } = require('../config/db');

// API tạo thanh toán
const createPayment = async (req, res) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        // Lấy dữ liệu từ request
        const { userId, planId, paymentMethod, paymentStatus } = req.body;

        console.log("DEBUG - Input data:", { userId, planId, paymentMethod, paymentStatus });

        // Kiểm tra xem user có tồn tại trong bảng Members không
        const memberResult = await pool.request()
            .input("UserId", sql.Int, userId)
            .query(`SELECT * FROM Members WHERE userId = @UserId`);

        console.log("DEBUG - Member check:", memberResult.recordset);

        if (memberResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "User không tồn tại trong bảng Members!"
            });
        }

        const memberId = memberResult.recordset[0].memberId;
        console.log("DEBUG - Found memberId:", memberId);

        // Kiểm tra plan có tồn tại không
        const planResult = await pool.request()
            .input("PlanId", sql.Int, planId)
            .query(`SELECT * FROM SubscriptionPlans WHERE planId = @PlanId`);

        console.log("DEBUG - Plan check:", planResult.recordset);

        if (planResult.recordset.length === 0) {
            return res.status(404).json({
                success: false,
                message: "Subscription plan không tồn tại!"
            });
        }

        const plan = planResult.recordset[0];

        // Bắt đầu transaction
        await transaction.begin();

        // Bước 1: Thêm vào bảng Payments
        // CHÚ Ý: Ở đây dùng memberId cho trường userId của Payments
        const insertResult = await new sql.Request(transaction)
            .input("MemberId", sql.Int, memberId)  // Đây là memberId, không phải userId
            .input("PlanId", sql.Int, planId)
            .input("PaymentMethod", sql.NVarChar(50), paymentMethod)
            .input("PaymentStatus", sql.NVarChar(50), paymentStatus)
            .query(`
                INSERT INTO Payments (memberId, planId, paymentMethod, paymentStatus) 
                VALUES (@MemberId, @PlanId, @PaymentMethod, @PaymentStatus);
                
                SELECT SCOPE_IDENTITY() AS paymentId;
            `);

        const paymentId = insertResult.recordset[0].paymentId;
        console.log("DEBUG - Inserted payment with ID:", paymentId);

        // Bước 2: Nếu thanh toán thành công, cập nhật bảng Members
        if (paymentStatus === "Completed") {
            // Tính ngày hết hạn
            const subscriptionExpiry = new Date();
            subscriptionExpiry.setDate(subscriptionExpiry.getDate() + plan.duration);

            console.log("DEBUG - Calculated expiry:", subscriptionExpiry);

            // Cập nhật bảng Members
            const updateResult = await new sql.Request(transaction)
                .input("UserId", sql.Int, userId)
                .input("SubscriptionPlan", sql.Int, planId)
                .input("SubscriptionExpiry", sql.DateTime, subscriptionExpiry)
                .query(`
                    UPDATE Members 
                    SET subscriptionPlan = @SubscriptionPlan, 
                        subscriptionExpiry = @SubscriptionExpiry, 
                        isSubscribed = 1
                    WHERE userId = @UserId;
                    
                    SELECT @@ROWCOUNT AS rowsUpdated;
                `);

            console.log("DEBUG - Member update result:", updateResult.recordset[0]);

            if (updateResult.recordset[0].rowsUpdated === 0) {
                throw new Error("Không thể cập nhật thông tin thành viên!");
            }
        }

        // Commit transaction nếu mọi thứ OK
        await transaction.commit();

        // Trả về kết quả thành công
        res.status(201).json({
            success: true,
            message: "Thanh toán đã được xử lý thành công!",
            data: {
                paymentId,
                planName: plan.name,
                amount: plan.price,
                status: paymentStatus
            }
        });

    } catch (error) {
        // Rollback transaction nếu có lỗi
        if (transaction._acquiredConnection) {
            try {
                await transaction.rollback();
                console.log("Transaction rolled back due to error");
            } catch (rollbackError) {
                console.error("Error rolling back transaction:", rollbackError);
            }
        }

        console.error("Error in createPayment:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

// API xác nhận thanh toán
const confirmPayment = async (req, res) => {
    const pool = await poolPromise;
    const transaction = new sql.Transaction(pool);

    try {
        // Lấy dữ liệu từ request
        const { paymentId, transactionId, status } = req.body;

        console.log("DEBUG - Confirm payment data:", { paymentId, transactionId, status });

        // Bắt đầu transaction
        await transaction.begin();

        // Bước 1: Cập nhật thông tin thanh toán
        const updatePaymentResult = await new sql.Request(transaction)
            .input("PaymentId", sql.Int, paymentId)
            .input("TransactionId", sql.NVarChar(255), transactionId)
            .input("Status", sql.NVarChar(50), status)
            .query(`
                UPDATE Payments
                SET paymentStatus = @Status, transactionId = @TransactionId
                WHERE paymentId = @PaymentId;
                
                SELECT @@ROWCOUNT AS rowsUpdated;
            `);

        console.log("DEBUG - Payment update result:", updatePaymentResult.recordset[0]);

        if (updatePaymentResult.recordset[0].rowsUpdated === 0) {
            throw new Error("Không tìm thấy thanh toán hoặc đã được cập nhật!");
        }

        // Bước 2: Lấy thông tin chi tiết về thanh toán và gói dịch vụ
        const paymentInfoResult = await new sql.Request(transaction)
            .input("PaymentId", sql.Int, paymentId)
            .query(`
                SELECT p.*, sp.duration, m.userId 
                FROM Payments p
                JOIN SubscriptionPlans sp ON p.planId = sp.planId
                JOIN Members m ON p.memberId = m.memberId
                WHERE p.paymentId = @PaymentId
            `);

        console.log("DEBUG - Payment info:", paymentInfoResult.recordset);

        if (paymentInfoResult.recordset.length === 0) {
            throw new Error("Không tìm thấy thông tin thanh toán đầy đủ!");
        }

        const paymentInfo = paymentInfoResult.recordset[0];

        // Bước 3: Nếu thanh toán thành công, cập nhật bảng Members
        if (status === "Completed") {
            // Tính ngày hết hạn
            const subscriptionExpiry = new Date();
            subscriptionExpiry.setDate(subscriptionExpiry.getDate() + paymentInfo.duration);

            console.log("DEBUG - Calculated expiry:", subscriptionExpiry);

            // XỬ LÝ TRƯỜNG HỢP userId LÀ MẢNG
            let actualUserId;

            if (Array.isArray(paymentInfo.userId)) {
                console.log("DEBUG - userId is an array, using first element:", paymentInfo.userId[0]);
                actualUserId = paymentInfo.userId[0];  // Lấy phần tử đầu tiên của mảng
            } else {
                actualUserId = paymentInfo.userId;
            }

            console.log("DEBUG - Using userId:", actualUserId);

            // Cập nhật bảng Members
            const updateMemberResult = await new sql.Request(transaction)
                .input("UserId", sql.Int, actualUserId)  // Sử dụng actualUserId đã xử lý
                .input("SubscriptionPlan", sql.Int, paymentInfo.planId)
                .input("SubscriptionExpiry", sql.DateTime, subscriptionExpiry)
                .query(`
                    UPDATE Members 
                    SET subscriptionPlan = @SubscriptionPlan, 
                        subscriptionExpiry = @SubscriptionExpiry, 
                        isSubscribed = 1
                    WHERE userId = @UserId;
                    
                    SELECT @@ROWCOUNT AS rowsUpdated;
                `);

            console.log("DEBUG - Member update result:", updateMemberResult.recordset[0]);

            if (updateMemberResult.recordset[0].rowsUpdated === 0) {
                throw new Error("Không thể cập nhật thông tin thành viên!");
            }
        }

        // Commit transaction nếu mọi thứ OK
        await transaction.commit();

        // Trả về kết quả thành công
        res.status(200).json({
            success: true,
            message: "Thanh toán đã được xác nhận thành công!",
            data: {
                paymentId,
                transactionId,
                status
            }
        });

    } catch (error) {
        // Rollback transaction nếu có lỗi
        if (transaction._acquiredConnection) {
            try {
                await transaction.rollback();
                console.log("Transaction rolled back due to error");
            } catch (rollbackError) {
                console.error("Error rolling back transaction:", rollbackError);
            }
        }

        console.error("Error in confirmPayment:", error);
        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = { createPayment, confirmPayment };