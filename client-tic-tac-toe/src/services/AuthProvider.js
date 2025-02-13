import { jwtDecode } from "jwt-decode"; // ✅ Forma correcta



const isAuthenticated = () => !!localStorage.getItem('token');

const setToken = (token) => {
    localStorage.setItem('token', token);
};

const removeToken = () => {
    localStorage.removeItem('token');
};

const getUserIdentity = () => {
    const token = localStorage.getItem('token');
    return token ? jwtDecode(token) : null;
};

export { isAuthenticated, setToken, removeToken, getUserIdentity };
