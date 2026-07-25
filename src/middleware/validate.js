import { validationResult } from "express-validator";
import ApiError from "../utils/error.js";

export const validate = (validations) => {
    return async (req, res, next) => {
        await Promise.all(validations.map((v) => v.run(req)));

        const errors = validationResult(req);
        if (errors.isEmpty()) return next();

        const extracted = errors.array().map((e) => ({
            field: e.path,
            message: e.msg,
        }));

        const error = new ApiError(400, "Validation failed");
        error.errors = extracted;
        next(error);
    };
};
