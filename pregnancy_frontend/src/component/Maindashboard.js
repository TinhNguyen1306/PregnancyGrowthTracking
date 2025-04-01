import React, { useContext, useEffect, useState, useCallback } from "react";
import { Box, Paper, Typography, Grid, CircularProgress, Button, Modal } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import plan1Img from "../assets/Bronzes.png";
import plan2Img from "../assets/Golds.png";
import plan3Img from "../assets/Diamonds.png";
import FetalGrowthChart from "../component/FetalGrowthchart";
import AddFetalGrowth from "../component/Addfetalgrowth";
import UpdateFetalGrowth from "../component/Updatefetalgrowth"; // Import UpdateFetalGrowth

const Maindashboard = () => {
    const { firstName, lastName, userEmail, userToken } = useContext(UserContext);
    const [plans, setPlans] = useState([]);
    const [userSubscription, setUserSubscription] = useState(null);
    const [loading, setLoading] = useState(true);
    const [openAdd, setOpenAdd] = useState(false); // Modal for Add
    const [openUpdate, setOpenUpdate] = useState(false); // Modal for Update
    const [fetalGrowthData, setFetalGrowthData] = useState(null); // Dữ liệu cần cập nhật
    const [refresh, setRefresh] = useState(false);
    const [chartKey, setChartKey] = useState(0);
    const currentSubscription = userSubscription?.[0];
    const navigate = useNavigate();

    const fetchSubscriptionPlans = async () => {
        try {
            console.log(" Fetching subscription plans...");
            const response = await fetch("http://localhost:5001/api/subscription/all");

            if (!response.ok) {
                throw new Error("Không thể lấy danh sách gói đăng ký");
            }

            const data = await response.json();
            console.log("Subscription Plans:", data);
            setPlans(data);
        } catch (error) {
            console.error("Error fetching subscription plans:", error);
            console.error("Không thể tải thông tin gói đăng ký. Vui lòng thử lại sau.");
        }
    };

    // Dùng useCallback để tối ưu hóa việc gọi hàm fetchUserSubscription
    const refreshData = () => {
        setRefresh((prev) => !prev); // Đổi state để trigger re-render
        setChartKey((prevKey) => prevKey + 1); // Cập nhật biểu đồ
    };

    const fetchUserSubscription = useCallback(async (token) => {
        try {
            console.log("Fetching user subscription...");
            const response = await fetch(`http://localhost:5001/api/subscription/user/${userEmail}`, {
                method: "GET",
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (!response.ok) {
                console.error("Lỗi khi lấy subscription:", response.statusText);
                return null;
            }

            const data = await response.json();
            return data;
        } catch (error) {
            console.error("Fetch error:", error);
            return null;
        }
    }, [userEmail]);

    useEffect(() => {
        const storedToken = localStorage.getItem("userToken");

        if (!userEmail || (!userToken && !storedToken)) {
            return;
        }

        const fetchData = async () => {
            setLoading(true);
            try {
                const userSubData = await fetchUserSubscription(userToken || storedToken);
                if (userSubData) {
                    setUserSubscription(userSubData);
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchData();
    }, [userEmail, userToken, refresh, fetchUserSubscription]);

    const handleSubscribe = (plan) => {
        navigate(`/checkout/${plan.planId}`, { state: { plan } });
    };

    useEffect(() => {
        fetchSubscriptionPlans(); // Gọi API lấy danh sách gói đăng ký
    }, []);

    const fullName = firstName && lastName ? `${firstName} ${lastName}`.trim() : "User";

    const planImages = {
        4: plan1Img,
        5: plan2Img,
        6: plan3Img
    };

    const openUpdateModal = (data) => {
        setFetalGrowthData(data);  // Truyền dữ liệu cần sửa vào modal
        setOpenUpdate(true); // Mở modal cập nhật
    };

    const handleNavigate = () => {
        navigate("/showsubscribed"); // Điều hướng đến /showsubscribed
    };

    return (
        <Box sx={{ padding: 3 }}>
            {/* Chào mừng user */}
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Welcome, {fullName}!
            </Typography>

            {/* Hiển thị thông tin gói đã đăng ký ngay dưới phần Welcome */}
            {currentSubscription && currentSubscription.isSubscribed ? (
                <Box sx={{ padding: 2, backgroundColor: "#f9f9f9", borderRadius: 2, marginBottom: 3 }}>
                    <Typography variant="h6" sx={{ fontWeight: "bold", color: "#F48FB1" }}>
                        Gói hội viên đã đăng ký: {currentSubscription.name}
                    </Typography>
                    <Typography variant="body1">
                        Ngày đăng ký:{" "}
                        {(() => {
                            let expiryDate = new Date(currentSubscription.subscriptionExpiry);
                            let startDate = new Date(expiryDate);
                            startDate.setDate(expiryDate.getDate() - currentSubscription.duration);
                            return startDate.toLocaleDateString();
                        })()}
                    </Typography>
                    <Typography variant="body1">
                        Ngày kết thúc: {new Date(currentSubscription.subscriptionExpiry).toLocaleDateString()}
                    </Typography>
                    <Typography variant="body1">
                        Số ngày còn lại:{" "}
                        {Math.max(
                            Math.ceil(
                                (new Date(currentSubscription.subscriptionExpiry) - new Date()) / (1000 * 60 * 60 * 24)
                            ),
                            0
                        )}{" "}
                        ngày
                    </Typography>
                </Box>
            ) : (
                <Typography variant="h6" sx={{ color: "#ff6347", marginBottom: 3 }}>
                    Bạn chưa đăng ký gói nào. Vui lòng chọn gói phù hợp để đăng ký!
                </Typography>
            )}

            <Button variant="contained" sx={{
                background: "linear-gradient(135deg, #FFDEE9 30%, #B5FFFC 100%)",
                color: "black",
                '&:hover': { background: "#C2185B" }
            }} onClick={handleNavigate}>
                Xem các gói bạn đã đang kí
            </Button>

            {/* Biểu đồ tăng trưởng thai nhi */}
            <Box sx={{ marginTop: 3 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Biểu đồ tăng trưởng thai nhi
                </Typography>
                <FetalGrowthChart key={chartKey} />
            </Box>

            <Box sx={{ marginTop: 3, textAlign: "center" }}>
                <Button variant="contained" color="primary" onClick={() => setOpenAdd(true)}>
                    Thêm chỉ số thai nhi
                </Button>
            </Box>

            {/* Button cập nhật chỉ số thai nhi */}
            <Box sx={{ marginTop: 2, textAlign: "center" }}>
                <Button variant="contained" color="secondary" onClick={() => setOpenUpdate(true)}>
                    Cập nhật chỉ số thai nhi
                </Button>
            </Box>

            {/* Popup nhập chỉ số thai nhi */}
            <Modal open={openAdd} onClose={() => setOpenAdd(false)}>
                <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, padding: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>Thêm chỉ số thai nhi</Typography>
                    <AddFetalGrowth onClose={() => setOpenAdd(false)} onSuccess={refreshData} />
                </Paper>
            </Modal>

            {/* Popup cập nhật chỉ số thai nhi */}
            <Modal open={openUpdate} onClose={() => setOpenUpdate(false)}>
                <Paper sx={{ position: "absolute", top: "50%", left: "50%", transform: "translate(-50%, -50%)", width: 400, padding: 3 }}>
                    <Typography variant="h6" sx={{ marginBottom: 2 }}>Cập nhật chỉ số thai nhi</Typography>
                    <UpdateFetalGrowth onClose={() => setOpenUpdate(false)} onSuccess={refreshData} />
                </Paper>
            </Modal>

            {/* Gói đăng ký */}
            <Box sx={{ marginTop: 4 }}>
                <Typography variant="h5" sx={{ marginBottom: 2 }}>
                    Gói đăng ký của chúng tôi
                </Typography>

                {loading ? (
                    <Box sx={{ display: "flex", width: "100%", justifyContent: "center", p: 3 }}>
                        <CircularProgress />
                    </Box>
                ) : (
                    <Grid container spacing={3}>
                        {plans.map((plan) => {
                            const isSubscribed = currentSubscription?.planId === plan.planId;

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
                )}
            </Box>
        </Box>
    );
};

export default Maindashboard;
