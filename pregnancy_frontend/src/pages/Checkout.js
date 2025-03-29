import React, { useState, useContext, useEffect } from "react";
import { useParams, useNavigate, useLocation } from "react-router-dom";
import {
    Box,
    Typography,
    Paper,
    Grid,
    TextField,
    Button,
    FormControl,
    FormControlLabel,
    Radio,
    RadioGroup,
    Divider,
    Alert,
    CircularProgress,
    Container
} from "@mui/material";
import { UserContext } from "../context/userContext";
import { ArrowBack, CheckCircle, CreditCard, Payment } from "@mui/icons-material";

const Checkout = () => {
    const { planId } = useParams();
    const location = useLocation();
    const [plan, setPlan] = useState(location.state?.plan);
    const [loadingPlan, setLoadingPlan] = useState(!location.state?.plan);

    const { userId, userEmail, firstName, lastName, loading, updateSubscriptionInfo } = useContext(UserContext);
    const navigate = useNavigate();

    // Fetch plan details if not available from state
    useEffect(() => {
        const fetchPlanDetails = async () => {
            if (plan) return; // If we already have the plan from state, skip

            try {
                const response = await fetch(`http://localhost:5001/api/subscription/${planId}`);

                if (!response.ok) {
                    if (response.status === 404) {
                        console.log("Plan not found or API not implemented yet");
                        // Use a default plan object if API fails (404)
                        const defaultPlans = {
                            "4": {
                                planId: 4,
                                name: "Gói Bronze",
                                price: 49,
                                description: "Gói cơ bản với các tính năng theo dõi thai kỳ",
                                duration: 30
                            },
                            "5": {
                                planId: 5,
                                name: "Gói Gold",
                                price: 99,
                                description: "Gói nâng cao với thêm nhiều tính năng đặc biệt",
                                duration: 30
                            },
                            "6": {
                                planId: 6,
                                name: "Gói Diamond",
                                price: 149,
                                description: "Gói cao cấp nhất với đầy đủ tính năng và hỗ trợ 24/7",
                                duration: 30
                            }
                        };

                        if (defaultPlans[planId]) {
                            setPlan(defaultPlans[planId]);
                            setLoadingPlan(false);
                            return;
                        }

                        // If we don't have a default plan for this ID, redirect to dashboard
                        navigate("/dashboard");
                        return;
                    }

                    // Handle other errors
                    navigate("/dashboard");
                    return;
                }

                const planData = await response.json();
                setPlan(planData);
            } catch (error) {
                console.error("Error fetching plan details:", error);
                navigate("/dashboard");
            } finally {
                setLoadingPlan(false);
            }
        };

        if (!plan && planId) {
            fetchPlanDetails();
        }
    }, [plan, planId, navigate]);

    // Check if user is authenticated
    useEffect(() => {
        console.log("User ID:", userId, "Loading:", loading);
        if (!userId && !loading) {
            navigate("/login", {
                state: {
                    returnUrl: `/checkout/${planId}`,
                    message: "Vui lòng đăng nhập để tiếp tục thanh toán"
                }
            });
        }
    }, [userId, loading, navigate, planId]);

    const [paymentMethod, setPaymentMethod] = useState("Credit Card");
    const [processing, setProcessing] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);

    // Payment information
    const [cardNumber, setCardNumber] = useState("");
    const [cardName, setCardName] = useState("");
    const [expiryDate, setExpiryDate] = useState("");
    const [cvv, setCvv] = useState("");

    const handlePaymentMethodChange = (event) => {
        setPaymentMethod(event.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setProcessing(true);
        setError(null);

        try {
            // Validate form fields
            if (paymentMethod === "Credit Card") {
                if (!cardNumber || !cardName || !expiryDate || !cvv) {
                    throw new Error("Vui lòng điền đầy đủ thông tin thẻ");
                }

                // Simple validation
                if (cardNumber.length < 16) {
                    throw new Error("Số thẻ không hợp lệ");
                }

                if (cvv.length < 3) {
                    throw new Error("Mã CVV không hợp lệ");
                }
            }

            // Check if user is logged in
            if (!userId) {
                throw new Error("Vui lòng đăng nhập để tiếp tục thanh toán");
            }

            // Make payment request
            const paymentResponse = await fetch("http://localhost:5001/api/payments/checkout", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${localStorage.getItem("token")}` // Add token if required
                },
                body: JSON.stringify({
                    userId: userId,
                    planId: parseInt(planId),
                    paymentMethod: paymentMethod,
                    paymentStatus: "Pending" // Initial status, will be updated to Completed
                })
            });

            if (!paymentResponse.ok) {
                const errorData = await paymentResponse.json();

                if (paymentResponse.status === 401) {
                    // Authentication error
                    localStorage.removeItem("token");
                    navigate("/login", {
                        state: {
                            returnUrl: `/checkout/${planId}`,
                            message: "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại để tiếp tục thanh toán"
                        }
                    });
                    return;
                } else if (paymentResponse.status === 400 && errorData.code === "duplicate_subscription") {
                    // User already has this subscription
                    setError("Bạn đã đăng ký gói này. Vui lòng kiểm tra lại trong trang Dashboard.");
                    setProcessing(false);
                    return;
                }

                throw new Error(errorData.message || "Không thể xử lý thanh toán");
            }

            const paymentData = await paymentResponse.json();

            // Simulate payment gateway processing
            // In reality, user would be redirected to actual payment gateway

            // Simulate successful payment after 2 seconds
            setTimeout(async () => {
                try {
                    // Confirm payment
                    const confirmResponse = await fetch("http://localhost:5001/api/payments/confirm", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        },
                        body: JSON.stringify({
                            paymentId: paymentData.data.paymentId,
                            transactionId: `TRANS_${Date.now()}`, // Generate sample transaction ID
                            status: "Completed"
                        })
                    });

                    if (!confirmResponse.ok) {
                        const errorData = await confirmResponse.json();
                        throw new Error(errorData.message || "Không thể xác nhận thanh toán");
                    }

                    const confirmData = await confirmResponse.json();

                    // Update subscription info in context if available
                    if (confirmData.subscription) {
                        updateSubscriptionInfo(confirmData.subscription);
                    }

                    setSuccess(true);

                    // After 3 seconds, redirect back to dashboard
                    setTimeout(() => {
                        navigate("/dashboard");
                    }, 3000);

                } catch (error) {
                    console.error("Error confirming payment:", error);
                    setError(error.message || "Lỗi khi xác nhận thanh toán");
                } finally {
                    setProcessing(false);
                }
            }, 2000);

        } catch (error) {
            console.error("Error processing payment:", error);
            setError(error.message || "Lỗi khi xử lý thanh toán");
            setProcessing(false);
        }
    };

    // Show loading state while fetching plan details
    if (loadingPlan) {
        return (
            <Container maxWidth="md">
                <Box sx={{ padding: 3, textAlign: "center", marginTop: 5 }}>
                    <CircularProgress />
                    <Typography variant="h6" sx={{ mt: 2 }}>Đang tải thông tin gói đăng ký...</Typography>
                </Box>
            </Container>
        );
    }

    // If no plan is found after loading, redirect to dashboard
    if (!plan) {
        navigate("/dashboard");
        return null;
    }

    if (success) {
        return (
            <Container maxWidth="md">
                <Box sx={{ padding: 3, textAlign: "center", marginTop: 5 }}>
                    <Paper sx={{ padding: 4, maxWidth: 600, margin: "0 auto" }}>
                        <CheckCircle sx={{ fontSize: 80, color: "success.main", mb: 2 }} />
                        <Typography variant="h4" gutterBottom>Thanh toán thành công!</Typography>
                        <Typography variant="h6" gutterBottom sx={{ color: "#F48FB1" }}>
                            Cảm ơn bạn đã đăng ký {plan.name}
                        </Typography>
                        <Typography variant="body1" paragraph>
                            Bạn đã đăng ký thành công gói {plan.name}. Tài khoản của bạn đã được nâng cấp
                            và bạn có thể bắt đầu sử dụng các tính năng đặc biệt ngay bây giờ.
                        </Typography>
                        <Typography variant="body2" sx={{ mb: 3 }}>
                            Bạn sẽ được chuyển về trang Dashboard trong vài giây...
                        </Typography>
                        <Button
                            variant="contained"
                            onClick={() => navigate("/dashboard")}
                            sx={{
                                backgroundColor: "#F48FB1",
                                "&:hover": {
                                    backgroundColor: "#F06292",
                                }
                            }}
                        >
                            Quay lại Dashboard
                        </Button>
                    </Paper>
                </Box>
            </Container>
        );
    }

    return (
        <Container maxWidth="lg">
            <Box sx={{ padding: 3 }}>
                <Button
                    startIcon={<ArrowBack />}
                    onClick={() => navigate("/dashboard")}
                    sx={{ mb: 3 }}
                >
                    Quay lại
                </Button>

                <Typography variant="h4" gutterBottom sx={{ color: "#F48FB1", fontWeight: "bold" }}>
                    Thanh toán gói đăng ký
                </Typography>

                <Grid container spacing={3}>
                    {/* Plan information */}
                    <Grid item xs={12} md={5}>
                        <Paper sx={{ padding: 3, height: "100%" }} elevation={3}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin đơn hàng
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            <Typography variant="subtitle1" fontWeight="bold" color="#F48FB1">
                                {plan.name}
                            </Typography>

                            <Typography variant="body2" sx={{ mb: 2, color: "#666" }}>
                                {plan.description || "Gói đăng ký cao cấp với nhiều tính năng đặc biệt."}
                            </Typography>

                            <Box sx={{ display: "flex", justifyContent: "space-between", mt: 2 }}>
                                <Typography variant="body1">Giá:</Typography>
                                <Typography variant="body1" fontWeight="bold">
                                    ${plan.price}
                                </Typography>
                            </Box>

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="body1">Thời hạn:</Typography>
                                <Typography variant="body1">
                                    {plan.duration || 30} ngày
                                </Typography>
                            </Box>

                            <Divider sx={{ my: 2 }} />

                            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
                                <Typography variant="h6">Tổng cộng:</Typography>
                                <Typography variant="h6" fontWeight="bold" color="#F48FB1">
                                    ${plan.price}
                                </Typography>
                            </Box>

                            <Box sx={{ mt: 3, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                                <Typography variant="body2" color="text.secondary">
                                    <strong>Lưu ý:</strong> Sau khi thanh toán thành công, gói đăng ký của bạn sẽ được kích hoạt ngay lập tức và có hiệu lực trong {plan.duration || 30} ngày.
                                </Typography>
                            </Box>
                        </Paper>
                    </Grid>

                    {/* Payment form */}
                    <Grid item xs={12} md={7}>
                        <Paper sx={{ padding: 3 }} elevation={3}>
                            <Typography variant="h6" gutterBottom>
                                Thông tin thanh toán
                            </Typography>
                            <Divider sx={{ mb: 2 }} />

                            {error && (
                                <Alert severity="error" sx={{ mb: 2 }}>
                                    {error}
                                </Alert>
                            )}

                            <form onSubmit={handleSubmit}>
                                <FormControl component="fieldset" sx={{ mb: 2 }}>
                                    <Typography variant="subtitle2" gutterBottom>
                                        Phương thức thanh toán
                                    </Typography>
                                    <RadioGroup
                                        name="paymentMethod"
                                        value={paymentMethod}
                                        onChange={handlePaymentMethodChange}
                                    >
                                        <FormControlLabel
                                            value="Credit Card"
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <CreditCard sx={{ mr: 1 }} />
                                                    <Typography>Thẻ tín dụng / Thẻ ghi nợ</Typography>
                                                </Box>
                                            }
                                        />
                                        <FormControlLabel
                                            value="PayPal"
                                            control={<Radio />}
                                            label={
                                                <Box sx={{ display: "flex", alignItems: "center" }}>
                                                    <Payment sx={{ mr: 1 }} />
                                                    <Typography>PayPal</Typography>
                                                </Box>
                                            }
                                        />
                                    </RadioGroup>
                                </FormControl>

                                {paymentMethod === "Credit Card" && (
                                    <Box sx={{ mt: 2 }}>
                                        <TextField
                                            label="Số thẻ"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            placeholder="1234 5678 9012 3456"
                                            value={cardNumber}
                                            onChange={(e) => setCardNumber(e.target.value)}
                                            required
                                        />

                                        <TextField
                                            label="Tên chủ thẻ"
                                            fullWidth
                                            margin="normal"
                                            variant="outlined"
                                            placeholder="NGUYEN VAN A"
                                            value={cardName}
                                            onChange={(e) => setCardName(e.target.value)}
                                            required
                                        />

                                        <Grid container spacing={2}>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="Ngày hết hạn"
                                                    fullWidth
                                                    margin="normal"
                                                    variant="outlined"
                                                    placeholder="MM/YY"
                                                    value={expiryDate}
                                                    onChange={(e) => setExpiryDate(e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                            <Grid item xs={6}>
                                                <TextField
                                                    label="CVV"
                                                    fullWidth
                                                    margin="normal"
                                                    variant="outlined"
                                                    placeholder="123"
                                                    value={cvv}
                                                    onChange={(e) => setCvv(e.target.value)}
                                                    required
                                                />
                                            </Grid>
                                        </Grid>
                                    </Box>
                                )}

                                {paymentMethod === "PayPal" && (
                                    <Box sx={{ mt: 2, p: 2, bgcolor: "#f5f5f5", borderRadius: 1 }}>
                                        <Typography variant="body2">
                                            Bạn sẽ được chuyển đến trang PayPal để hoàn tất thanh toán sau khi nhấn nút "Thanh toán".
                                        </Typography>
                                    </Box>
                                )}

                                <Button
                                    type="submit"
                                    variant="contained"
                                    fullWidth
                                    size="large"
                                    disabled={processing}
                                    sx={{
                                        mt: 3,
                                        backgroundColor: processing ? "#ccc" : "#F48FB1",
                                        "&:hover": {
                                            backgroundColor: processing ? "#ccc" : "#F06292",
                                        },
                                        height: "50px"
                                    }}
                                >
                                    {processing ? (
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
                                            <CircularProgress size={24} sx={{ mr: 1, color: "#999" }} />
                                            <Typography>Đang xử lý...</Typography>
                                        </Box>
                                    ) : (
                                        `Thanh toán $${plan.price}`
                                    )}
                                </Button>
                            </form>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Container>
    );
};

export default Checkout;