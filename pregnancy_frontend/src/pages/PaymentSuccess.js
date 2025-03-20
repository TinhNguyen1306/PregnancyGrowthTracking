import React, { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Box, Typography, Paper, Button, CircularProgress } from "@mui/material";
import { CheckCircle } from "@mui/icons-material";

const PaymentSuccessPage = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { planName } = location.state || { planName: "Premium" };

    useEffect(() => {
        // Tự động chuyển hướng về dashboard sau 5 giây
        const timer = setTimeout(() => {
            navigate("/dashboard");
        }, 5000);

        return () => clearTimeout(timer);
    }, [navigate]);

    return (
        <Box sx={{ padding: 3, display: "flex", justifyContent: "center", alignItems: "center", minHeight: "80vh" }}>
            <Paper sx={{ padding: 4, maxWidth: 600, textAlign: "center" }}>
                <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />

                <Typography variant="h4" gutterBottom>
                    Thanh toán thành công!
                </Typography>

                <Typography variant="h6" sx={{ mb: 3 }}>
                    Bạn đã đăng ký thành công gói {planName}
                </Typography>

                <Typography variant="body1" paragraph>
                    Tài khoản của bạn đã được cập nhật và bạn có thể bắt đầu sử dụng các tính năng premium ngay bây giờ.
                </Typography>

                <Typography variant="body2" sx={{ mb: 3, display: "flex", alignItems: "center", justifyContent: "center" }}>
                    <CircularProgress size={20} sx={{ mr: 1 }} />
                    Tự động chuyển về Dashboard trong vài giây...
                </Typography>

                <Button
                    variant="contained"
                    color="primary"
                    onClick={() => navigate("/dashboard")}
                >
                    Quay lại Dashboard ngay
                </Button>
            </Paper>
        </Box>
    );
};

export default PaymentSuccessPage;