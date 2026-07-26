import { body } from "express-validator";

export const registerValidation = [
    body("name").trim().notEmpty(),
    body("email").trim().isEmail().normalizeEmail(),
    body("password").isLength({ min: 6 }),
    body("interests")
        .optional()
        .isArray({ max: 20 })
        .withMessage("Interests must be an array"),
];
export const loginValidation = [
    body("email")
        .trim()
        .isEmail()
        .normalizeEmail()
        .withMessage("Valid email is required"),
    body("password").notEmpty().withMessage("Password is required"),
];
