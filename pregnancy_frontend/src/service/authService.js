// import axios from 'axios';

// const API_URL = 'http://localhost:3000/api/users'; // Thay bằng URL backend của bạn

// const register = (email, password, role, phone) => {
//     return axios.post(API_URL + '/register', {
//         email,
//         password,
//         role,
//         phone,
//     });
// };

// const login = (email, password) => {
//     return axios.post(API_URL + '/login', {
//         email,
//         password,
//     });
// };

// const authService = {
//     register,
//     login,
// };

// export default authService;
const authService = {
    // Đăng nhập bằng tài khoản cứng
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                // Tài khoản cứng
                const hardcodedUser = {
                    email: "admin@example.com",
                    password: "123456",
                    role: "admin"
                };
                if (email === hardcodedUser.email && password === hardcodedUser.password) {
                    // Lưu token giả vào localStorage
                    localStorage.setItem("authToken", "fake-jwt-token");
                    localStorage.setItem("userRole", hardcodedUser.role);
                    localStorage.setItem("userEmail", hardcodedUser.email);

                    resolve({ data: { token: "fake-jwt-token", user: hardcodedUser } });
                } else {
                    reject({ response: { data: { message: "Invalid email or password" } } });
                }
            }, 1000); // Giả lập delay 1 giây
        });
    },

    // Kiểm tra xem có đang đăng nhập không
    isAuthenticated: () => {
        return localStorage.getItem("authToken") !== null;
    },

    // Lấy role của user
    getUserRole: () => {
        return localStorage.getItem("userRole");
    },

    // Đăng xuất
    logout: () => {
        localStorage.removeItem("authToken");
        localStorage.removeItem("userRole");
        localStorage.removeItem("userEmail");
    }
};

export default authService;
