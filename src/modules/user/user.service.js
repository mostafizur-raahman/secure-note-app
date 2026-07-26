import userRepository from "./user.repository.js";
import ApiError from "../../utils/error.js";

const getProfile = async (userId) => {
    const user = await userRepository.findByIdWithoutPassword(userId);

    if (!user) {
        throw new ApiError(404, "User not found");
    }

    return {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        interests: user.interests,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt,
    };
};

const getAllUsers = async (query = {}) => {
    const { data: users, meta } = await userRepository.findAllUsers({}, query);

    return {
        meta,
        users: users.map((user) => ({
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            interests: user.interests,
            createdAt: user.createdAt,
        })),
    };
};

const createUser = async (userData) => {
    const existing = await userRepository.findUserByEmail(userData.email);
    if (existing) {
        throw new ApiError(409, "User already exists");
    }

    const newUser = await userRepository.createUser(userData);
    return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        createdAt: newUser.createdAt,
    };
};

const updateMyProfile = async (userId, updateData) => {
    // Strip anything the user shouldn't self-update
    const { email, password, role, ...allowedData } = updateData;

    const updatedUser = await userRepository.updateUserById(
        userId,
        allowedData,
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        interests: updatedUser.interests,
        updatedAt: updatedUser.updatedAt,
    };
};

const updateUser = async (userId, updateData) => {
    // Prevent password update through this route
    const { password, ...safeUpdateData } = updateData;

    const updatedUser = await userRepository.updateUserById(
        userId,
        safeUpdateData,
    );

    if (!updatedUser) {
        throw new ApiError(404, "User not found");
    }

    return {
        id: updatedUser._id,
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        updatedAt: updatedUser.updatedAt,
    };
};

const deleteUser = async (userId) => {
    const deletedUser = await userRepository.deleteUserById(userId);

    if (!deletedUser) {
        throw new ApiError(404, "User not found");
    }

    return { message: "User deleted successfully" };
};

const getUsersGroupedByInterests = async (query = {}) => {
    const { interest } = query;
    console.log("aaaaaaaaaaaaaaaaa", interest);
    return await userRepository.getUsersGroupedByInterests(interest || null);
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
