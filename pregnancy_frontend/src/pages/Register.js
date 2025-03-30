import React, { useState } from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    FormControl,
    FormLabel,
    RadioGroup,
    FormControlLabel,
    Radio,
    Paper,
    InputAdornment,
    IconButton
} from "@mui/material";
import {
    Person,
    Email,
    Phone,
    Lock,
    Cake,
    Wc,
    Visibility,
    VisibilityOff
} from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import Swal from "sweetalert2";
import authService from "../service/authService";

function Register({ closeModal }) {
    const [firstName, setFirstName] = useState("");
    const [lastName, setLastName] = useState("");
    const [gender, setGender] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role] = useState("User");
    const [showPassword, setShowPassword] = useState(false);
    const [errors, setErrors] = useState({});
    const navigate = useNavigate();

    const validateInput = () => {
        let newErrors = {};
        if (!firstName.trim()) newErrors.firstName = "First Name is required";
        if (!lastName.trim()) newErrors.lastName = "Last Name is required";
        if (!dob) newErrors.dob = "Date of Birth is required";
        if (!email.match(/^[\w.-]+@[\w.-]+\.[a-zA-Z]{2,4}$/)) {
            newErrors.email = "Invalid email format";
        }
        if (password.length < 6) {
            newErrors.password = "Password must be at least 6 characters";
        }
        if (password !== confirmPassword) {
            newErrors.confirmPassword = "Passwords do not match";
        }
        if (!phone.match(/^[0-9]{10,11}$/)) {
            newErrors.phone = "Phone number must be 10-11 digits";
        }
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validateInput()) return;

        try {
            const userData = {
                firstName,
                lastName,
                dob,
                email,
                password,
                role,
                phone,
                gender,
            };

            const response = await authService.register(userData);
            console.log("Response từ API:", response);

            Swal.fire({
                title: "Đăng ký thành công!",
                text: "Bạn đã đăng ký tài khoản thành công. Hãy đăng nhập để tiếp tục!",
                icon: "success",
                confirmButtonText: "OK",
                confirmButtonColor: "#FF4081"
            }).then(() => {
                navigate("/login");
            });

        } catch (error) {
            console.error("Registration error:", error);
            setErrors({ global: error.message || "Registration failed" });
        }
    };

    return (

        <Box
            sx={{
                minHeight: '100vh',
                background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
                py: 4
            }}
        >
            <IconButton
                onClick={() => navigate(-1)}
                sx={{
                    position: 'absolute',
                    left: 20,
                    top: 20,
                    backgroundColor: 'white',
                    '&:hover': {
                        backgroundColor: '#f5f5f5'
                    }
                }}
            >
                <ArrowBackIcon />
            </IconButton>
            <Container maxWidth="md">
                <Paper
                    elevation={3}
                    sx={{
                        p: 4,
                        borderRadius: 2,
                        background: 'rgba(255, 255, 255, 0.9)',
                        backdropFilter: 'blur(10px)'
                    }}
                >
                    <Typography
                        variant="h4"
                        align="center"
                        sx={{
                            mb: 4,
                            color: '#FF4081',
                            fontWeight: 'bold'
                        }}
                    >
                        Đăng Ký Tài Khoản
                    </Typography>

                    <form onSubmit={handleSubmit}>
                        <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
                            <TextField
                                fullWidth
                                label="Họ"
                                value={firstName}
                                onChange={(e) => setFirstName(e.target.value)}
                                error={!!errors.firstName}
                                helperText={errors.firstName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                            <TextField
                                fullWidth
                                label="Tên"
                                value={lastName}
                                onChange={(e) => setLastName(e.target.value)}
                                error={!!errors.lastName}
                                helperText={errors.lastName}
                                InputProps={{
                                    startAdornment: (
                                        <InputAdornment position="start">
                                            <Person color="primary" />
                                        </InputAdornment>
                                    ),
                                }}
                            />
                        </Box>
                        <TextField
                            fullWidth
                            type="date"
                            label="Ngày sinh"
                            value={dob}
                            onChange={(e) => setDob(e.target.value)}
                            error={!!errors.dob}
                            helperText={errors.dob}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Cake color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                            InputLabelProps={{
                                shrink: true,
                            }}
                        />

                        <FormControl component="fieldset" sx={{ mb: 2 }}>
                            <FormLabel component="legend">Giới tính</FormLabel>
                            <RadioGroup
                                row
                                value={gender}
                                onChange={(e) => setGender(e.target.value)}
                            >
                                <FormControlLabel
                                    value="female"
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Wc color="primary" sx={{ mr: 1 }} />
                                            Nữ
                                        </Box>
                                    }
                                />
                                <FormControlLabel
                                    value="male"
                                    control={<Radio />}
                                    label={
                                        <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                            <Wc color="primary" sx={{ mr: 1 }} />
                                            Nam
                                        </Box>
                                    }
                                />
                            </RadioGroup>
                        </FormControl>

                        <TextField
                            fullWidth
                            label="Email"
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            error={!!errors.email}
                            helperText={errors.email}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Email color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            label="Mật khẩu"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            error={!!errors.password}
                            helperText={errors.password}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="primary" />
                                    </InputAdornment>
                                ),
                                endAdornment: (
                                    <InputAdornment position="end">
                                        <Button onClick={() => setShowPassword(!showPassword)}>
                                            {showPassword ? <VisibilityOff /> : <Visibility />}
                                        </Button>
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            type={showPassword ? "text" : "password"}
                            label="Xác nhận mật khẩu"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
                            error={!!errors.confirmPassword}
                            helperText={errors.confirmPassword}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Lock color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <TextField
                            fullWidth
                            label="Số điện thoại"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            error={!!errors.phone}
                            helperText={errors.phone}
                            sx={{ mb: 2 }}
                            InputProps={{
                                startAdornment: (
                                    <InputAdornment position="start">
                                        <Phone color="primary" />
                                    </InputAdornment>
                                ),
                            }}
                        />

                        <Button
                            type="submit"
                            fullWidth
                            variant="contained"
                            sx={{
                                mt: 2,
                                bgcolor: '#FF4081',
                                '&:hover': {
                                    bgcolor: '#F50057',
                                },
                                height: '48px',
                                fontSize: '1.1rem',
                            }}
                        >
                            Đăng Ký
                        </Button>
                    </form>
                </Paper>
            </Container>
        </Box>

    );
}

export default Register;