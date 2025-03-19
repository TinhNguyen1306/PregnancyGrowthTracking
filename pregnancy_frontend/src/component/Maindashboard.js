import React, { useContext, useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext"; // Import UserContext
import plan1Img from "../assets/Bronzes.png";
import plan2Img from "../assets/Golds.png";
import plan3Img from "../assets/Diamonds.png";
import FetalGrowthChart from "../component/FetalGrowthchart";


const Maindashboard = () => {
    const { firstName, lastName } = useContext(UserContext); // Lấy toàn bộ user object từ context
    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscriptionPlans = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/subscription/all"); // Gọi API lấy danh sách gói hội viên
                const data = await response.json();
                setPlans(data);
            } catch (error) {
                console.error("Error fetching subscription plans:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptionPlans();
    }, []);

    const handleSubscribe = (planId) => {
        navigate(`/checkout/${planId}`); // Chuyển hướng đến trang thanh toán
    };

    const fullName = firstName && lastName ? `${firstName} ${lastName}`.trim() : "User";

    // Map hình ảnh cục bộ theo ID của gói
    const planImages = {
        4: plan1Img,
        5: plan2Img,
        6: plan3Img
    };

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Welcome, {fullName}!
            </Typography>
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h5">Biểu đồ tăng trưởng thai nhi</Typography>
                <FetalGrowthChart />
            </Box>

            <Grid container spacing={3} sx={{ marginTop: 2 }}>
                {loading ? (
                    <CircularProgress />
                ) : (
                    plans.map((plan, index) => (
                        <Grid item xs={12} md={4} key={plan.planId || index}>
                            <Paper sx={{
                                padding: 2,
                                textAlign: "center",
                                backgroundColor: "transparent",
                                boxShadow: "none",
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "space-between",
                                minHeight: "550px" // Điều chỉnh theo kích thước mong muốn
                            }}>
                                <img
                                    src={planImages[plan.planId] || plan1Img}
                                    alt={plan.name}
                                    style={{
                                        width: "100%",
                                        height: "auto",
                                        objectFit: "contain",
                                        backgroundColor: "white",  // Đổi từ "transparent" thành "white"
                                        borderRadius: "8px",  // Bo góc cho đẹp
                                        padding: "5px"  // Thêm khoảng trống để nhìn dễ chịu hơn
                                    }}
                                />
                                <Typography variant="h6" sx={{ marginTop: 1 }}>{plan.name}</Typography>
                                <Typography variant="body2" sx={{ marginY: 1 }}>{plan.description}</Typography>
                                <Button
                                    variant="contained"
                                    color="primary"
                                    fullWidth
                                    sx={{ marginTop: 1 }}
                                    onClick={() => handleSubscribe(plan.planId)}
                                >
                                    Subscribe - ${plan.price}
                                </Button>
                            </Paper>
                        </Grid>
                    ))
                )}
            </Grid>
        </Box>
    );
};

export default Maindashboard;
