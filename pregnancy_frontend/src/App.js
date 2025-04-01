import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Checkout from "./pages/Checkout";
import Home from "./pages/Home";
import Showsubscribed from "./pages/Showsubscribed";
import { UserProvider } from "./context/userContext";
import { GoogleOAuthProvider } from "@react-oauth/google";

function App() {

  return (
    <GoogleOAuthProvider clientId="833757814187-7qlcgsopff81erpsmqkmhi79c0tul9p0.apps.googleusercontent.com">
      <Router>
        <UserProvider>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/checkout/:planId" element={<Checkout />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/showsubscribed" element={<Showsubscribed />} />
          </Routes>
        </UserProvider>
      </Router>
    </GoogleOAuthProvider>
  );
}

export default App;
