const express = require('express');
const router = express.Router();

// @route   GET /api/v1/ecostats
// @desc    Get user eco-stats
// @access  Private (requires authentication)
router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Eco-stats endpoint - requires authentication middleware implementation',
    note: 'This endpoint will return user environmental impact data once authentication is implemented'
  });
});

// @route   GET /api/v1/ecostats/weekly
// @desc    Get weekly eco-stats
// @access  Private (requires authentication)
router.get('/weekly', (req, res) => {
  res.json({
    success: true,
    message: 'Weekly eco-stats endpoint - requires authentication middleware implementation',
    note: 'This endpoint will return weekly environmental impact data once authentication is implemented'
  });
});

module.exports = router;
