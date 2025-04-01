import React, { useState, useEffect, useContext } from "react";
import { Grid, Box, Paper, TextField, Button, Typography, FormControl, InputLabel, Select, MenuItem, Snackbar, Alert } from "@mui/material";
import { UserContext } from "../context/userContext";

const UpdateFetalGrowth = ({ onClose, initialData }) => {
    const { userId } = useContext(UserContext);
    const [formData, setFormData] = useState({
        weight: initialData?.weight || "",
        length: initialData?.length || "",
        date: initialData?.date || "",
        week: initialData?.week || "",
    });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(false);
    const [existingWeeks, setExistingWeeks] = useState([]);

    useEffect(() => {
        const fetchExistingWeeks = async () => {
            try {
                const token = localStorage.getItem("userToken");
                const response = await fetch("http://localhost:5001/api/fetalgrowth/checkweeks", {
                    method: "GET",
                    headers: { Authorization: `Bearer ${token}` },
                });
                if (!response.ok) throw new Error("Không thể lấy thông tin các tuần đã có!");

                const data = await response.json();
                setExistingWeeks(data.existingWeeks);
            } catch (error) {
                setError(error.message || "Có lỗi xảy ra!");
            }
        };
        fetchExistingWeeks();
    }, []);

    useEffect(() => {
        if (formData.week) {
            const fetchFetalGrowthData = async () => {
                try {
                    const token = localStorage.getItem("userToken");
                    const response = await fetch(`http://localhost:5001/api/fetalgrowth/week/${formData.week}`, {
                        method: "GET",
                        headers: { Authorization: `Bearer ${token}` },
                    });
                    if (!response.ok) throw new Error("Không thể lấy dữ liệu cho tuần này!");

                    const data = await response.json();
                    // Update formData with fetched data
                    setFormData((prev) => ({
                        ...prev,
                        weight: data.weight || "",
                        length: data.length || "",
                    }));
                } catch (error) {
                    setError(error.message || "Có lỗi xảy ra khi lấy dữ liệu!");
                }
            };

            fetchFetalGrowthData();
        }
    }, [formData.week]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!userId) {
            setError("Lỗi: Không tìm thấy userId trong context.");
            return;
        }
        if (!initialData?.id) {
            setError("Lỗi: Không tìm thấy ID của dữ liệu cần cập nhật.");
            return;
        }
        if (!formData.week || !formData.weight || !formData.length || !formData.date) {
            setError("Vui lòng nhập đầy đủ thông tin!");
            return;
        }

        try {
            const token = localStorage.getItem("userToken");
            const response = await fetch(`http://localhost:5001/api/fetalgrowth/update/${initialData.id}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    ...formData,
                    userId,
                }),
            });

            if (!response.ok) throw new Error("Cập nhật không thành công!");

            setSuccess(true);
            setTimeout(() => {
                onClose();
            }, 1000);
        } catch (error) {
            setError(error.message);
        }
    };

    return (
        <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
            <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
                <Typography variant="h4" gutterBottom align="center">
                    Cập Nhật Chỉ Số Thai Nhi
                </Typography>
                <form onSubmit={handleSubmit}>
                    <Grid container spacing={3}>
                        <Grid item xs={12}>
                            <FormControl fullWidth>
                                <InputLabel>Tuần Thai</InputLabel>
                                <Select value={formData.week} onChange={handleChange} name="week">
                                    {existingWeeks.length === 0 ? (
                                        <MenuItem disabled>Không có tuần nào đã có dữ liệu</MenuItem>
                                    ) : (
                                        existingWeeks.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)
                                    )}
                                </Select>
                            </FormControl>
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Cân Nặng (g)"
                                variant="outlined"
                                name="weight"
                                value={formData.weight}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                        </Grid>
                        <Grid item xs={12}>
                            <TextField
                                fullWidth
                                label="Chiều Dài (cm)"
                                variant="outlined"
                                name="length"
                                value={formData.length}
                                onChange={handleChange}
                                type="number"
                                required
                            />
                        </Grid>

                        <Grid item xs={12}>
                            <Button
                                fullWidth
                                variant="contained"
                                color="primary"
                                type="submit"
                                sx={{ padding: "12px", fontSize: "16px", borderRadius: 4 }}
                            >
                                Cập Nhật
                            </Button>
                        </Grid>
                    </Grid>
                </form>
            </Paper>

            {/* Snackbar hiển thị lỗi */}
            <Snackbar open={Boolean(error)} autoHideDuration={3000} onClose={() => setError(null)}>
                <Alert severity="error">{error}</Alert>
            </Snackbar>

            {/* Snackbar hiển thị thành công */}
            <Snackbar open={success} autoHideDuration={2000} onClose={() => setSuccess(false)}>
                <Alert severity="success">Cập nhật thành công!</Alert>
            </Snackbar>
        </Box>
    );
};

export default UpdateFetalGrowth;
