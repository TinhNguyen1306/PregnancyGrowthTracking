import React from "react";
import { Line } from "react-chartjs-2";
import { Paper, Typography } from "@mui/material";
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend,
} from "chart.js";

ChartJS.register(
    CategoryScale,
    LinearScale,
    PointElement,
    LineElement,
    Title,
    Tooltip,
    Legend
);

const Growthchart = ({ type }) => {
    const labels = ["Week 10", "Week 15", "Week 20", "Week 25", "Week 30", "Week 35", "Week 40"];
    const heightData = [5, 10, 15, 20, 25, 30, 35];
    const weightData = [0.1, 0.3, 0.5, 1.0, 1.5, 2.5, 3.5];

    const data = {
        labels,
        datasets: [
            {
                label: type === "height" ? "Baby Height (cm)" : "Baby Weight (kg)",
                data: type === "height" ? heightData : weightData,
                borderColor: "#1976d2",
                backgroundColor: "rgba(25, 118, 210, 0.2)",
                fill: true,
            },
        ],
    };

    const options = {
        responsive: true,
        plugins: {
            legend: { position: "top" },
        },
        scales: {
            x: { title: { display: true, text: "Pregnancy Weeks" } },
            y: { title: { display: true, text: type === "height" ? "Height (cm)" : "Weight (kg)" } },
        },
    };

    return (
        <Paper sx={{ padding: 2 }}>
            <Typography variant="h6">
                {type === "height" ? "Baby Height Growth Chart" : "Baby Weight Growth Chart"}
            </Typography>
            <Line data={data} options={options} />
        </Paper>
    );
};

export default Growthchart;