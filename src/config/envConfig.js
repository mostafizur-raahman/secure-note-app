import dotenv from "dotenv";

dotenv.config();

const config = {
    PORT: process.env.PORT,
    DATABASE_URL: process.env.DATABASE_URL,
    JWT_SECRET: process.env.JWT_SECRET,
    NODE_ENV: process.env.NODE_ENV || "development",
    CLIENT_URL: process.env.CLIENT_URL,
    JWT_EXPIRES_IN: process.env.JWT_EXPIRES_IN,
};

export default config;
