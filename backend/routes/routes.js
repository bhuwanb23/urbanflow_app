const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * GET /api/v1/routes
 * Returns all routes or limited set
 * Query params: limit (optional)
 */
router.get('/', (req, res, next) => {
  try {
    const { limit } = req.query;
    const routes = req.dataLoader.getRoutes(limit ? parseInt(limit) : null);
    
    logger.debug(`Returning ${routes.length} routes`);
    
    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/routes/:id
 * Returns a single route with details
 */
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const route = req.dataLoader.getRouteById(id);
    
    if (!route) {
      return res.status(404).json({
        success: false,
        error: 'Route not found'
      });
    }
    
    res.json({
      success: true,
      data: route
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/routes/popular
 * Returns popular routes (placeholder for now)
 */
router.get('/popular', (req, res, next) => {
  try {
    // TODO: Implement popularity algorithm based on usage data
    const routes = req.dataLoader.getRoutes(20);
    
    res.json({
      success: true,
      count: routes.length,
      data: routes
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
