import React, { useContext } from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import GrowthChart from "./Growthchart";
import { UserContext } from "../context/userContext"; // Import UserContext

const Maindashboard = () => {
    const { user } = useContext(UserContext); // Lấy toàn bộ user object từ context

    const pregnancyWeek = 20; // Mock data
    const babyWeight = "0.5 kg";
    const babyHeight = "25 cm";
    const healthStatus = "Normal";

    // Kiểm tra user có tồn tại không trước khi lấy tên
    const fullName = user ? `${user.firstName} ${user.lastName}`.trim() : "User";

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>
                Welcome, {fullName}!
            </Typography>
            <Typography variant="h6">Pregnancy Week: {pregnancyWeek}</Typography>
            <Typography variant="body1">Baby Weight: {babyWeight}</Typography>
            <Typography variant="body1">Baby Height: {babyHeight}</Typography>
            <Typography variant="body1">Health Status: {healthStatus}</Typography>

            <Grid container spacing={3} sx={{ marginTop: 2 }}>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 2 }}>
                        <Typography variant="h5">Baby Height Growth Chart</Typography>
                        <GrowthChart type="height" />
                    </Paper>
                </Grid>
                <Grid item xs={12} md={6}>
                    <Paper sx={{ padding: 2 }}>
                        <Typography variant="h5">Baby Weight Growth Chart</Typography>
                        <GrowthChart type="weight" />
                    </Paper>
                </Grid>
            </Grid>

            {user?.role === "admin" && (
                <Box sx={{ marginTop: 4 }}>
                    <Typography variant="h5">Admin Dashboard</Typography>
                    <Typography variant="body1">Total Registered Members: 500</Typography>
                    <Typography variant="body1">Revenue: $10,000</Typography>
                </Box>
            )}
        </Box>
    );
};

export default Maindashboard;
