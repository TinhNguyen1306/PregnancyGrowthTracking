import React, { useEffect, useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";
import { CircularProgress, Typography, Box } from "@mui/material"; // Thêm import từ MUI
const FetalGrowthChart = () => {
    const [growthData, setGrowthData] = useState([]);
    const [loading, setLoading] = useState(true); // Thêm state loading
    const [error, setError] = useState(null); // Thêm state error
    useEffect(() => {
        const fetchGrowthData = async () => {
            const token = localStorage.getItem("userToken");

            if (!token) {
                setError("Bạn cần đăng nhập để xem biểu đồ tăng trưởng");
                setLoading(false);
                return;
            }
            try {
                const response = await fetch("http://localhost:5001/api/fetalgrowth/motherId", {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                });
                if (!response.ok) {
                    throw new Error(`Failed to fetch data: ${response.status}`);
                }
                const data = await response.json();
                setGrowthData(data.sort((a, b) => a.gestationalAge - b.gestationalAge));
                setError(null);
            } catch (error) {
                console.error("Error fetching fetal growth data:", error);
                setError("Không thể tải dữ liệu tăng trưởng thai nhi");
            } finally {
                setLoading(false);
            }
        };
        fetchGrowthData();
    }, []);
    // Hiển thị loading spinner khi đang tải dữ liệu
    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <CircularProgress />
            </Box>
        );
    }
    // Hiển thị thông báo lỗi nếu có
    if (error) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography color="error">{error}</Typography>
            </Box>
        );
    }
    // Hiển thị thông báo nếu không có dữ liệu
    if (growthData.length === 0) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: 400 }}>
                <Typography>Chưa có dữ liệu tăng trưởng thai nhi. Hãy cập nhật thông tin thai kỳ.</Typography>
            </Box>
        );
    }
    // Hiển thị biểu đồ nếu có dữ liệu
    return (
        <ResponsiveContainer width="100%" height={400}>
            <LineChart data={growthData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="gestationalAge" label={{ value: "Tuần thai", position: "insideBottom", offset: -5 }} />
                <YAxis label={{ value: "Cân nặng (g)", angle: -90, position: "insideLeft" }} />
                <Tooltip />
                <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} />
            </LineChart>
        </ResponsiveContainer>
    );
};
export default FetalGrowthChart;