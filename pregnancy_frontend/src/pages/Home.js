import React, { useState, useContext, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { UserContext } from "../context/userContext";
import {
    Button,
    Card,
    CardContent,
    CardHeader,
    CardActions,
    Typography,
    Dialog,
    DialogActions,
    DialogContent,
    DialogContentText,
    DialogTitle,
    TextField,
    Grid,
    Container,
    Box,
    AppBar,
    Toolbar,
    List,
    ListItem,
    ListItemIcon,
    ListItemText
} from "@mui/material";
import {
    ArrowForward as ArrowForwardIcon,
    ChildCare as BabyIcon,
    MonitorHeart as HeartPulseIcon,
    DateRange as CalendarIcon,
    Check as CheckIcon
} from "@mui/icons-material";

const Home: React.FC = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const { login, userEmail } = useContext(UserContext);

    // State for login
    const [openLoginDialog, setOpenLoginDialog] = useState(false);
    const [openRegisterDialog, setOpenRegisterDialog] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    // Validation functions
    const validateEmail = (email: string): boolean => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    const validatePassword = (password: string): boolean => {
        return password.length >= 6;
    };

    // Handle login
    const handleLogin = (e: React.FormEvent) => {
        e.preventDefault();
        let isValid = true;
        setEmailError("");
        setPasswordError("");

        if (!validateEmail(email)) {
            setEmailError("Vui lòng nhập đúng định dạng email.");
            isValid = false;
        }

        if (!validatePassword(password)) {
            setPasswordError("Mật khẩu phải có ít nhất 6 ký tự.");
            isValid = false;
        }

        if (isValid) {
            // Mock login for demo
            login({
                userEmail: email,
                firstName: "Người",
                lastName: "Dùng",
                userId: 1,
                userRole: "User"
            });

            setOpenLoginDialog(false);
            navigate("/dashboard");
        }
    };

    // Handle register
    const handleRegister = (e) => {
        e.preventDefault();

        // Basic validation
        if (!email || !password || !firstName || !lastName) {
            alert("Vui lòng điền đầy đủ thông tin");
            return;
        }

        // Close dialog and show success message
        setOpenRegisterDialog(false);
        alert("Đăng ký thành công! Vui lòng đăng nhập để tiếp tục.");
    };
    // Khi URL thay đổi, kiểm tra xem có phải /login hay /register không
    useEffect(() => {
        if (location.pathname === "/login") {
            setOpenLoginDialog(true);
        } else {
            setOpenLoginDialog(false);
        }

        if (location.pathname === "/register") {
            setOpenRegisterDialog(true);
        } else {
            setOpenRegisterDialog(false);
        }
    }, [location.pathname]);

    return (
        <Box sx={{ minHeight: '100vh', background: 'linear-gradient(180deg, #FFF5F8 0%, #FFFFFF 100%)' }}>
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
                    onClick={() => userEmail ? navigate("/dashboard") : setOpenLoginDialog(true)}
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
            <Box sx={{ bgcolor: '#FFF5F8', py: 8 }}>
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

                    <Grid container spacing={4} justifyContent="center">
                        {/* Bronze Plan */}
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid #FFD0E0',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        borderColor: '#FF4081'
                                    }
                                }}
                            >
                                <CardHeader
                                    title={
                                        <Typography variant="h5" color="#D81B60" fontWeight="bold" textAlign="center">
                                            Gói Bronze
                                        </Typography>
                                    }
                                    subheader={
                                        <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ my: 2 }}>
                                            $49.99
                                        </Typography>
                                    }
                                    sx={{ pb: 0 }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                                        Gói cơ bản với các tính năng theo dõi thai kỳ
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Theo dõi sự phát triển thai nhi" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Nhắc nhở lịch khám" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Thông báo quan trọng" />
                                        </ListItem>
                                    </List>
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => navigate('/checkout/1')}
                                        sx={{
                                            backgroundColor: '#FF4081',
                                            '&:hover': { backgroundColor: '#D81B60' },
                                            py: 1
                                        }}
                                    >
                                        Đăng ký ngay
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                        {/* Gold Plan - Featured */}
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '2px solid #FF4081',
                                    boxShadow: '0 8px 24px rgba(0,0,0,0.15)',
                                    transform: 'scale(1.05)',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        boxShadow: '0 12px 32px rgba(0,0,0,0.18)',
                                    }
                                }}
                            >
                                <CardHeader
                                    title={
                                        <Typography variant="h5" color="#D81B60" fontWeight="bold" textAlign="center">
                                            Gói Gold
                                        </Typography>
                                    }
                                    subheader={
                                        <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ my: 2 }}>
                                            $99.99
                                        </Typography>
                                    }
                                    sx={{ pb: 0 }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                                        Gói phổ biến với nhiều tính năng đặc biệt
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Tất cả tính năng của gói Bronze" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Tư vấn sức khỏe với bác sĩ" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Phân tích chi tiết sự phát triển thai nhi" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Truy cập cộng đồng chia sẻ" />
                                        </ListItem>
                                    </List>
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => navigate('/checkout/2')}
                                        sx={{
                                            backgroundColor: '#FF4081',
                                            '&:hover': { backgroundColor: '#D81B60' },
                                            py: 1
                                        }}
                                    >
                                        Đăng ký ngay
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>

                        {/* Diamond Plan */}
                        <Grid item xs={12} md={4}>
                            <Card
                                sx={{
                                    height: '100%',
                                    display: 'flex',
                                    flexDirection: 'column',
                                    border: '1px solid #FFD0E0',
                                    transition: 'all 0.3s',
                                    '&:hover': {
                                        boxShadow: '0 8px 16px rgba(0,0,0,0.1)',
                                        borderColor: '#FF4081'
                                    }
                                }}
                            >
                                <CardHeader
                                    title={
                                        <Typography variant="h5" color="#D81B60" fontWeight="bold" textAlign="center">
                                            Gói Diamond
                                        </Typography>
                                    }
                                    subheader={
                                        <Typography variant="h3" fontWeight="bold" textAlign="center" sx={{ my: 2 }}>
                                            $149.99
                                        </Typography>
                                    }
                                    sx={{ pb: 0 }}
                                />
                                <CardContent sx={{ flexGrow: 1 }}>
                                    <Typography variant="body2" color="text.secondary" textAlign="center" sx={{ mb: 2 }}>
                                        Gói cao cấp nhất với đầy đủ tính năng và hỗ trợ 24/7
                                    </Typography>
                                    <List>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Tất cả tính năng của gói Gold" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Hỗ trợ y tế 24/7" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Tư vấn dinh dưỡng cá nhân hóa" />
                                        </ListItem>
                                        <ListItem>
                                            <ListItemIcon>
                                                <CheckIcon sx={{ color: '#FF4081' }} />
                                            </ListItemIcon>
                                            <ListItemText primary="Hỗ trợ kế hoạch sinh con" />
                                        </ListItem>
                                    </List>
                                </CardContent>
                                <CardActions sx={{ p: 2, pt: 0 }}>
                                    <Button
                                        fullWidth
                                        variant="contained"
                                        onClick={() => navigate('/checkout/3')}
                                        sx={{
                                            backgroundColor: '#FF4081',
                                            '&:hover': { backgroundColor: '#D81B60' },
                                            py: 1
                                        }}
                                    >
                                        Đăng ký ngay
                                    </Button>
                                </CardActions>
                            </Card>
                        </Grid>
                    </Grid>
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

            {/* Login Dialog */}
            <Dialog open={openLoginDialog} onClose={() => navigate("/")}>
                <DialogTitle>Đăng nhập</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Đăng nhập để tiếp tục sử dụng ứng dụng.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError}
                    />
                    <TextField
                        margin="dense"
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => navigate("/")}>Hủy</Button>
                    <Button
                        onClick={handleLogin}
                        sx={{
                            backgroundColor: '#FF4081',
                            color: 'white',
                            '&:hover': { backgroundColor: '#D81B60' }
                        }}
                    >
                        Đăng nhập
                    </Button>
                </DialogActions>
            </Dialog>

            {/* Register Dialog */}
            <Dialog open={openRegisterDialog} onClose={() => navigate("/")}>
                <DialogTitle>Đăng ký tài khoản mới</DialogTitle>
                <DialogContent>
                    <DialogContentText sx={{ mb: 2 }}>
                        Vui lòng điền thông tin để tạo tài khoản mới.
                    </DialogContentText>
                    <TextField
                        autoFocus
                        margin="dense"
                        label="Họ"
                        fullWidth
                        variant="outlined"
                        value={firstName}
                        onChange={(e) => setFirstName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Tên"
                        fullWidth
                        variant="outlined"
                        value={lastName}
                        onChange={(e) => setLastName(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Email"
                        type="email"
                        fullWidth
                        variant="outlined"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                    />
                    <TextField
                        margin="dense"
                        label="Mật khẩu"
                        type="password"
                        fullWidth
                        variant="outlined"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                    />
                </DialogContent>
                <DialogActions>
                    <Button onClick={() => setOpenRegisterDialog(false)}>Hủy</Button>
                    <Button
                        onClick={handleRegister}
                        sx={{
                            backgroundColor: '#FF4081',
                            color: 'white',
                            '&:hover': { backgroundColor: '#D81B60' }
                        }}
                    >
                        Đăng ký
                    </Button>
                </DialogActions>
            </Dialog>
        </Box>
    );
};

export default Home;