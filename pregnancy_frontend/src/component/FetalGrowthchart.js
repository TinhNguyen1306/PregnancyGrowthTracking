import React, { useEffect, useState } from "react";
import { Box, Typography, Grid, CircularProgress, Button, Alert } from "@mui/material";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";

const referenceData = [
    { week: 8, length: 1.6, weight: 1 },
    { week: 9, length: 2.3, weight: 2 },
    { week: 10, length: 3.1, weight: 4 },
    { week: 11, length: 4.1, weight: 7 },
    { week: 12, length: 5.4, weight: 14 },
    { week: 13, length: 7.4, weight: 23 },
    { week: 14, length: 8.7, weight: 43 },
    { week: 15, length: 10.1, weight: 70 },
    { week: 16, length: 11.6, weight: 100 },
    { week: 17, length: 13.0, weight: 140 },
    { week: 18, length: 14.2, weight: 190 },
    { week: 19, length: 15.3, weight: 240 },
    { week: 20, length: 16.4, weight: 330 },
    { week: 21, length: 25.6, weight: 360 },
    { week: 22, length: 27.8, weight: 430 },
    { week: 23, length: 28.9, weight: 501 },
    { week: 24, length: 30.0, weight: 600 },
    { week: 25, length: 34.6, weight: 660 },
    { week: 26, length: 35.6, weight: 760 },
    { week: 27, length: 36.6, weight: 875 },
    { week: 28, length: 37.6, weight: 1005 },
    { week: 29, length: 39.0, weight: 1200 },
    { week: 30, length: 40.5, weight: 1400 },
    { week: 31, length: 41.8, weight: 1600 },
    { week: 32, length: 43.0, weight: 1800 },
    { week: 33, length: 44.1, weight: 2000 },
    { week: 34, length: 45.3, weight: 2200 },
    { week: 35, length: 46.3, weight: 2500 },
    { week: 36, length: 47.3, weight: 2700 },
    { week: 37, length: 48.3, weight: 2800 },
    { week: 38, length: 49.3, weight: 2900 },
    { week: 39, length: 50.1, weight: 3000 },
    { week: 40, length: 51.0, weight: 3200 }
];

const FetalGrowthChart = () => {
    const [growthData, setGrowthData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [alertMessage, setAlertMessage] = useState("");

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
            } catch (error) {
                console.error("Error fetching fetal growth data:", error);
                setError("Không thể tải dữ liệu tăng trưởng thai nhi");
            } finally {
                setLoading(false);
            }
        };
        fetchGrowthData();
    }, []);

    // Gộp dữ liệu từ API với dữ liệu tham chiếu
    const mergedData = referenceData.map(ref => {
        const actual = growthData.find(g => Number(g.gestationalAge) === Number(ref.week));
        return {
            gestationalAge: ref.week,  // Dùng ref.week thay vì actual.gestationalAge
            weight: actual ? actual.weight : null,
            length: actual ? actual.length : null
        };
    });

    console.log("Merged Data:", mergedData); // Log ra để kiểm tra

    useEffect(() => {
        let issues = [];

        growthData.forEach(entry => {
            const reference = referenceData.find(ref => ref.week === entry.gestationalAge);
            if (reference) {
                let issueMessage = `Tuần ${entry.gestationalAge}: `;

                let weightIssue = Math.abs(entry.weight - reference.weight) > 200;
                let lengthIssue = Math.abs(entry.length - reference.length) > 5;

                if (weightIssue && lengthIssue) {
                    issueMessage += "Cân nặng và chiều dài của thai nhi đều phát triển không tốt.";
                } else if (weightIssue) {
                    issueMessage += "Cân nặng của thai nhi phát triển không tốt.";
                } else if (lengthIssue) {
                    issueMessage += "Chiều dài của thai nhi phát triển không tốt.";
                }

                if (weightIssue || lengthIssue) {
                    issues.push(issueMessage);
                }
            }
        });

        // Sử dụng '\n' để xuống dòng giữa các thông báo
        setAlertMessage(issues.length > 0 ? issues.join("\n") : "");
    }, [growthData]);


    if (loading) {
        return <CircularProgress />;
    }
    if (error) {
        return <Typography color="error">{error}</Typography>;
    }

    return (
        <Box>
            {alertMessage && (
                <Alert severity="warning" sx={{ marginBottom: 2 }}>
                    {alertMessage}
                    <Button variant="outlined" color="secondary" sx={{ marginLeft: 2 }}>
                        Đặt lịch tư vấn
                    </Button>
                </Alert>
            )}

            <Grid container spacing={3}>
                <Grid item xs={12} md={6}>
                    <Typography variant="h6" align="center">Cân nặng thai nhi</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={mergedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="gestationalAge"
                                label={{
                                    value: "Tuần thai", // Chú thích cột X
                                    position: "insideBottom",
                                    offset: 0 // Điều chỉnh vị trí cho dễ nhìn
                                }}
                            />
                            <YAxis
                                label={{
                                    value: "Cân nặng (g)", // Chú thích cột Y
                                    angle: -90,
                                    position: "insideLeft",
                                    offset: 0

                                }}
                            />
                            <Tooltip
                                formatter={(value, name) => [`${value} ${name.includes("Cân nặng") ? "g" : "cm"}`, name]}
                                labelFormatter={(label, payload) => {
                                    if (payload && payload.length > 0) {
                                        // Kiểm tra nếu có gestationalAge hoặc week
                                        const gestationalAge = payload[0]?.payload?.gestationalAge;
                                        const week = payload[0]?.payload?.week;

                                        // Nếu có gestationalAge, dùng nó, nếu không có thì dùng week
                                        const weekToDisplay = gestationalAge !== undefined ? gestationalAge : week;

                                        return `Tuần ${weekToDisplay !== undefined ? weekToDisplay : "Không xác định"}`;
                                    }
                                    return `Tuần ${label || "Không xác định"}`;
                                }}
                            />

                            <Legend layout="horizontal" align="center" verticalAlign="bottom" />
                            <Line type="monotone" dataKey="weight" stroke="#8884d8" strokeWidth={2} name="Cân nặng thực tế" />
                            <Line type="monotone" data={referenceData} dataKey="weight" stroke="#FF0000" strokeWidth={2} dot={false} name="Cân nặng chuẩn" />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>

                <Grid item xs={12} md={6}>
                    <Typography variant="h6" align="center">Chiều dài thai nhi</Typography>
                    <ResponsiveContainer width="100%" height={400}>
                        <LineChart data={mergedData}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis
                                dataKey="gestationalAge"
                                label={{
                                    value: "Tuần thai", // Chú thích cột X
                                    position: "insideBottom",
                                    offset: 0 // Điều chỉnh vị trí cho dễ nhìn
                                }}

                            />
                            <YAxis
                                label={{
                                    value: "Chiều dài (cm)", // Chú thích cột Y
                                    angle: -90,
                                    position: "insideLeft",
                                    offset: 10
                                }}
                                domain={[0, 70]}
                            />
                            <Tooltip
                                formatter={(value, name) => [`${value} ${name.includes("Cân nặng") ? "g" : "cm"}`, name]}
                                labelFormatter={(label, payload) => {
                                    if (payload && payload.length > 0) {
                                        // Kiểm tra nếu có gestationalAge hoặc week
                                        const gestationalAge = payload[0]?.payload?.gestationalAge;
                                        const week = payload[0]?.payload?.week;

                                        // Nếu có gestationalAge, dùng nó, nếu không có thì dùng week
                                        const weekToDisplay = gestationalAge !== undefined ? gestationalAge : week;

                                        return `Tuần ${weekToDisplay !== undefined ? weekToDisplay : "Không xác định"}`;
                                    }
                                    return `Tuần ${label || "Không xác định"}`;
                                }}
                            />
                            <Legend wrapperStyle={{ marginTop: 10 }} />
                            <Line type="monotone" dataKey="length" stroke="#82ca9d" strokeWidth={2} name="Chiều dài thực tế" />
                            <Line type="monotone" data={referenceData} dataKey="length" stroke="#FF0000" strokeWidth={2} dot={false} name="Chiều dài chuẩn" />
                        </LineChart>
                    </ResponsiveContainer>
                </Grid>
            </Grid>
        </Box>
    );
};

export default FetalGrowthChart;
