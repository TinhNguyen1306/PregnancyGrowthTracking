import React, { useState, useContext } from "react";
import { TextField, Button, Box, Paper, MenuItem, Typography, Snackbar, Alert } from "@mui/material";
import { UserContext } from "../context/userContext";

const CreateReminder = () => {
    const { userId } = useContext(UserContext);
    const [formData, setFormData] = useState({
        title: "",
        reminderDate: "",
        reminderType: "Appointment",
    });
    const [success, setSuccess] = useState(false);
    const [error, setError] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("userToken");

        if (!token) {
            setError("Không có token, vui lòng đăng nhập lại.");
            return;
        }

        const now = new Date();
        const selectedDate = new Date(formData.reminderDate);
        const diffInMs = selectedDate - now;
        const diffInDays = diffInMs / (1000 * 60 * 60 * 24);

        if (selectedDate < now) {
            setError("Vui lòng không chọn ngày đã qua rồi.");
            return;
        }

        if (diffInDays < 2) {
            setError("Phải đặt lịch trước ít nhất 2 ngày.");
            return;
        }

        try {
            const response = await fetch("http://localhost:5001/api/reminders/create", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(formData),
            });

            if (!response.ok) throw new Error("Tạo lịch hẹn thất bại");

            setSuccess(true);
            setFormData({ title: "", reminderDate: "", reminderType: "Appointment" });
        } catch (err) {
            setError(err.message);
        }
    };


    return (
        <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
            <Paper sx={{ padding: 3, borderRadius: 2 }}>
                <Typography variant="h5" gutterBottom>Tạo Lịch Hẹn</Typography>
                <form onSubmit={handleSubmit}>
                    <TextField
                        fullWidth
                        label="Tiêu đề"
                        name="title"
                        value={formData.title}
                        onChange={handleChange}
                        margin="normal"
                        required
                    />
                    <TextField
                        fullWidth
                        label="Ngày và giờ hẹn"
                        name="reminderDate"
                        type="datetime-local"
                        value={formData.reminderDate}
                        onChange={handleChange}
                        margin="normal"
                        InputLabelProps={{ shrink: true }}
                        required
                    />
                    <TextField
                        fullWidth
                        select
                        label="Loại"
                        name="reminderType"
                        value={formData.reminderType}
                        onChange={handleChange}
                        margin="normal"
                    >
                        <MenuItem value="Appointment">Khám thai</MenuItem>
                        <MenuItem value="Medication">Uống thuốc</MenuItem>
                        <MenuItem value="Test">Xét nghiệm</MenuItem>
                        <MenuItem value="Other">Khác</MenuItem>
                    </TextField>
                    <Button fullWidth type="submit" variant="contained" sx={{ mt: 2 }}>Tạo lịch</Button>
                </form>
            </Paper>

            <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
                <Alert severity="success">Tạo lịch hẹn thành công!</Alert>
            </Snackbar>

            <Snackbar open={Boolean(error)} autoHideDuration={3000} onClose={() => setError("")}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>
        </Box>
    );
};

export default CreateReminder;
