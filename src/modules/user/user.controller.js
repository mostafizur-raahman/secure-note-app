import userService from "./user.service.js";

export const getProfile = async (req, res, next) => {
    try {
        const userData = await userService.getProfile(req.user.id);
        res.status(200).json({
            success: true,
            data: userData,
        });
    } catch (error) {
        next(error);
    }
};

export const getAllUsers = async (req, res, next) => {
    try {
        const usersData = await userService.getAllUsers(req.query);
        res.status(200).json({
            success: true,
            ...usersData,
        });
    } catch (error) {
        next(error);
    }
};

export const createUser = async (req, res, next) => {
    try {
        const userData = await userService.createUser(req.body);
        res.status(201).json({
            success: true,
            message: "User created successfully",
            data: userData,
        });
    } catch (error) {
        next(error);
    }
};

export const updateUser = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateUser(
            req.params.id,
            req.body,
        );
        res.status(200).json({
            success: true,
            message: "User updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

export const updateMyProfile = async (req, res, next) => {
    try {
        const updatedUser = await userService.updateMyProfile(
            req.user.id,
            req.body,
        );
        res.status(200).json({
            success: true,
            message: "Profile updated successfully",
            data: updatedUser,
        });
    } catch (error) {
        next(error);
    }
};

export const deleteUser = async (req, res, next) => {
    try {
        await userService.deleteUser(req.params.id);
        res.status(200).json({
            success: true,
            message: "User deleted successfully",
        });
    } catch (error) {
        next(error);
    }
};

export const getUsersGroupedByInterests = async (req, res, next) => {
    try {
        const data = await userService.getUsersGroupedByInterests(req.query);
        res.status(200).json({
            success: true,
            data,
        });
    } catch (error) {
        next(error);
    }
};

export default {
    getProfile,
    getAllUsers,
    createUser,
    updateUser,
    deleteUser,
    getUsersGroupedByInterests,
    updateMyProfile,
};
