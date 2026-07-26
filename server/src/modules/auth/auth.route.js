import express from "express";
import authController from "./auth.controller.js";
import { validate } from "../../middleware/validate.js";
import { registerValidation, loginValidation } from "./auth.validation.js";

const authRoutes = express.Router();

authRoutes.post(
    "/register",
    validate(registerValidation),
    authController.register,
);
authRoutes.post("/login", validate(loginValidation), authController.login);

export default authRoutes;
