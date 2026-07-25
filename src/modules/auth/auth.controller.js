import authService from "./auth.service.js";

const login = async (req, res, next) => {
    try {
        const authData = await authService.login(req.body);
        res.status(200).json({
            success: true,
            message: "Login successful",
            data: authData,
        });
    } catch (error) {
        next(error);
    }
};
const register = async (req, res, next) => {
    try {
        const userData = await authService.register(req.body);
        res.status(201).json({
            success: true,
            message: "User registered successfully",
            data: userData,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    login,
    register,
};
