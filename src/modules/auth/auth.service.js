import jwt from "jsonwebtoken";
import config from "../../config/envConfig.js";
import userRepository from "../user/user.repository.js";
import ApiError from "../../utils/error.js";
import bcrypt from "bcryptjs";
import { UserRole } from "../../utils/role.enum.js";

const register = async (userData) => {
    const { name, email, password, role, interests } = userData;

    const existingUser = await userRepository.findUserByEmail(email);
    if (existingUser) {
        throw new ApiError(409, "User already exists");
    }

    const newUser = await userRepository.createUser({
        name,
        email,
        password,
        role: role || UserRole.User,
        ...(interests && { interests }),
    });

    return {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        role: newUser.role,
        interests: newUser.interests || [],
        createdAt: newUser.createdAt,
    };
};

const login = async (credentials) => {
    const { email, password } = credentials;

    const user = await userRepository.findUserByEmail(email);

    if (!user) {
        throw new ApiError(401, "Invalid email or password");
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        throw new ApiError(401, "Invalid email or password");
    }

    const token = jwt.sign(
        {
            id: user._id,
            email: user.email,
            role: user.role,
        },
        config.JWT_SECRET,
        {
            expiresIn: config.JWT_EXPIRES_IN,
        },
    );

    return {
        token,
        user: {
            id: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
        },
    };
};

export default {
    register,
    login,
};
