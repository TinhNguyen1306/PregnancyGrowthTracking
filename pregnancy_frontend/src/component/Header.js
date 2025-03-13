// Header.js
import React from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";

const Header = () => {
    const navigate = useNavigate();
    const userEmail = localStorage.getItem("userEmail");

    return (
        <AppBar position="static" sx={{ backgroundColor: "#1976d2" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
                {/* Login & Sign Up buttons or Welcome message */}
                <Box>
                    {userEmail ? (
                        <Typography color="inherit">Welcome, {userEmail}</Typography>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
                            <Button color="inherit" onClick={() => navigate("/signup")}>Sign Up</Button>
                        </>
                    )}
                </Box>

                {/* Centered Logo */}
                <Typography variant="h6" sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}>
                    Pregnancy App
                </Typography>

                {/* Empty box to balance layout */}
                <Box sx={{ width: "120px" }}></Box>
            </Toolbar>
        </AppBar>
    );
};

export default Header;
