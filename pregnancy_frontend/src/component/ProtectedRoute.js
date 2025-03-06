import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const ProtectedRoute = () => {
    const token = localStorage.getItem("token"); // Kiểm tra token trong localStorage

    return token ? <Outlet /> : <Navigate to="/" replace />;
};

export default ProtectedRoute;