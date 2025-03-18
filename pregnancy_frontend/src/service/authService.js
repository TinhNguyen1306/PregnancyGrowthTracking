import axios from 'axios';

const API_URL = 'http://localhost:5001/api/users'; // Thay bằng URL backend của bạn

const register = (email, password, role, phone) => {
    return axios.post(API_URL + '/register', {
        email,
        password,
        role,
        phone,
    });
};

const login = async (email, password) => {
    try {
        const res = await axios.post(API_URL + '/login', { email, password });

        console.log("Login response:", res.data); // Kiểm tra response

        if (res.data.token) {
            localStorage.setItem("userToken", res.data.token);
            localStorage.setItem("userInfo", JSON.stringify(res.data.user));
        } else {
            console.warn("Login response thiếu token!", res.data);
        }

        return res.data;
    } catch (error) {
        console.error("Login failed:", error.response?.data || error.message);
        throw error;
    }
};



const authService = {
    register,
    login,
};

export default authService;