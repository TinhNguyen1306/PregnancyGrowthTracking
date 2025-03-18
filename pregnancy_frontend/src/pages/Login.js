import React, { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import {
    Dialog,
    DialogTitle,
    DialogContent,
    IconButton,
    TextField,
    Button,
    Typography,
    CircularProgress,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Register from "./Register";
import authService from "../service/authService";
import logo from "../assets/Pregnancy.png";
import { UserContext } from "../context/userContext";

function Login() {
    const navigate = useNavigate();
    const { login } = useContext(UserContext);

    const [openRegister, setOpenRegister] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");
    const [loginError, setLoginError] = useState("");
    const [loading, setLoading] = useState(false);

    const validateEmail = (email) =>
        /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/.test(email);

    const validatePassword = (password) => password.length >= 6;

    const handleSubmit = async (e) => {
        e.preventDefault();
        setEmailError("");
        setPasswordError("");
        setLoginError("");

        let isValid = true;
        if (!validateEmail(email)) {
            setEmailError("Please enter a valid email.");
            isValid = false;
        }
        if (!validatePassword(password)) {
            setPasswordError("Password must be at least 6 characters.");
            isValid = false;
        }
        if (!isValid) return;

        setLoading(true);
        try {
            const response = await authService.login(email, password);
            const { token, user } = response;

            localStorage.setItem("userToken", token);
            localStorage.setItem("userInfo", JSON.stringify(user));
            login(user.email);

            console.log("Login Success:", response);
            navigate("/dashboard");
        } catch (err) {
            console.error("Login failed:", err.response?.data || err.message);
            setLoginError(err.response?.data?.message || "Invalid email or password");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div
            style={{
                background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)",
                minHeight: "100vh",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                textAlign: "center",
                fontFamily: "'Poppins', sans-serif",
            }}
        >
            <Typography variant="h4" fontWeight="bold" color="#444">
                Welcome to <span style={{ color: "#FF4081" }}>Pregnancy Tracker</span>
            </Typography>

            <Typography variant="body1" color="#666" mt={1}>
                Track your baby's growth and get helpful information.
            </Typography>

            <div
                style={{
                    background: "white",
                    padding: "30px",
                    borderRadius: "10px",
                    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
                    width: "350px",
                    marginTop: "20px",
                }}
            >
                <div style={{ textAlign: "center" }}>
                    <img src={logo} alt="Logo" style={{ width: "80px", height: "80px", borderRadius: "50%" }} />
                </div>

                <form onSubmit={handleSubmit}>
                    <TextField
                        label="Email"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        error={!!emailError}
                        helperText={emailError}
                        autoComplete="username"
                    />

                    <TextField
                        label="Password"
                        type="password"
                        autoComplete="current-password"
                        variant="outlined"
                        fullWidth
                        margin="normal"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        error={!!passwordError}
                        helperText={passwordError}
                    />

                    {loginError && (
                        <Typography color="error" sx={{ mt: 1, fontSize: "14px" }}>
                            {loginError}
                        </Typography>
                    )}

                    <Button
                        variant="contained"
                        sx={{ backgroundColor: "#FF4081", "&:hover": { backgroundColor: "#E73370" }, mt: 2 }}
                        fullWidth
                        type="submit"
                        disabled={loading}
                    >
                        {loading ? <CircularProgress size={24} color="inherit" /> : "Login"}
                    </Button>
                </form>

                <Typography variant="body2" sx={{ mt: 2 }}>
                    Don't have an account?{" "}
                    <span style={{ color: "#FF4081", fontWeight: "bold", cursor: "pointer" }} onClick={() => setOpenRegister(true)}>
                        Register
                    </span>
                </Typography>
            </div>

            <Dialog open={openRegister} onClose={() => setOpenRegister(false)}>
                <DialogTitle>
                    Register
                    <IconButton
                        aria-label="close"
                        onClick={() => setOpenRegister(false)}
                        sx={{ position: "absolute", right: 10, top: 10 }}
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

export default Login;
