const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * GET /api/v1/shapes/:shapeId
 * Returns shape GeoJSON for map drawing
 * Lazy loads from disk with caching
 */
router.get('/:shapeId', async (req, res, next) => {
  try {
    const { shapeId } = req.params;
    
    logger.debug(`Fetching shape ${shapeId}`);
    
    const shape = await req.dataLoader.getShape(shapeId);
    
    res.json({
      success: true,
      shapeId,
      data: shape
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
