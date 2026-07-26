import http from "http";
import app from "./app.js";
import config from "./src/config/envConfig.js";

const PORT = config.PORT;

const server = http.createServer(app);

server.listen(PORT, "0.0.0.0", () => {
    console.log(`(PID: ${process.pid}) listening on port ${PORT}`);
});

// use for memeory leak
process.on("SIGTERM", () => {
    server.close(() => {
        process.exit(0);
    });
});
