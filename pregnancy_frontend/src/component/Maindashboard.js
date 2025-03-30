import React, { useContext, useEffect, useState } from "react";
import { Box, Paper, Typography, Grid, CircularProgress, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import plan1Img from "../assets/Bronzes.png";
import plan2Img from "../assets/Golds.png";
import plan3Img from "../assets/Diamonds.png";
import FetalGrowthChart from "../component/FetalGrowthchart";

const Maindashboard = () => {
    const { firstName, lastName, userEmail, userToken } = useContext(UserContext);
    const [plans, setPlans] = useState([]);
    const [userSubscription, setUserSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchSubscriptionPlans = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/subscription/all");

                if (!response.ok) {
                    throw new Error("Không thể lấy danh sách gói đăng ký");
                }

                const data = await response.json();
                setPlans(data);
            } catch (error) {
                console.error("Error fetching subscription plans:", error);
                setError("Không thể tải thông tin gói đăng ký. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        const fetchUserSubscription = async () => {
            try {
                if (!userEmail || !userToken) {
                    setLoading(false);
                    return;
                }

                const response = await fetch(`http://localhost:5001/api/subscription/user/${userEmail}`, {
                    method: "GET",
                    headers: {
                        "Authorization": `Bearer ${localStorage.getItem("userToken")}`, // Lấy token từ localStorage
                    },
                });

                if (!response.ok) {
                    if (response.status === 404) {
                        console.log("Người dùng chưa đăng ký gói nào");
                        setLoading(false);
                        return;
                    }
                    throw new Error("Không thể lấy thông tin đăng ký");
                }

                const data = await response.json();

                // Kiểm tra dữ liệu trả về từ API
                console.log("API Response data:", data);

                setUserSubscription(data); // Cập nhật dữ liệu

            } catch (error) {
                console.error("Error fetching user subscription:", error);
                setError("Không thể tải thông tin đăng ký. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };

        // Fetch data khi component mount
        fetchSubscriptionPlans();
        fetchUserSubscription();
    }, [userEmail, userToken]);

    // This will log the userSubscription data when it changes
    useEffect(() => {
        console.log("User subscription:", userSubscription);
    }, [userSubscription]); // Khi userSubscription thay đổi, thì console.log sẽ chạy

    const handleSubscribe = (plan) => {
        navigate(`/checkout/${plan.planId}`, { state: { plan } });
    };

    const fullName = firstName && lastName ? `${firstName} ${lastName}`.trim() : "User";

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

            {error && (
                <Typography color="error" sx={{ marginBottom: 2 }}>
                    {error}
                </Typography>
            )}

            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>Biểu đồ tăng trưởng thai nhi</Typography>
                <FetalGrowthChart />
            </Box>

            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>Gói đăng ký của chúng tôi</Typography>

                {loading ? (
                    <Box sx={{ display: "flex", width: "100%", justifyContent: "center", p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <>
                        {userSubscription && userSubscription.isSubscribed ? (
                            <Box>
                                <Typography variant="h6">Gói bạn đã đăng ký: {userSubscription.subscriptionPlan}</Typography>
                                <Typography variant="body1">Ngày đăng ký: {new Date(userSubscription.startDate).toLocaleDateString()}</Typography>
                                <Typography variant="body1">Ngày hết hạn: {new Date(userSubscription.subscriptionExpiry).toLocaleDateString()}</Typography>
                            </Box>
                        ) : (
                            <Typography variant="h6" sx={{ color: "#ff6347" }}>
                                Bạn chưa đăng ký gói nào. Vui lòng chọn gói phù hợp để đăng ký!
                            </Typography>
                        )}

                        <Grid container spacing={3}>
                            {plans.map((plan) => {
                                const isSubscribed = userSubscription?.subscriptionPlan === plan.planId;

                                return (
                                    <Grid item xs={12} md={4} key={plan.planId}>
                                        <Paper
                                            elevation={3}
                                            sx={{
                                                padding: 2,
                                                textAlign: "center",
                                                display: "flex",
                                                flexDirection: "column",
                                                justifyContent: "space-between",
                                                minHeight: "550px",
                                                borderRadius: 2,
                                                transition: "transform 0.2s, box-shadow 0.2s",
                                                "&:hover": {
                                                    transform: "translateY(-5px)",
                                                    boxShadow: 6
                                                },
                                                border: isSubscribed ? "2px solid #F48FB1" : "none"
                                            }}
                                        >
                                            <Box>
                                                <img
                                                    src={planImages[plan.planId] || plan1Img}
                                                    alt={plan.name}
                                                    style={{
                                                        width: "100%",
                                                        height: "auto",
                                                        maxHeight: "250px",
                                                        objectFit: "contain",
                                                        borderRadius: "8px",
                                                        marginBottom: "15px"
                                                    }}
                                                />
                                                <Typography
                                                    variant="h5"
                                                    sx={{
                                                        fontWeight: "bold",
                                                        color: "#F48FB1",
                                                        marginBottom: 1
                                                    }}
                                                >
                                                    {plan.name}
                                                </Typography>

                                                <Typography
                                                    variant="h6"
                                                    sx={{
                                                        marginBottom: 2,
                                                        color: "#333"
                                                    }}
                                                >
                                                    ${plan.price}
                                                </Typography>

                                                <Typography
                                                    variant="body1"
                                                    sx={{
                                                        marginBottom: 2,
                                                        color: "#666",
                                                        minHeight: "80px"
                                                    }}
                                                >
                                                    {plan.description || "Gói đăng ký cao cấp với nhiều tính năng đặc biệt."}
                                                </Typography>

                                                <Typography variant="body2" sx={{ marginBottom: 1, color: "#555" }}>
                                                    Thời hạn: {plan.duration || 30} ngày
                                                </Typography>
                                            </Box>

                                            <Button
                                                variant="contained"
                                                color={isSubscribed ? "secondary" : "primary"}
                                                fullWidth
                                                sx={{
                                                    marginTop: 2,
                                                    opacity: isSubscribed ? 0.8 : 1,
                                                    backgroundColor: isSubscribed ? "#9C27B0" : "#F48FB1",
                                                    "&:hover": {
                                                        backgroundColor: isSubscribed ? "#7B1FA2" : "#F06292",
                                                    }
                                                }}
                                                onClick={() => !isSubscribed && handleSubscribe(plan)}
                                                disabled={isSubscribed}
                                            >
                                                {isSubscribed ? "Đã đăng ký" : `Đăng ký ngay - $${plan.price}`}
                                            </Button>
                                        </Paper>
                                    </Grid>
                                );
                            })}
                        </Grid>
                    </>
                )}
            </Box>
        </Box>
    );
};

export default Maindashboard;
