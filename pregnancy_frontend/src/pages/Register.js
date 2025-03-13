import React, { useState } from "react";
import {
    TextField,
    Button,
    Container,
    Typography,
    Box,
    MenuItem
} from "@mui/material";
import authService from "../service/authService";

function Register({ closeModal }) {
    const [fullName, setFullName] = useState("");
    const [dob, setDob] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [phone, setPhone] = useState("");
    const [role, setRole] = useState("Member");

    const [errors, setErrors] = useState({});

    const validateInput = () => {
        let newErrors = {};

        if (!fullName.trim()) newErrors.fullName = "Full Name is required";
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
            const response = await authService.register(fullName, dob, email, password, role, phone);
            localStorage.setItem("token", response.data.token);
            closeModal();
        } catch (error) {
            setErrors({ global: error.response?.data?.message || "Registration failed" });
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
                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Full Name"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={fullName}
                        onChange={(e) => setFullName(e.target.value)}
                        error={!!errors.fullName}
                        helperText={errors.fullName}
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
                        error={!!errors.dob}
                        helperText={errors.dob}
                    />
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!errors.email}
                        helperText={errors.email}
                    />
                    <TextField
                        label="Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!errors.password}
                        helperText={errors.password}
                    />
                    <TextField
                        label="Confirm Password"
                        type="password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        error={!!errors.confirmPassword}
                        helperText={errors.confirmPassword}
                    />
                    <TextField
                        label="Phone"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={phone}
                        onChange={(e) => setPhone(e.target.value)}
                        error={!!errors.phone}
                        helperText={errors.phone}
                    />
                    <TextField
                        select
                        label="Role"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                    >
                        <MenuItem value="Member">Member</MenuItem>
                    </TextField>

                    {errors.global && (
                        <Typography color="error" align="center" sx={{ marginTop: 1 }}>
                            {errors.global}
                        </Typography>
                    )}

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
