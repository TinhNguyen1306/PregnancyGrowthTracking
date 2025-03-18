import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import { UserProvider } from "./context/userContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {

  return (
    <GoogleOAuthProvider clientId="833757814187-7qlcgsopff81erpsmqkmhi79c0tul9p0.apps.googleusercontent.com">
      <UserProvider>
        <Router>
          <Routes>
            {/* Khi vào "/", tự động chuyển hướng đến Dashboard */}
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
          </Routes>
        </Router>
      </UserProvider>
    </GoogleOAuthProvider>
  );
}

export default App;
