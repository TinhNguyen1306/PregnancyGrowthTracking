import React, { useState, useContext, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    Typography,
    CircularProgress,
    Grid,
    Container,
    Box,
    AppBar,
    Toolbar,
} from "@mui/material";
import {
    ArrowForward as ArrowForwardIcon,
    ChildCare as BabyIcon,
    MonitorHeart as HeartPulseIcon,
    DateRange as CalendarIcon,
} from "@mui/icons-material";

const Home = () => {
    const navigate = useNavigate();
    const { userEmail } = useContext(UserContext);

    const [plans, setPlans] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchSubscriptionPlans = async () => {
            try {
                const response = await fetch("http://localhost:5001/api/subscription/all");
                if (!response.ok) throw new Error("Không thể lấy danh sách gói đăng ký");
                setPlans(await response.json());
            } catch (error) {
                setError("Không thể tải thông tin gói đăng ký. Vui lòng thử lại sau.");
            } finally {
                setLoading(false);
            }
        };
        fetchSubscriptionPlans();
    }, []);

    return (
        <Box sx={{ minHeight: '100vh', background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)" }}>
            {/* Header */}
            <AppBar position="static" sx={{ backgroundColor: "#FFFFFF", boxShadow: 1 }}>
                <Toolbar>
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                        <BabyIcon sx={{ color: '#FF4081', mr: 1 }} />
                        <Typography variant="h6" sx={{ color: '#FF4081', fontWeight: 'bold' }}>
                            Pregnancy Tracker
                        </Typography>
                    </Box>

                    <Box sx={{ flexGrow: 1 }} />

                    {userEmail ? (
                        <Button
                            variant="contained"
                            onClick={() => navigate("/dashboard")}
                            sx={{
                                backgroundColor: '#FF4081',
                                '&:hover': { backgroundColor: '#D81B60' }
                            }}
                        >
                            Đến Dashboard
                        </Button>
                    ) : (
                        <Box>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/register")}
                                sx={{ color: '#FF4081', mr: 1 }}
                            >
                                Đăng ký
                            </Button>
                            <Button
                                variant="contained"
                                onClick={() => navigate("/login")}
                                sx={{
                                    backgroundColor: '#FF4081',
                                    '&:hover': { backgroundColor: '#D81B60' }
                                }}
                            >
                                Đăng nhập
                            </Button>
                        </Box>
                    )}
                </Toolbar>
            </AppBar>

            {/* Hero Section */}
            <Container maxWidth="lg" sx={{ pt: 8, pb: 6, textAlign: 'center' }}>
                <Typography
                    variant="h2"
                    component="h1"
                    sx={{
                        fontWeight: 'bold',
                        color: '#D81B60',
                        mb: 2
                    }}
                >
                    Chào mừng đến với ứng dụng Theo dõi Thai kỳ
                </Typography>
                <Typography
                    variant="h5"
                    sx={{
                        color: '#666',
                        mb: 4,
                        maxWidth: '800px',
                        mx: 'auto'
                    }}
                >
                    Hỗ trợ bạn trong hành trình tuyệt vời từ thụ thai đến khi sinh nở với các công cụ và thông tin hữu ích
                </Typography>
                <Button
                    variant="contained"
                    size="large"
                    onClick={() => userEmail ? navigate("/dashboard") : navigate("/login")}
                    endIcon={<ArrowForwardIcon />}
                    sx={{
                        backgroundColor: '#FF4081',
                        '&:hover': { backgroundColor: '#D81B60' },
                        px: 4,
                        py: 1.5
                    }}
                >
                    Khám phá ngay
                </Button>
            </Container>

            {/* Features Section */}
            <Box sx={{ bgcolor: 'white', py: 8 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontWeight: 'bold',
                            color: '#D81B60',
                            mb: 5,
                            textAlign: 'center'
                        }}
                    >
                        Các tính năng nổi bật
                    </Typography>

                    <Grid container spacing={4}>
                        {/* Feature 1 */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardHeader
                                    avatar={<BabyIcon sx={{ fontSize: 40, color: '#FF4081' }} />}
                                    title={
                                        <Typography variant="h6" color="#333" fontWeight="bold">
                                            Theo dõi sự phát triển thai nhi
                                        </Typography>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        Theo dõi cân nặng, chiều dài và các chỉ số phát triển khác của thai nhi theo từng tuần.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Feature 2 */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardHeader
                                    avatar={<HeartPulseIcon sx={{ fontSize: 40, color: '#FF4081' }} />}
                                    title={
                                        <Typography variant="h6" color="#333" fontWeight="bold">
                                            Tư vấn sức khỏe
                                        </Typography>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        Nhận tư vấn từ các bác sĩ chuyên khoa về các vấn đề sức khỏe trong thai kỳ.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>

                        {/* Feature 3 */}
                        <Grid item xs={12} md={4}>
                            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                                <CardHeader
                                    avatar={<CalendarIcon sx={{ fontSize: 40, color: '#FF4081' }} />}
                                    title={
                                        <Typography variant="h6" color="#333" fontWeight="bold">
                                            Nhắc nhở lịch khám
                                        </Typography>
                                    }
                                />
                                <CardContent>
                                    <Typography variant="body2" color="text.secondary">
                                        Đặt lịch và nhận thông báo nhắc nhở về các buổi khám thai định kỳ.
                                    </Typography>
                                </CardContent>
                            </Card>
                        </Grid>
                    </Grid>
                </Container>
            </Box>

            {/* Subscription Plans Section */}
            <Box sx={{ bgcolor: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)", py: 8 }}>
                <Container maxWidth="lg">
                    <Typography
                        variant="h3"
                        component="h2"
                        sx={{
                            fontWeight: 'bold',
                            color: '#D81B60',
                            mb: 2,
                            textAlign: 'center'
                        }}
                    >
                        Các gói đăng ký
                    </Typography>

                    <Typography
                        variant="h6"
                        sx={{
                            color: '#666',
                            mb: 5,
                            textAlign: 'center',
                            maxWidth: '800px',
                            mx: 'auto'
                        }}
                    >
                        Chọn gói đăng ký phù hợp với nhu cầu của bạn để trải nghiệm đầy đủ các tính năng của ứng dụng
                    </Typography>

                    {error && <Typography color="error" sx={{ mb: 2 }}>{error}</Typography>}
                    {loading ? (
                        <Box sx={{ display: "flex", justifyContent: "center", p: 3 }}>
                            <CircularProgress />
                        </Box>
                    ) : (
                        <Grid container spacing={3}>
                            {plans.map((plan) => (
                                <Grid item xs={12} md={4} key={plan.planId}>
                                    <Card sx={{ textAlign: "center", borderRadius: 2, boxShadow: 3 }}>
                                        <CardContent>
                                            <Typography variant="h5" fontWeight="bold" mb={1}>{plan.name}</Typography>
                                            <Typography variant="h6" mb={2}>
                                                {plan.price === 0 ? "Miễn phí" : `$${plan.price}`}
                                            </Typography>
                                            <Typography variant="body1" mb={2}>{plan.description || "Mô tả gói đăng ký"}</Typography>
                                            <Button
                                                variant="contained"
                                                sx={{ backgroundColor: "#FF4081", "&:hover": { backgroundColor: "#D81B60" } }}
                                                onClick={() => navigate(`/checkout/:planId=${plan.planId}`)}
                                            >
                                                Đăng ký ngay
                                            </Button>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    )}
                </Container>
            </Box>

            {/* Footer */}
            <Box sx={{ bgcolor: '#F8F9FA', py: 3, px: 2, mt: 'auto' }}>
                <Container maxWidth="lg">
                    <Typography variant="body2" color="text.secondary" align="center">
                        © {new Date().getFullYear()} Pregnancy Tracker App. Tất cả các quyền được bảo lưu.
                    </Typography>
                </Container>
            </Box>
        </Box>
    );
};

export default Home;