import express from "express";
import userController from "./user.controller.js";
import { protect, restrictTo } from "../../middleware/auth.js";
import { validate } from "../../middleware/validate.js";
import {
    updateMyProfileValidation,
    createUserValidation,
    updateUserValidation,
    userIdParamValidation,
} from "./user.validation.js";
import { UserRole } from "../../utils/role.enum.js";

const userRoutes = express.Router();

userRoutes.use(protect);

// Login user
userRoutes.get("/me", userController.getProfile);

userRoutes.patch(
    "/me",
    validate(updateMyProfileValidation),
    userController.updateMyProfile,
);

userRoutes.get("/", restrictTo(UserRole.Admin), userController.getAllUsers);
userRoutes.post(
    "/",
    restrictTo(UserRole.Admin),
    validate(createUserValidation),
    userController.createUser,
);
userRoutes.put(
    "/:id",
    restrictTo(UserRole.Admin),
    validate([...userIdParamValidation, ...updateUserValidation]),
    userController.updateUser,
);
userRoutes.delete(
    "/:id",
    restrictTo(UserRole.Admin),
    validate(userIdParamValidation),
    userController.deleteUser,
);

// Aggregation
userRoutes.get(
    "/interests/grouped",
    restrictTo(UserRole.Admin),
    userController.getUsersGroupedByInterests,
);

export default userRoutes;
