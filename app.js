import express from "express";
import cors from "cors";
import morgan from "morgan";
import cookieParser from "cookie-parser";
import errorHandler from "./src/middleware/errorHandler.js";
import logger from "./src/config/logger.js";
import userRoutes from "./src/modules/user/user.route.js";
import connect from "./src/config/database.js";
import authRoutes from "./src/modules/auth/auth.route.js";
const app = express();

// Database Connection
connect();

// middleware
app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(express.urlencoded({ extended: true }));

// LOGGING
app.use(morgan("combined", { stream: logger.stream }));

// Routing middleware
app.use("/api/v1/users", userRoutes);
app.use("/api/v1/auth", authRoutes);

// Health-check
app.get("/health", (req, res) => {
    res.json({
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        memory: process.memoryUsage(),
    });
});

// 404
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        status: "fail",
        message: `Cannot ${req.method} ${req.originalUrl}`,
    });
});

app.use(errorHandler);

export default app;
