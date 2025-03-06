import axios from 'axios';

const API_URL = 'http://localhost:3000/api/users'; // Thay bằng URL backend của bạn

const register = (email, password, role, phone) => {
    return axios.post(API_URL + '/register', {
        email,
        password,
        role,
        phone,
    });
};

const login = (email, password) => {
    return axios.post(API_URL + '/login', {
        email,
        password,
    });
};

const authService = {
    register,
    login,
};

export default authService;