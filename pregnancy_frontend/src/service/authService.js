import axios from "axios";

const API_URL = "http://localhost:5001/api/users"; // Thay bằng URL backend của bạn
const API_URL1 = "http://localhost:5001/api/auth";

export const register = async (userData) => {
    try {
        const response = await axios.post(`${API_URL}/register`, userData);
        return response.data;
    } catch (error) {
        throw error.response?.data || "Registration failed";
    }
};

const login = async (email, password) => {
    try {
        const res = await axios.post(`${API_URL}/login`, { email, password });
        if (res.data.token) {
            localStorage.setItem("userToken", res.data.token);
            localStorage.setItem("userInfo", JSON.stringify(res.data.user));
            // Trả về cả token và user
            return {
                token: res.data.token,
                user: res.data.user
            };
        } else {
            console.warn("Login response thiếu token!", res.data);
        }
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error.response?.data || "Login failed";
    }
};

// API đăng nhập bằng Google
const googleLogin = async (idToken) => {
    try {
        const res = await axios.post(`${API_URL1}/google`, { idToken });

        console.log("Google Login response:", res.data);

        if (res.data.token) {
            localStorage.setItem("userToken", res.data.token);
            localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        } else {
            console.warn("Google Login response thiếu token!", res.data);
        }

        return res.data;
    } catch (error) {
        console.error("Google Login failed:", error.response?.data || error.message);
        throw error.response?.data || "Google Login failed";
    }
};

const authService = {
    register,
    login,
    googleLogin, // Thêm API login Google vào đây
};

export default authService;
