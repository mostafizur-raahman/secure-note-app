import mongoose from "mongoose";
import config from "./envConfig.js";

const connect = async () => {
    try {
        mongoose.connection.on("connected", () => {
            console.log("Mongoose connected to MongoDB");
        });

        mongoose.connection.on("error", (err) => {
            console.error("Mongoose connection error:", err);
        });

        mongoose.connection.on("disconnected", () => {
            console.log("Mongoose disconnected from MongoDB");
        });

        await mongoose.connect(config.DATABASE_URL);
        console.log(`MongoDB connected: ${mongoose.connection.host}`);
        return mongoose.connection;
    } catch (error) {
        console.error("MongoDB connection error:", error.message);
        process.exit(1);
    }
};

export default connect;
