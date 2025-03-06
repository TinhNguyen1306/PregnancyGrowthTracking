import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Dialog, DialogTitle, DialogContent, IconButton } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import Register from "./Register"; // Import trang đăng ký

function Home() {
    const navigate = useNavigate();
    const [openRegister, setOpenRegister] = useState(false);

    return (
        <div style={styles.container}>
            <h1 style={styles.title}>
                Welcome to <span style={styles.highlight}>Pregnancy Tracker</span>
            </h1>
            <p style={styles.subtitle}>
                Track your baby's growth and get helpful information.
            </p>

            <div style={styles.loginBox}>
                <input type="email" placeholder="Email" style={styles.input} />
                <input type="password" placeholder="Password" style={styles.input} />
                <button style={styles.loginBtn} onClick={() => navigate("/dashboard")}>
                    Login
                </button>
                <p>
                    Don't have an account?{" "}
                    <span
                        style={styles.registerLink}
                        onClick={() => setOpenRegister(true)} // Mở modal khi nhấn Register
                    >
                        Register
                    </span>
                </p>
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
    loginBox: {
        background: "white",
        padding: "50px",
        borderRadius: "10px",
        boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.2)",
        width: "300px",
        marginTop: "20px",
    },
    input: {
        width: "100%",
        padding: "10px",
        margin: "10px 0",
        border: "1px solid #ddd",
        borderRadius: "5px",
        fontSize: "1rem",
    },
    loginBtn: {
        width: "100%",
        padding: "10px",
        backgroundColor: "#FF4081",
        color: "white",
        fontSize: "1rem",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
        transition: "0.3s",
    },
    registerLink: {
        color: "#FF4081",
        fontWeight: "bold",
        cursor: "pointer",
        transition: "0.3s",
    },
};

export default Home;
