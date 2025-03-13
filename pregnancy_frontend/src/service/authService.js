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
    login: async (email, password) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email === "test@example.com" && password === "123456") {
                    resolve({ data: { token: "fake-jwt-token" } });
                } else {
                    reject({ response: { data: { message: "Invalid email or password" } } });
                }
            }, 1000); // Giả lập delay 1 giây
        });
    },

    register: async (fullName, dob, email, password, role, phone) => {
        return new Promise((resolve, reject) => {
            setTimeout(() => {
                if (email !== "existing@example.com") {
                    resolve({ data: { token: "fake-jwt-token" } });
                } else {
                    reject({ response: { data: { message: "Email already registered" } } });
                }
            }, 1000);
        });
    }
};

export default authService;
