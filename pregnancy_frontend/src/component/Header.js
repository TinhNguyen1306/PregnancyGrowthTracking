import React, { useContext } from "react";
import { AppBar, Toolbar, Typography, Button, Box } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { UserContext } from "../context/userContext";
import logo from "../assets/Pregnancy.png";

function Header() {
    const navigate = useNavigate();
    const { userEmail, logout } = useContext(UserContext);

    return (
        <AppBar position="static" sx={{ background: "linear-gradient(135deg, #FFDEE9 0%, #B5FFFC 100%)", padding: "10px 0" }}>
            <Toolbar sx={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                <Box sx={{ display: "flex", alignItems: "center", cursor: "pointer" }} onClick={() => navigate("/")}>
                    <img src={logo} alt="Logo" style={{ width: "50px", height: "50px", borderRadius: "50%" }} />
                </Box>

                <Box sx={{ position: "absolute", right: "20px", display: "flex", alignItems: "center" }}>
                    {userEmail ? (
                        <>
                            <Typography variant="body1" sx={{ display: "inline", mr: 2, color: "#333", fontWeight: "bold" }}>
                                {userEmail}
                            </Typography>
                            <Button
                                variant="contained"
                                sx={{
                                    background: "linear-gradient(135deg, #FFDEE9 30%, #B5FFFC 100%)",
                                    color: "black",
                                    '&:hover': { background: "#C2185B" }
                                }}
                                onClick={logout}
                            >
                                Logout
                            </Button>
                        </>
                    ) : (
                        <>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/login")}
                                sx={{ color: "#D81B60", fontWeight: "bold", "&:hover": { color: "#880E4F" } }}
                            >
                                Login
                            </Button>
                            <Button
                                color="inherit"
                                onClick={() => navigate("/register")}
                                sx={{ color: "#0288D1", fontWeight: "bold", "&:hover": { color: "#01579B" } }}
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </Box>
            </Toolbar>
        </AppBar>
    );
}

export default Header;