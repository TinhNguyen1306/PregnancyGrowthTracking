import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, Box, Paper, MenuItem, Select, FormControl, InputLabel, TextField, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddFetalGrowth = ({ onClose, onSuccess }) => {
  const [week, setWeek] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [existingWeeks, setExistingWeeks] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchExistingWeeks = async () => {
      try {
        const token = localStorage.getItem("userToken");
        const response = await fetch("http://localhost:5001/api/fetalgrowth/checkweeks", {
          method: "GET",
          headers: { "Authorization": `Bearer ${token}` },
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

  const availableWeeks = Array.from({ length: 33 }, (_, i) => i + 8).filter((w) => !existingWeeks.includes(w));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!week || !weight || !length) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    try {
      const token = localStorage.getItem("userToken");
      const response = await fetch("http://localhost:5001/api/fetalgrowth/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`,
        },
        body: JSON.stringify({ week, weight, length }),
      });

      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(errorMessage || "Thêm thông tin không thành công!");
      }

      setSuccess(true);
      setTimeout(() => {
        if (onClose) onClose();
        if (onSuccess) onSuccess(); // Gọi callback để làm mới dữ liệu
        else navigate("/growth-chart");
      }, 1000);
    } catch (error) {
      setError(error.message || "Có lỗi xảy ra!");
    }
  };

  return (
    <Box sx={{ maxWidth: 600, margin: "auto", padding: 3 }}>
      <Paper sx={{ padding: 3, borderRadius: 2, boxShadow: 3 }}>
        <Typography variant="h4" gutterBottom align="center">Thêm Chỉ Số Thai Nhi</Typography>
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <FormControl fullWidth disabled={availableWeeks.length === 0}>
                <InputLabel>Tuần Thai</InputLabel>
                <Select value={week} onChange={(e) => setWeek(e.target.value)}>
                  {availableWeeks.length === 0 ? (
                    <MenuItem disabled>Không còn tuần nào khả dụng</MenuItem>
                  ) : (
                    availableWeeks.map((w) => <MenuItem key={w} value={w}>{w}</MenuItem>)
                  )}
                </Select>
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Cân Nặng (g)" variant="outlined" value={weight} onChange={(e) => setWeight(e.target.value)} type="number" required />
            </Grid>
            <Grid item xs={12}>
              <TextField fullWidth label="Chiều Dài (cm)" variant="outlined" value={length} onChange={(e) => setLength(e.target.value)} type="number" required />
            </Grid>
            <Grid item xs={12}>
              <Button fullWidth variant="contained" color="primary" type="submit" sx={{ padding: "12px", fontSize: "16px", borderRadius: 4 }}>
                Lưu Nội Dung
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
        <Alert severity="success">Thêm dữ liệu thành công!</Alert>
      </Snackbar>
    </Box>
  );
};

export default AddFetalGrowth;
