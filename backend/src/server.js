const express = require("express");
const http = require("http");
const { initSocketServer } = require("./config/socket");
const cors = require("cors");
const morgan = require("morgan");
const swaggerUi = require("swagger-ui-express");
const swaggerDocs = require("./config/swagger");
const cookieParser = require("cookie-parser");
require("dotenv").config();
const logger = require("./config/logger");

// Import routes, middleware, and config
const routes = require("./routes");
const globalErrorHandler = require("./middleware/errorHandler.middleware");
const connectDB = require("./config/db");
const authService = require("./services/auth.service");

const app = express();
// Create a server to wrap the express app for socket.io 
const server = http.createServer(app);
const PORT = process.env.PORT || 5000;

// Initialize Socket.io server
initSocketServer(server)

app.use(express.json());
app.use(cookieParser(process.env.COOKIE_SECRET));

if (process.env.NODE_ENV === "development") {
    app.use(morgan("dev", { stream: logger.stream }));
} else {
    app.use(morgan("combined", { stream: logger.stream }));
}
app.use(
    cors({
        origin: process.env.CLIENT_URL || "http://localhost:3000",
        credentials: true, // Important for cookies
    })
);

// Swagger Documentation
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocs));

// Routes
app.use("/api", routes);

// Error handling middleware
app.use(globalErrorHandler);

// Connect to MongoDB and start server
const startServer = async () => {
    try {
        await connectDB();

        // Run initial cleanup of expired tokens
        await authService.cleanupExpiredTokens();

        // Schedule regular cleanup (every 24 hours)
        setInterval(async () => {
            try {
                const removed = await authService.cleanupExpiredTokens();
                logger.info(`Scheduled cleanup: removed ${removed} expired tokens`);
            } catch (err) {
                logger.error("Error in scheduled token cleanup:", err);
            }
        }, 24 * 60 * 60 * 1000); // 24 hours

        server.listen(PORT, () => {
            logger.info(`Server running in ${process.env.NODE_ENV} mode on port ${PORT}`);
        });
    } catch (error) {
        logger.error(`Failed to start server: ${error.message}`);
        process.exit(1);
    }
};

startServer();
