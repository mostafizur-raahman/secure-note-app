import api from "./api";
import CONFIG from "../config";

const authService = {
    login: (email, password) => api.post("/auth/login", { email, password }),
    register: (data) => api.post("/auth/register", data),
    saveSession: (data) => {
        localStorage.setItem(CONFIG.TOKEN_KEY, data.token);
        localStorage.setItem(CONFIG.USER_KEY, JSON.stringify(data.user));
    },
    getStoredUser: () => {
        try {
            return JSON.parse(localStorage.getItem(CONFIG.USER_KEY));
        } catch {
            return null;
        }
    },
    clearSession: () => {
        localStorage.removeItem(CONFIG.TOKEN_KEY);
        localStorage.removeItem(CONFIG.USER_KEY);
    },
};

export default authService;
