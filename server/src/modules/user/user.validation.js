import { body, param } from "express-validator";
import { UserRole } from "../../utils/role.enum.js";

export const updateMyProfileValidation = [
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be 2-50 characters"),
    body("interests")
        .optional()
        .isArray({ max: 20 })
        .withMessage("Interests must be an array with max 20 items"),
    body("email").not().exists().withMessage("Email cannot be changed"),
    body("password")
        .not()
        .exists()
        .withMessage("Password cannot be changed here"),
    body("role").not().exists().withMessage("Role cannot be changed"),
];

export const createUserValidation = [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("email").trim().isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("role").optional().isIn(Object.values(UserRole)),
    body("interests")
        .optional()
        .isArray({ max: 100 })
        .withMessage("Interests must be an array with max 15 items"),
];

export const updateUserValidation = [
    param("id").isMongoId().withMessage("Invalid user ID"),
    body("name")
        .optional()
        .trim()
        .isLength({ min: 2, max: 50 })
        .withMessage("Name must be 2-50 characters"),
    body("email")
        .optional()
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Valid email is required"),
    body("password")
        .optional()
        .isLength({ min: 6 })
        .withMessage("Password must be at least 6 characters"),
    body("role")
        .optional()
        .isIn(Object.values(UserRole))
        .withMessage(
            `Role must be one of: ${Object.values(UserRole).join(", ")}`,
        ),
];

export const userIdParamValidation = [
    param("id").isMongoId().withMessage("Invalid user ID"),
];
