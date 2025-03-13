import React, { useState, useEffect } from "react";
import { Box, CssBaseline, Typography, Button, Paper, Grid } from "@mui/material";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Maindashboard from "../component/Maindashboard";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
    const navigate = useNavigate();
    const [userEmail, setUserEmail] = useState(null);
    const [isMember, setIsMember] = useState(false);

    useEffect(() => {
        const email = localStorage.getItem("userEmail");
        setUserEmail(email);

        // Giả lập kiểm tra nếu user đã có gói hội viên (tạm thời check từ localStorage)
        const memberStatus = localStorage.getItem("membership");
        setIsMember(memberStatus !== null);
    }, []);

    // Hàm chọn gói hội viên
    const handleMembershipSelection = (plan) => {
        localStorage.setItem("membership", plan);
        setIsMember(true);
        alert(`Bạn đã đăng ký gói ${plan} thành công!`);
    };

    return (
        <Box sx={{ display: "flex", backgroundColor: "#ffe0f0", minHeight: "100vh" }}>
            <CssBaseline />
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
                <Header />
                <Maindashboard />

                {/* Nếu chưa có gói hội viên, hiển thị phần đăng ký */}
                {!isMember && (
                    <Box sx={{ padding: 3 }}>
                        <Paper sx={{ padding: 3, textAlign: "center", backgroundColor: "#fff5fa" }}>
                            <Typography variant="h5" sx={{ fontWeight: "bold", color: "#d81b60" }}>
                                Tham gia Hội Viên Premium để nhận nhiều quyền lợi!
                            </Typography>

                            {/* Nếu chưa đăng nhập, yêu cầu đăng nhập */}
                            {!userEmail ? (
                                <Button
                                    variant="contained"
                                    color="primary"
                                    sx={{ marginTop: 2 }}
                                    onClick={() => navigate("/login")}
                                >
                                    Đăng nhập để đăng ký hội viên
                                </Button>
                            ) : (
                                <>
                                    <Typography variant="body1" sx={{ marginTop: 2 }}>
                                        Chọn gói hội viên phù hợp với bạn:
                                    </Typography>

                                    {/* Danh sách gói hội viên */}
                                    <Grid container spacing={3} sx={{ marginTop: 3 }}>
                                        {/* Gói Cơ bản */}
                                        <Grid item xs={12} sm={4}>
                                            <Paper sx={{ padding: 2, backgroundColor: "#fff", textAlign: "center" }}>
                                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#d32f2f" }}>
                                                    Gói Cơ Bản
                                                </Typography>
                                                <Typography variant="body2" sx={{ marginY: 1 }}>
                                                    Cập nhật chỉ số thai nhi <br />
                                                    Xem biểu đồ phát triển <br />
                                                    Nhắc nhở lịch hẹn với bác sĩ
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="secondary"
                                                    onClick={() => handleMembershipSelection("Cơ bản")}
                                                >
                                                    Chọn Gói
                                                </Button>
                                            </Paper>
                                        </Grid>

                                        {/* Gói Nâng Cao */}
                                        <Grid item xs={12} sm={4}>
                                            <Paper sx={{ padding: 2, backgroundColor: "#fff", textAlign: "center" }}>
                                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#1976d2" }}>
                                                    Gói Nâng Cao
                                                </Typography>
                                                <Typography variant="body2" sx={{ marginY: 1 }}>
                                                    Cảnh báo bất thường về thai kỳ <br />
                                                    Nhắc nhở lịch hẹn với bác sĩ
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="primary"
                                                    onClick={() => handleMembershipSelection("Nâng cao")}
                                                >
                                                    Chọn Gói
                                                </Button>
                                            </Paper>
                                        </Grid>

                                        {/* Gói VIP */}
                                        <Grid item xs={12} sm={4}>
                                            <Paper sx={{ padding: 2, backgroundColor: "#fff", textAlign: "center" }}>
                                                <Typography variant="h6" sx={{ fontWeight: "bold", color: "#ff6f00" }}>
                                                    Gói VIP
                                                </Typography>
                                                <Typography variant="body2" sx={{ marginY: 1 }}>
                                                    Nhắc nhở mốc quan trọng <br />
                                                    Xét nghiệm & tiêm phòng <br />
                                                    Nhắc nhở lịch hẹn với bác sĩ
                                                </Typography>
                                                <Button
                                                    variant="contained"
                                                    color="warning"
                                                    onClick={() => handleMembershipSelection("VIP")}
                                                >
                                                    Chọn Gói
                                                </Button>
                                            </Paper>
                                        </Grid>
                                    </Grid>
                                </>
                            )}
                        </Paper>
                    </Box>
                )}
            </Box>
        </Box>
    );
};

export default Dashboard;
