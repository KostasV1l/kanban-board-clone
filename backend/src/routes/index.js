// MOUNT ROUTES HERE
const express = require('express');
const router = express.Router();
const authRoutes = require("./auth.routes");
const boardRoutes = require("./board.routes");
const listRoutes = require("./list.routes");

// Health check endpoint
router.get("/health", (req, res) => {
    res.status(200).json({ status: "OK", message: "API is running" });
});

// Auth routes
router.use("/auth", authRoutes);

// Boards routes
router.use("/boards", boardRoutes);

// List routes
router.use("/lists", listRoutes);

module.exports = router;
