import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("userEmail");

    const handleLogout = () => {
        localStorage.removeItem("userEmail"); // Xóa thông tin user
        navigate("/login"); // Quay về trang login
    };

    return (
        <AppBar position="static" sx={{ backgroundColor: "#F48FB1" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                <Box>
                    {userEmail ? (
                        <>
                            <Typography color="inherit" sx={{ fontWeight: "bold" }}>
                                Welcome, {userEmail}
                            </Typography>
                            <Button color="inherit" onClick={handleLogout} sx={{ marginLeft: 2 }}>
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate("/login")}>
                                Login
                            </Button>
                            <Button color="inherit" onClick={() => navigate("/register")}>
                                Sign Up
                            </Button>
                        </>
                    )}
                </Box>
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}>
                    Pregnancy Tracker
                </Typography>
                <Box sx={{ width: "120px" }}></Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
