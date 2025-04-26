// MOUNT ROUTES HERE
const express = require('express');
const router = express.Router();
const authRoutes = require('./auth.routes');


// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Auth routes
router.use('/auth', authRoutes);

// Import other route modules here as you create them
// Example: const boardRoutes = require('./board.routes');
// router.use('/boards', boardRoutes);

module.exports = router;