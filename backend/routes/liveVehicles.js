/**
 * Live Vehicles Route
 * GET /api/v1/live/vehicles - Real-time bus positions
 */

const express = require('express');
const router = express.Router();
const vehiclePositionService = require('../services/vehiclePositionService');
const logger = require('../utils/logger');

/**
 * @route   GET /api/v1/live/vehicles
 * @desc    Get all active vehicle positions
 * @access  Public
 */
router.get('/', async (req, res) => {
  try {
    const { routeId, status: statusFilter, lat, lon, radius } = req.query;
    
    // Build filters object
    const filters = {};
    if (routeId) filters.routeId = routeId;
    if (statusFilter) filters.status = statusFilter;
    if (lat && lon && radius) {
      filters.lat = parseFloat(lat);
      filters.lon = parseFloat(lon);
      filters.radius = parseFloat(radius);
    }

    // Get vehicles from service
    const vehicles = vehiclePositionService.getAllVehicles(filters);
    const serviceStatus = vehiclePositionService.getStatus();

    logger.debug(`Returned ${vehicles.length} vehicles`);

    res.json({
      success: true,
      data: {
        vehicles,
        total: vehicles.length,
        lastUpdated: serviceStatus.lastUpdated,
        nextUpdate: serviceStatus.nextUpdate
      },
      meta: {
        filters: Object.keys(filters).length > 0 ? filters : null,
        updateInterval: 30000
      }
    });

  } catch (error) {
    logger.error('Error in live vehicles endpoint:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicle positions',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/vehicles/:vehicleId
 * @desc    Get specific vehicle by ID
 * @access  Public
 */
router.get('/:vehicleId', async (req, res) => {
  try {
    const vehicle = vehiclePositionService.getVehicleById(req.params.vehicleId);

    if (!vehicle) {
      return res.status(404).json({
        success: false,
        error: 'Vehicle not found'
      });
    }

    res.json({
      success: true,
      data: vehicle
    });

  } catch (error) {
    logger.error('Error getting vehicle:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicle',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/vehicles/route/:routeId
 * @desc    Get all vehicles for a specific route
 * @access  Public
 */
router.get('/route/:routeId', async (req, res) => {
  try {
    const vehicles = vehiclePositionService.getVehiclesByRoute(req.params.routeId);

    res.json({
      success: true,
      data: {
        vehicles,
        routeId: req.params.routeId,
        total: vehicles.length
      }
    });

  } catch (error) {
    logger.error('Error getting route vehicles:', error);
    res.status(500).json({
      success: false,
      error: 'Failed to fetch vehicles for route',
      message: error.message
    });
  }
});

/**
 * @route   GET /api/v1/live/vehicles/status
 * @desc    Get service status
 * @access  Public
 */
router.get('/status', async (req, res) => {
  try {
    const status = vehiclePositionService.getStatus();

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
