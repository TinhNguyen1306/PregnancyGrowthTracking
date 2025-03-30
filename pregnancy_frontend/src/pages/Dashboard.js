import React from "react";
import { Box, CssBaseline } from "@mui/material";
import Sidebar from "../component/Sidebar";
import Header from "../component/Header";
import Maindashboard from "../component/Maindashboard";

const Dashboard = () => {

    return (
        <Box sx={{ display: "flex", backgroundColor: "#ffe0f0", minHeight: "100vh" }}>
            <CssBaseline />
            <Sidebar />
            <Box sx={{ flexGrow: 1 }}>
                <Header />
                <Maindashboard />
            </Box>
        </Box>
    );
};

export default Dashboard;
