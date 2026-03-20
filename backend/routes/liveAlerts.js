/**
 * Live Alerts Route
 * GET /api/v1/live/alerts - Real-time service alerts and incidents
 */

const express = require('express');
const router = express.Router();
const alertsService = require('../services/alertsService');
const logger = require('../utils/logger');

/**
 * @route   GET /api/v1/live/alerts
 * @desc    Get all active service alerts
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { severity, routeId, cause } = req.query;
    
    // Build filters object
    const filters = {};
    if (severity) filters.severity = severity;
    if (routeId) filters.routeId = routeId;
    if (cause) filters.cause = cause;

    // Get alerts from service
    const alerts = alertsService.getAllAlerts(filters);
    const status = alertsService.getStatus();

    logger.debug(`Returned ${alerts.length} alerts`);

    res.json({
      success: true,
      data: {
        alerts,
        total: alerts.length,
        lastUpdated: status.lastUpdated,
        nextUpdate: status.nextUpdate
      },
      meta: {
        filters: Object.keys(filters).length > 0 ? filters : null,
        updateInterval: 60000
      }
    });

  } catch (error) {
    logger.error('Error in live alerts endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch service alerts',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/alerts/route/:routeId
 * @desc    Get alerts for a specific route
 * @access  Public
 */
router.get('/route/:routeId', async (req, res) => {
  try {
    const routeId = req.params.routeId;
    const alerts = alertsService.getAlertsByRoute(routeId);

    res.json({
      success: true,
      data: {
        routeId,
        alerts,
        total: alerts.length
      }
    });

  } catch (error) {
    logger.error('Error getting route alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch alerts for route',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/alerts/critical
 * @desc    Get critical alerts only
 * @access  Public
 */
router.get('/critical', async (req, res) => {
  try {
    const criticalAlerts = alertsService.getCriticalAlerts();

    res.json({
      success: true,
      data: {
        alerts: criticalAlerts,
        total: criticalAlerts.length
      }
    });

  } catch (error) {
    logger.error('Error getting critical alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch critical alerts',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/alerts/recent
 * @desc    Get recent alerts formatted for live feed
 * @access  Public
 */
router.get('/recent', async (req, res) => {
  try {
    const { limit = 5 } = req.query;
    const feedItems = alertsService.getRecentFeedItems(parseInt(limit));

    res.json({
      success: true,
      data: {
        feedItems,
        total: feedItems.length
      }
    });

  } catch (error) {
    logger.error('Error getting recent alerts:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch recent alerts',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/alerts/status
 * @desc    Get service status
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const status = alertsService.getStatus();

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
