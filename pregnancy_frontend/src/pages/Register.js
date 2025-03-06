import React, { useState } from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Alert,
    Box,
    MenuItem,
} from "@mui/material";
import authService from "../service/authService";

function Register({ closeModal }) {
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("Member");
    const [error, setError] = useState("");

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(""); // Xóa lỗi cũ nếu có
        try {
            const response = await authService.register(fullName, dob, email, password, role, phone);
            localStorage.setItem("token", response.data.token);
            closeModal(); // Đóng modal khi đăng ký thành công
        } catch (error) {
            setError(error.response?.data?.message || "Registration failed");
        }
    };

    return (
        <Container maxWidth="sm">
            <Box
                sx={{
                    padding: "20px",
                    background: "white",
                    borderRadius: "10px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                }}
            >
                <Typography variant="h5" align="center" gutterBottom>
                    Register
                </Typography>
                {error && <Alert severity="error">{error}</Alert>}
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        required
                    />
                    <TextField
                        label="Date of Birth"
                        type="date"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={dob}
                        onChange={(e) => setDob(e.target.value)}
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    <TextField
                        label="Phone"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        required
                    />
                    <TextField
                        select
                        label="Role"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        required
                    >
                        <MenuItem value="Member">Member</MenuItem>
                    </TextField>
                    <Button
                        variant="contained"
                        fullWidth
                        type="submit"
                        sx={{
                            backgroundColor: "#FF4081",
                            color: "white",
                            padding: "10px",
                            fontSize: "1rem",
                            marginTop: "10px",
                            "&:hover": {
                                backgroundColor: "#D81B60",
                            },
                        }}
                    >
                        Register
                    </Button>
                </form>
            </Box>
        </Container>
    );
}

export default Register;
