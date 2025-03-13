import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText, Typography } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import InfoIcon from "@mui/icons-material/Info";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";
import MonitorWeightIcon from "@mui/icons-material/MonitorWeight";
import BarChartIcon from "@mui/icons-material/BarChart";
import WarningIcon from "@mui/icons-material/Warning";
import EventIcon from "@mui/icons-material/Event";
import NotificationsIcon from "@mui/icons-material/Notifications";
import ForumIcon from "@mui/icons-material/Forum";
import AdminPanelSettingsIcon from "@mui/icons-material/AdminPanelSettings";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";

const Sidebar = () => {
    const navigate = useNavigate();
    const userRole = localStorage.getItem("userRole"); // "admin" hoặc "user"

    return (
        <Drawer
            variant="permanent"
            sx={{
                width: 240,
                flexShrink: 0,
                "& .MuiDrawer-paper": { width: 240, backgroundColor: "#F48FB1", color: "#fff" }, // Màu hồng đậm
            }}
        >
            <List>
                {/* Nhóm Tính Năng Chung */}
                <Typography sx={{ padding: "10px 16px", fontWeight: "bold", color: "#ffcc00" }}>Tính Năng Chung</Typography>
                <ListItem button onClick={() => navigate("/dashboard")}>
                    <ListItemIcon sx={{ color: "#fff" }}><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItem>
                <ListItem button onClick={() => navigate("/info")}>
                    <ListItemIcon sx={{ color: "#fff" }}><InfoIcon /></ListItemIcon>
                    <ListItemText primary="Thông tin hệ thống" />
                </ListItem>
                <ListItem button onClick={() => navigate("/profile")}>
                    <ListItemIcon sx={{ color: "#fff" }}><AccountCircleIcon /></ListItemIcon>
                    <ListItemText primary="Quản lý tài khoản" />
                </ListItem>

                {/* Nhóm Theo Dõi Thai Kỳ */}
                <Typography sx={{ padding: "10px 16px", fontWeight: "bold", color: "#ffcc00" }}>Theo Dõi Thai Kỳ</Typography>
                <ListItem button onClick={() => navigate("/update-growth")}>
                    <ListItemIcon sx={{ color: "#fff" }}><MonitorWeightIcon /></ListItemIcon>
                    <ListItemText primary="Cập nhật chỉ số thai nhi" />
                </ListItem>
                <ListItem button onClick={() => navigate("/growth-chart")}>
                    <ListItemIcon sx={{ color: "#fff" }}><BarChartIcon /></ListItemIcon>
                    <ListItemText primary="Biểu đồ tăng trưởng" />
                </ListItem>
                <ListItem button onClick={() => navigate("/alerts")}>
                    <ListItemIcon sx={{ color: "#fff" }}><WarningIcon /></ListItemIcon>
                    <ListItemText primary="Cảnh báo phát triển" />
                </ListItem>

                {/* Nhóm Nhắc Nhở & Lịch Hẹn */}
                <Typography sx={{ padding: "10px 16px", fontWeight: "bold", color: "#ffcc00" }}>Nhắc Nhở & Lịch Hẹn</Typography>
                <ListItem button onClick={() => navigate("/appointments")}>
                    <ListItemIcon sx={{ color: "#fff" }}><EventIcon /></ListItemIcon>
                    <ListItemText primary="Lịch khám thai" />
                </ListItem>
                <ListItem button onClick={() => navigate("/reminders")}>
                    <ListItemIcon sx={{ color: "#fff" }}><NotificationsIcon /></ListItemIcon>
                    <ListItemText primary="Nhắc nhở quan trọng" />
                </ListItem>

                {/* Nhóm Cộng Đồng */}
                <Typography sx={{ padding: "10px 16px", fontWeight: "bold", color: "#ffcc00" }}>Cộng Đồng</Typography>
                <ListItem button onClick={() => navigate("/forum")}>
                    <ListItemIcon sx={{ color: "#fff" }}><ForumIcon /></ListItemIcon>
                    <ListItemText primary="Diễn đàn chia sẻ" />
                </ListItem>

                {/* Nhóm Admin (Chỉ Hiện Nếu Là Admin) */}
                {userRole === "admin" && (
                    <>
                        <Typography sx={{ padding: "10px 16px", fontWeight: "bold", color: "#ffcc00" }}>Quản Lý Hệ Thống (Admin)</Typography>
                        <ListItem button onClick={() => navigate("/manage-users")}>
                            <ListItemIcon sx={{ color: "#fff" }}><AdminPanelSettingsIcon /></ListItemIcon>
                            <ListItemText primary="Quản lý thành viên" />
                        </ListItem>
                        <ListItem button onClick={() => navigate("/manage-subscriptions")}>
                            <ListItemIcon sx={{ color: "#fff" }}><MonetizationOnIcon /></ListItemIcon>
                            <ListItemText primary="Quản lý gói phí" />
                        </ListItem>
                        <ListItem button onClick={() => navigate("/reports")}>
                            <ListItemIcon sx={{ color: "#fff" }}><BarChartIcon /></ListItemIcon>
                            <ListItemText primary="Báo cáo & thống kê" />
                        </ListItem>
                    </>
                )}
            </List>
        </Drawer>
    );
};

export default Sidebar;
