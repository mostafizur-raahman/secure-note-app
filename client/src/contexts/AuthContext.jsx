import { createContext, useContext, useState } from "react";
import authService from "../services/authService";

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = useState(authService.getStoredUser());
    const [loading, setLoading] = useState(false);

    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await authService.login(email, password);
            const token = response.data.token;
            const userData = response.data.user;
            authService.saveSession({ token, user: userData });
            setUser(userData);
            return userData;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const register = async (formData) => {
        setLoading(true);
        try {
            const response = await authService.register(formData);
            return response;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    const logout = () => {
        authService.clearSession();
        setUser(null);
    };

    const isAdmin = user?.role === "ADMIN";

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => useContext(AuthContext);
