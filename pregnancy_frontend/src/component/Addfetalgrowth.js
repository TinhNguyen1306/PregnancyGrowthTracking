import React, { useState, useEffect } from "react";
import { Button, Grid, Typography, Box, Paper, TextField, Snackbar, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";

const AddFetalGrowth = ({ onClose, onSuccess }) => {
  const [week, setWeek] = useState("");
  const [weight, setWeight] = useState("");
  const [length, setLength] = useState("");
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [existingWeeks, setExistingWeeks] = useState([]);
  const [subscriptionInfo, setSubscriptionInfo] = useState(null);
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

        const allWeeks = Array.from({ length: 33 }, (_, i) => i + 8);
        const available = allWeeks.filter((w) => !data.existingWeeks.includes(w));

        if (available.length === 0) {
          setError("Bạn đã nhập đầy đủ tất cả các tuần từ 8 đến 40.");
        } else {
          setWeek(available[0]); // Set tuần chưa có đầu tiên
        }
      } catch (error) {
        setError(error.message || "Có lỗi xảy ra!");
      }
    };
    fetchExistingWeeks();
  }, []);

  useEffect(() => {
    const fetchStatusAndWeeks = async () => {
      try {
        const token = localStorage.getItem("userToken");

        // 1. Kiểm tra trạng thái hội viên
        const statusRes = await fetch("http://localhost:5001/api/members/status", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!statusRes.ok) throw new Error("Không thể kiểm tra trạng thái hội viên!");
        const statusData = await statusRes.json();
        setSubscriptionInfo(statusData);

        if (!statusData.isSubscribed) {
          setError("Bạn cần đăng ký gói hội viên để thêm dữ liệu!");
          return;
        }

        // 2. Lấy danh sách tuần đã nhập
        const weeksRes = await fetch("http://localhost:5001/api/fetalgrowth/checkweeks", {
          headers: { Authorization: `Bearer ${token}` },
        });
        if (!weeksRes.ok) throw new Error("Không thể lấy thông tin các tuần đã có!");
        const weeksData = await weeksRes.json();
        setExistingWeeks(weeksData.existingWeeks);

        const allWeeks = Array.from({ length: 33 }, (_, i) => i + 8);
        const available = allWeeks.filter((w) => !weeksData.existingWeeks.includes(w));
        if (available.length === 0) {
          setError("Bạn đã nhập đầy đủ tất cả các tuần từ 8 đến 40.");
        } else {
          setWeek(available[0]);
        }
      } catch (error) {
        setError(error.message || "Có lỗi xảy ra!");
      }
    };

    fetchStatusAndWeeks();
  }, []);

  const availableWeeks = Array.from({ length: 33 }, (_, i) => i + 8).filter((w) => !existingWeeks.includes(w));

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!week || !weight || !length) {
      setError("Vui lòng nhập đầy đủ thông tin!");
      return;
    }

    if (parseFloat(weight) > 3200) {
      setError("Cân nặng không được vượt quá 3200g!");
      return;
    }

    if (parseFloat(length) > 70) {
      setError("Chiều dài không được vượt quá 70cm!");
      return;
    }

    if (!subscriptionInfo?.isSubscribed) {
      setError("Bạn cần có gói hội viên để thêm dữ liệu!");
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
              <TextField
                fullWidth
                label="Tuần Thai"
                value={week}
                InputProps={{
                  readOnly: true,
                }}
                variant="outlined"
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Cân Nặng (g)"
                variant="outlined"
                value={weight}
                onChange={(e) => setWeight(e.target.value)}
                type="number"
                required
                inputProps={{ max: 3200 }}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Chiều Dài (cm)"
                variant="outlined"
                value={length}
                onChange={(e) => setLength(e.target.value)}
                type="number"
                required
                inputProps={{ max: 70 }}
              />
            </Grid>
            <Grid item xs={12}>
              <Button
                fullWidth
                variant="contained"
                color="primary"
                type="submit"
                disabled={Boolean(error)}
                sx={{
                  background: 'linear-gradient(135deg, #FFDEE9 30%, #B5FFFC 100%)',
                  color: '#333', padding: "12px", fontSize: "16px", borderRadius: 4
                }}
              >
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
