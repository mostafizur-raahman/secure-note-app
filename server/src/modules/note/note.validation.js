import { body, param } from "express-validator";

export const createNoteValidation = [
    body("title")
        .trim()
        .notEmpty()
        .withMessage("Title is required")
        .isLength({ max: 200 })
        .withMessage("Title cannot exceed 200 characters"),
    body("content").trim().notEmpty().withMessage("Content is required"),
];

export const updateNoteValidation = [
    param("id").isMongoId().withMessage("Invalid note ID"),
    body("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Title cannot be empty")
        .isLength({ max: 200 }),
    body("content")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Content cannot be empty"),
];

export const noteIdParamValidation = [
    param("id").isMongoId().withMessage("Invalid note ID"),
];
