/**
 * Live Disruption Predictions Route
 * GET /api/v1/live/predictions - Get all predictions
 * GET /api/v1/live/predictions/route/:routeId - Get prediction for specific route
 * GET /api/v1/live/predictions/warning/trip/:tripId - Get proactive warning for trip
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');
const disruptionPredictionService = require('../services/disruptionPredictionService');
const tripUpdateService = require('../services/tripUpdateService');

/**
 * @route   GET /api/v1/live/predictions
 * @desc    Get disruption predictions for all routes with delays
 */
router.get('/', async (req, res) => {
  try {
    const allDelays = tripUpdateService.getAllDelays();
    
    // Record current delays in history for learning
    allDelays.forEach(delay => {
      if (delay.delayMinutes !== undefined) {
        disruptionPredictionService.recordDelay(
          delay.routeId,
          delay.tripId,
          delay.delayMinutes
        );
      }
    });

    // Get unique routes
    const routeIds = [...new Set(allDelays.map(d => d.routeId))];
    
    // Generate predictions for each route
    const predictions = routeIds.map(routeId => ({
      routeId,
      ...disruptionPredictionService.predictDisruption(routeId)
    }));

    res.json({
      success: true,
      data: {
        predictions,
        totalRoutes: predictions.length,
        generatedAt: Date.now()
      }
    });
  } catch (error) {
    logger.error('Error generating predictions:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/predictions/route/:routeId
 * @desc    Get disruption prediction for a specific route
 */
router.get('/route/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;
    
    // Record any current delays first
    const delays = tripUpdateService.getDelaysByRoute(routeId);
    delays.forEach(delay => {
      if (delay.delayMinutes !== undefined) {
        disruptionPredictionService.recordDelay(
          delay.routeId,
          delay.tripId,
          delay.delayMinutes
        );
      }
    });

    const prediction = disruptionPredictionService.predictDisruption(routeId);

    res.json({
      success: true,
      data: {
        routeId,
        prediction,
        historicalStats: disruptionPredictionService.getStats(routeId)
      }
    });
  } catch (error) {
    logger.error(`Error predicting route ${req.params.routeId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/predictions/warning/trip/:tripId
 * @desc    Get proactive warning for a specific trip
 */
router.get('/warning/trip/:tripId', async (req, res) => {
  try {
    const { tripId } = req.params;
    const { scheduledDeparture } = req.query;
    
    if (!scheduledDeparture) {
      return res.status(400).json({
        success: false,
        error: 'scheduledDeparture query parameter required'
      });
    }

    // Get trip details to find route
    const tripDelay = tripUpdateService.getDelayByTripId(tripId);
    
    if (!tripDelay || !tripDelay.routeId) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }

    const warning = disruptionPredictionService.getProactiveWarning(
      tripDelay.routeId,
      tripId,
      new Date(scheduledDeparture)
    );

    res.json({
      success: true,
      data: {
        tripId,
        routeId: tripDelay.routeId,
        warning,
        generatedAt: Date.now()
      }
    });
  } catch (error) {
    logger.error(`Error generating warning for trip ${req.params.tripId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/predictions/stats/:routeId
 * @desc    Get historical statistics for a route
 */
router.get('/stats/:routeId', async (req, res) => {
  try {
    const { routeId } = req.params;
    const stats = disruptionPredictionService.getStats(routeId);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    logger.error(`Error getting stats for route ${req.params.routeId}:`, error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
