import { body, param } from "express-validator";

export const createPostValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 200 }),
    body("content").trim().notEmpty().withMessage("Content is required"),
];

export const updatePostValidation = [
    param("id").isMongoId().withMessage("Invalid post ID"),
    body("title").optional().trim().notEmpty().isLength({ max: 200 }),
    body("content").optional().trim().notEmpty(),
];

export const postIdParamValidation = [
    param("id").isMongoId().withMessage("Invalid post ID"),
];

export const userIdParamValidation = [
    param("userId").isMongoId().withMessage("Invalid user ID"),
];
