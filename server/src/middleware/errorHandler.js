import logger from "../config/logger.js";

const errorHandler = (err, req, res, next) => {
    let statusCode = err.statusCode || 500;
    let message = err.message || "Internal server error";
    let errors = err.errors || null;

    // ── Mongoose Validation Error ──
    if (err.name === "ValidationError") {
        statusCode = 400;
        message = Object.values(err.errors)
            .map((e) => e.message)
            .join(", ");
        errors = Object.fromEntries(
            Object.entries(err.errors).map(([key, val]) => [key, val.message]),
        );
    }

    // ── Mongoose Duplicate Key ──
    else if (err.code === 11000) {
        statusCode = 409;
        const field = Object.keys(err.keyValue)[0];
        message = `${field} already exists`;
        errors = { [field]: `${field} already exists` };
    }

    // ── Mongoose Cast Error (invalid ObjectId) ──
    else if (err.name === "CastError") {
        statusCode = 400;
        message = `Invalid ${err.path}: ${err.value}`;
        errors = { [err.path]: `Invalid ${err.path}` };
    }

    // ── Your custom ApiError ──
    else if (err.statusCode) {
        statusCode = err.statusCode;
        message = err.message;
    }

    const status = statusCode >= 400 && statusCode < 500 ? "fail" : "error";

    // Log
    if (process.env.NODE_ENV === "development") {
        logger.warn(`[${statusCode}] ${message}`, {
            path: req.originalUrl,
            method: req.method,
            errors,
        });
    } else {
        logger.error("Application Error:", {
            message,
            path: req.originalUrl,
            method: req.method,
        });
    }

    // Response
    res.status(statusCode).json({
        success: false,
        status,
        message,
        ...(errors && { errors }),
        ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
    });
};

export default errorHandler;
