import React, { useEffect, useState, useContext } from "react";
import { Box, Paper, Typography, List, ListItem, ListItemText, Divider, CircularProgress, Alert } from "@mui/material";
import { UserContext } from "../context/userContext";

const ReminderList = () => {
    const { userId } = useContext(UserContext);
    const [reminders, setReminders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchReminders = async () => {
            const token = localStorage.getItem("userToken");

            if (!token) {
                setError("Không có token, vui lòng đăng nhập lại.");
                setLoading(false);
                return;
            }

            try {
                const response = await fetch(`http://localhost:5001/api/reminders/user/${userId}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });

                if (!response.ok) throw new Error("Lấy danh sách lịch hẹn thất bại");

                const data = await response.json();
                setReminders(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        if (userId) fetchReminders();
    }, [userId]);

    if (loading) return <Box textAlign="center" mt={4}><CircularProgress /></Box>;
    if (error) return <Alert severity="error">{error}</Alert>;

    return (
        <Box sx={{ maxWidth: 700, margin: "auto", padding: 3 }}>
            <Paper sx={{ padding: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>Danh sách lịch hẹn</Typography>

                {reminders.length === 0 ? (
                    <Typography>Không có lịch hẹn nào.</Typography>
                ) : (
                    <List>
                        {reminders.map((reminder) => (
                            <React.Fragment key={reminder.id}>
                                <ListItem>
                                    <ListItemText
                                        primary={reminder.title}
                                        secondary={
                                            <>
                                                <Typography variant="body2">Loại: {reminder.reminderType}</Typography>
                                                <Typography variant="body2">
                                                    Ngày hẹn: {new Date(reminder.reminderDate).toLocaleString("vi-VN")}
                                                </Typography>
                                            </>
                                        }
                                    />
                                </ListItem>
                                <Divider />
                            </React.Fragment>
                        ))}
                    </List>
                )}
            </Paper>
        </Box>
    );
};

export default ReminderList;
