const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * GET /api/v1/schedule/:routeId
 * Returns schedule for a specific route
 * Lazy loads from disk with caching
 */
router.get('/:routeId', async (req, res, next) => {
  try {
    const { routeId } = req.params;
    
    logger.debug(`Fetching schedule for route ${routeId}`);
    
    const schedule = await req.dataLoader.getSchedule(routeId);
    
    res.json({
      success: true,
      routeId,
      data: schedule
    });
  } catch (error) {
    if (error.message.includes('not found')) {
      return res.status(404).json({
        success: false,
        error: error.message
      });
    }
    next(error);
  }
});

module.exports = router;
