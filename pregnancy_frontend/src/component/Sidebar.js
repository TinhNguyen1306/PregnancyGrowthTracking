// Sidebar.js
import React from "react";
import { Drawer, List, ListItem, ListItemIcon, ListItemText } from "@mui/material";
import { useNavigate } from "react-router-dom";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PersonIcon from "@mui/icons-material/Person";
import EventNoteIcon from "@mui/icons-material/EventNote";
import BarChartIcon from "@mui/icons-material/BarChart";
import WarningIcon from "@mui/icons-material/Warning";
import ForumIcon from "@mui/icons-material/Forum";
import PaymentIcon from "@mui/icons-material/Payment";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";

const Sidebar = () => {
    const navigate = useNavigate();

    return (
        <Drawer
            variant="permanent"
            sx={{ width: 240, flexShrink: 0, "& .MuiDrawer-paper": { width: 240, boxSizing: "border-box" } }}
        >
            <List>
                <ListItem button onClick={() => navigate("/dashboard")}> <ListItemIcon><DashboardIcon /></ListItemIcon> <ListItemText primary="Tổng quan" /> </ListItem>
                <ListItem button onClick={() => navigate("/profile")}> <ListItemIcon><PersonIcon /></ListItemIcon> <ListItemText primary="Hồ sơ cá nhân" /> </ListItem>
                <ListItem button onClick={() => navigate("/journal")}> <ListItemIcon><EventNoteIcon /></ListItemIcon> <ListItemText primary="Nhật ký thai kỳ" /> </ListItem>
                <ListItem button onClick={() => navigate("/growth")}> <ListItemIcon><BarChartIcon /></ListItemIcon> <ListItemText primary="Theo dõi tăng trưởng" /> </ListItem>
                <ListItem button onClick={() => navigate("/alerts")}> <ListItemIcon><WarningIcon /></ListItemIcon> <ListItemText primary="Cảnh báo sức khỏe" /> </ListItem>
                <ListItem button onClick={() => navigate("/community")}> <ListItemIcon><ForumIcon /></ListItemIcon> <ListItemText primary="Chia sẻ & Cộng đồng" /> </ListItem>
                <ListItem button onClick={() => navigate("/membership")}> <ListItemIcon><PaymentIcon /></ListItemIcon> <ListItemText primary="Gói thành viên & Thanh toán" /> </ListItem>
                <ListItem button onClick={() => navigate("/settings")}> <ListItemIcon><SettingsIcon /></ListItemIcon> <ListItemText primary="Cài đặt hệ thống" /> </ListItem>
                <ListItem button onClick={() => navigate("/login")}> <ListItemIcon><LogoutIcon /></ListItemIcon> <ListItemText primary="Đăng xuất" /> </ListItem>
            </List>
        </Drawer>
    );
};

export default Sidebar;
