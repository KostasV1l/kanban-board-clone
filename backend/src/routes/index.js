const express = require('express');
const router = express.Router();

// Health check endpoint
router.get('/health', (req, res) => {
  res.status(200).json({ status: 'OK', message: 'API is running' });
});

// Import other route modules here as you create them
// Example: const boardRoutes = require('./board.routes');
// router.use('/boards', boardRoutes);

module.exports = router; 