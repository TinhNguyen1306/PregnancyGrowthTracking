// MainDashboard.js
import React from "react";
import { Box, Typography, Paper } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts";

const growthData = [
    { week: 4, weight: 0.2, height: 0.5 },
    { week: 8, weight: 1.2, height: 2.5 },
    { week: 12, weight: 3.5, height: 5.4 },
    { week: 16, weight: 6.7, height: 10 },
    { week: 20, weight: 10.5, height: 15.5 },
    { week: 24, weight: 20.5, height: 30 },
];

const Maindashboard = () => {
    return (
        <Box sx={{ flexGrow: 1, p: 3 }}>
            <Paper sx={{ p: 2 }}>
                <Typography variant="h5">Biểu đồ phát triển của thai kỳ</Typography>
                <LineChart width={600} height={300} data={growthData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="week" label={{ value: "Tuần thai kỳ", position: "insideBottom", offset: -5 }} />
                    <YAxis label={{ value: "Trọng lượng (g) & Chiều cao (cm)", angle: -90, position: "insideLeft" }} />
                    <Tooltip />
                    <Legend />
                    <Line type="monotone" dataKey="weight" stroke="#8884d8" name="Cân nặng (g)" />
                    <Line type="monotone" dataKey="height" stroke="#82ca9d" name="Chiều cao (cm)" />
                </LineChart>
            </Paper>
        </Box>
    );
};

export default Maindashboard;
