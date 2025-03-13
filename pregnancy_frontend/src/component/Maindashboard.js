// MainDashboard.js
import React from "react";
import { Box, Paper, Typography, Grid } from "@mui/material";
import GrowthChart from "./Growthchart";
//import PregnancyTimeline from "./PregnancyTimeline";

const Maindashboard = () => {
    const userEmail = localStorage.getItem("userEmail");
    const userRole = localStorage.getItem("userRole");
    const pregnancyWeek = 20; // Mock data
    const babyWeight = "0.5 kg";
    const babyHeight = "25 cm";
    const healthStatus = "Normal";

    return (
        <Box sx={{ padding: 3 }}>
            <Typography variant="h4" sx={{ marginBottom: 2 }}>Welcome, {userEmail}!</Typography>
            <Typography variant="h6">Pregnancy Week: {pregnancyWeek}</Typography>
            <Typography variant="body1">Baby Weight: {babyWeight}</Typography>
            <Typography variant="body1">Baby Height: {babyHeight}</Typography>
            <Typography variant="body1">Health Status: {healthStatus}</Typography>

            {/* <PregnancyTimeline /> */}

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

            {userRole === "admin" && (
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