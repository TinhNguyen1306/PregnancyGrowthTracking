import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import logo from "../assets/Pregnancy.png";

function Header() {
    const navigate = useNavigate();
    const { userEmail, logout } = useContext(UserContext);

    return (
        <AppBar position="static" sx={{ backgroundColor: "#FF4081", padding: "10px 0" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
                    <img src={logo} alt="Logo" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                    {/* <Typography variant="h6" sx={{ ml: 2, fontWeight: "bold" }}>Pregnancy Tracker</Typography> */}
                </Box>

                <Box sx={{ position: "absolute", right: "20px", display: "flex", alignItems: "center" }}>
                    {userEmail ? (
                        <>
                            <Typography variant="body1" sx={{ display: "inline", mr: 2 }}>
                                {userEmail}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{ backgroundColor: "#D81B60", '&:hover': { backgroundColor: "#AD1457" } }}
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button color="inherit" onClick={() => navigate("/login")}>Login</Button>
                            <Button color="inherit" onClick={() => navigate("/register")}>Sign Up</Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;
