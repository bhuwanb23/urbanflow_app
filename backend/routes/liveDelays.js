/**
 * Live Delays Route
 * GET /api/v1/live/delays - Real-time trip delay predictions
 */

const express = require('express');
const router = express.Router();
const tripUpdateService = require('../services/tripUpdateService');
const logger = require('../utils/logger');

/**
 * @route   GET /api/v1/live/delays
 * @desc    Get all trip delay predictions
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { routeId, prediction, minDelay } = req.query;
    
    // Build filters object
    const filters = {};
    if (routeId) filters.routeId = routeId;
    if (prediction) filters.prediction = prediction;
    if (minDelay) filters.minDelay = parseInt(minDelay);

    // Get updates from service
    const updates = tripUpdateService.getAllUpdates(filters);
    const status = tripUpdateService.getStatus();

    logger.debug(`Returned ${updates.length} delay predictions`);

    res.json({
      success: true,
      data: {
        delays: updates,
        total: updates.length,
        lastUpdated: status.lastUpdated,
        nextUpdate: status.nextUpdate
      },
      meta: {
        filters: Object.keys(filters).length > 0 ? filters : null,
        updateInterval: 30000,
        forecastHours: 1
      }
    });

  } catch (error) {
    logger.error('Error in live delays endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch delay predictions',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/delays/route/:routeId
 * @desc    Get delay predictions for a specific route
 * @access  Public
 */
router.get('/route/:routeId', async (req, res) => {
  try {
    const routeId = req.params.routeId;
    const updates = tripUpdateService.getDelaysByRoute(routeId);
    const averageDelay = tripUpdateService.getAverageDelayForRoute(routeId);

    res.json({
      success: true,
      data: {
        routeId,
        delays: updates,
        averageDelay,
        total: updates.length
      }
    });

  } catch (error) {
    logger.error('Error getting route delays:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch delays for route',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/delays/severe
 * @desc    Get severely delayed trips (>5 minutes)
 * @access  Public
 */
router.get('/severe', async (req, res) => {
  try {
    const severeDelays = tripUpdateService.getSevereDelays();

    res.json({
      success: true,
      data: {
        severeDelays,
        total: severeDelays.length
      }
    });

  } catch (error) {
    logger.error('Error getting severe delays:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch severe delays',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/delays/status
 * @desc    Get service status
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const status = tripUpdateService.getStatus();

    res.json({
      success: true,
      data: status
    });

  } catch (error) {
    logger.error('Error getting status:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to get service status',
      message: error.message
    });
  }
});

module.exports = router;
