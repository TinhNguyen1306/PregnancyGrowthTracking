import React from "react";
import {
    Drawer,
    List,
    ListItemIcon,
    ListItemText,
    Typography,
    ListItemButton // Thêm import này 
} from "@mui/material";
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

    // Lấy userRole an toàn hơn
    const userInfo = localStorage.getItem("userInfo");
    let userRole = "";

    try {
        if (userInfo) {
            const parsedInfo = JSON.parse(userInfo);
            userRole = parsedInfo.role || "";
        }
    } catch (error) {
        console.error("Error parsing user info:", error);
    }

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

                {/* Thay đổi tất cả ListItem button thành ListItemButton */}
                <ListItemButton onClick={() => navigate("/dashboard")}>
                    <ListItemIcon sx={{ color: "#fff" }}><DashboardIcon /></ListItemIcon>
                    <ListItemText primary="Dashboard" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/info")}>
                    <ListItemIcon sx={{ color: "#fff" }}><InfoIcon /></ListItemIcon>
                    <ListItemText primary="Thông tin hệ thống" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/profile")}>
                    <ListItemIcon sx={{ color: "#fff" }}><AccountCircleIcon /></ListItemIcon>
                    <ListItemText primary="Quản lý tài khoản" />
                </ListItemButton>

                {/* Nhóm Theo Dõi Thai Kỳ */}
                <Typography sx={{ padding: "10px 16px", fontWeight: "bold", color: "#ffcc00" }}>Theo Dõi Thai Kỳ</Typography>

                <ListItemButton onClick={() => navigate("/update-growth")}>
                    <ListItemIcon sx={{ color: "#fff" }}><MonitorWeightIcon /></ListItemIcon>
                    <ListItemText primary="Cập nhật chỉ số thai nhi" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/growth-chart")}>
                    <ListItemIcon sx={{ color: "#fff" }}><BarChartIcon /></ListItemIcon>
                    <ListItemText primary="Biểu đồ tăng trưởng" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/alerts")}>
                    <ListItemIcon sx={{ color: "#fff" }}><WarningIcon /></ListItemIcon>
                    <ListItemText primary="Cảnh báo phát triển" />
                </ListItemButton>

                {/* Nhóm Nhắc Nhở & Lịch Hẹn */}
                <Typography sx={{ padding: "10px 16px", fontWeight: "bold", color: "#ffcc00" }}>Nhắc Nhở & Lịch Hẹn</Typography>

                <ListItemButton onClick={() => navigate("/appointments")}>
                    <ListItemIcon sx={{ color: "#fff" }}><EventIcon /></ListItemIcon>
                    <ListItemText primary="Lịch khám thai" />
                </ListItemButton>

                <ListItemButton onClick={() => navigate("/reminders")}>
                    <ListItemIcon sx={{ color: "#fff" }}><NotificationsIcon /></ListItemIcon>
                    <ListItemText primary="Nhắc nhở quan trọng" />
                </ListItemButton>

                {/* Nhóm Cộng Đồng */}
                <Typography sx={{ padding: "10px 16px", fontWeight: "bold", color: "#ffcc00" }}>Cộng Đồng</Typography>

                <ListItemButton onClick={() => navigate("/forum")}>
                    <ListItemIcon sx={{ color: "#fff" }}><ForumIcon /></ListItemIcon>
                    <ListItemText primary="Diễn đàn chia sẻ" />
                </ListItemButton>

                {/* Nhóm Admin (Chỉ Hiện Nếu Là Admin) */}
                {userRole === "admin" && (
                    <>
                        <Typography sx={{ padding: "10px 16px", fontWeight: "bold", color: "#ffcc00" }}>Quản Lý Hệ Thống (Admin)</Typography>

                        <ListItemButton onClick={() => navigate("/manage-users")}>
                            <ListItemIcon sx={{ color: "#fff" }}><AdminPanelSettingsIcon /></ListItemIcon>
                            <ListItemText primary="Quản lý thành viên" />
                        </ListItemButton>

                        <ListItemButton onClick={() => navigate("/manage-subscriptions")}>
                            <ListItemIcon sx={{ color: "#fff" }}><MonetizationOnIcon /></ListItemIcon>
                            <ListItemText primary="Quản lý gói phí" />
                        </ListItemButton>

                        <ListItemButton onClick={() => navigate("/reports")}>
                            <ListItemIcon sx={{ color: "#fff" }}><BarChartIcon /></ListItemIcon>
                            <ListItemText primary="Báo cáo & thống kê" />
                        </ListItemButton>
                    </>
                )}
            </List>
        </Drawer>
    );
};

export default Sidebar;