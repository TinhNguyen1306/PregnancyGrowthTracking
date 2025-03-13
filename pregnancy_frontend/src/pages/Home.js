import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, IconButton, TextField, Button, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Register from "./Register";
import logo from "../assets/Pregnancy.png";

function Home() {
    const navigate = useNavigate();
    const [openRegister, setOpenRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState(""); // Lỗi email
    const [passwordError, setPasswordError] = useState(""); // Lỗi password

    const validateEmail = (email) => {
        const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        return regex.test(email);
    };

    const validatePassword = (password) => {
        return password.length >= 6;
    };

    const handleLogin = () => {
        let isValid = true;
        setEmailError("");
        setPasswordError("");

        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email.");
            isValid = false;
        }

        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 6 characters.");
            isValid = false;
        }

        if (isValid) {
            navigate("/dashboard");
        }
    };

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                Welcome to <span style={styles.highlight}>Pregnancy Tracker</span>
            </h1>
            <p style={styles.subtitle}>
                Track your baby's growth and get helpful information.
            </p>

            <div style={styles.loginBox}>
                {/* Logo trên form login */}
                <div style={styles.logoContainer}>
                    <img src={logo} alt="Logo" style={styles.logo} />
                </div>
                <TextField
                    label="Email"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    error={!!emailError}
                    helperText={emailError} // Hiển thị lỗi ngay dưới ô input
                />

                <TextField
                    label="Password"
                    type="password"
                    variant="outlined"
                    fullWidth
                    margin="normal"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    error={!!passwordError}
                    helperText={passwordError} // Hiển thị lỗi ngay dưới ô input
                />

                <Button
                    variant="contained"
                    sx={{ backgroundColor: "#FF4081", "&:hover": { backgroundColor: "#E73370" } }}
                    fullWidth
                    onClick={handleLogin}
                >
                    Login
                </Button>

                <Typography variant="body2" style={{ marginTop: "10px" }}>
                    Don't have an account?{" "}
                    <span style={styles.registerLink} onClick={() => setOpenRegister(true)}>
                        Register
                    </span>
                </Typography>
            </div>

            {/* Modal Register */}
            <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
                <DialogTitle>
                    Register
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenRegister(false)}
                        style={{ position: "absolute", right: 10, top: 10 }}
                    >
                        <CloseIcon />
                    </IconButton>
                </DialogTitle>
                <DialogContent>
                    <Register closeModal={() => setOpenRegister(false)} />
                </DialogContent>
            </Dialog>
        </div>
    );
}

// CSS trực tiếp trong file
const styles = {
    container: {
        background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        textAlign: "center",
        fontFamily: "'Poppins', sans-serif",
    },
    title: {
        fontSize: "2.5rem",
        fontWeight: "bold",
        color: "#444",
    },
    highlight: {
        color: "#FF4081",
    },
    subtitle: {
        fontSize: "1.1rem",
        color: "#666",
    },
    logo: {
        width: "80px",  // Điều chỉnh kích thước logo
        height: "80px",
        borderRadius: "50%", // Làm logo thành hình tròn
        objectFit: "cover",  // Đảm bảo hình ảnh không bị méo
    },
    loginBox: {
        background: "white",
        padding: "30px",
        borderRadius: "10px",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
        width: "350px",
        marginTop: "20px",
    },
    registerLink: {
        color: "#FF4081",
        fontWeight: "bold",
        cursor: "pointer",
    },
};

export default Home;
