import React from "react";
import authService from "../services/authService";

const AuthContext = React.createContext();

export function AuthProvider({ children }) {
    const [user, setUser] = React.useState(authService.getStoredUser());
    const [loading, setLoading] = React.useState(false);

    // Login response: { success, message, data: { token, user } }
    const login = async (email, password) => {
        setLoading(true);
        try {
            const response = await authService.login(email, password);
            const token = response.data.token;
            const userData = response.data.user;
            authService.saveSession({ token, user: userData });
            setUser(userData);
            return response;
        } catch (err) {
            throw err;
        } finally {
            setLoading(false);
        }
    };

    // Register does NOT return a token — just redirects to login
    const register = async (formData) => {
        setLoading(true);
        try {
            const response = await authService.register(formData);
            // No token in register response, just return success
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

    // Role is "ADMIN" or "USER" (uppercase)
    const isAdmin = user?.role === "ADMIN";

    return (
        <AuthContext.Provider
            value={{ user, login, register, logout, loading, isAdmin }}>
            {children}
        </AuthContext.Provider>
    );
}

export const useAuth = () => React.useContext(AuthContext);
