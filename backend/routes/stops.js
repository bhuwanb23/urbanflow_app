const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * GET /api/v1/stops
 * Returns all stops or filtered by bounding box
 * Query params: bbox (minLat,minLon,maxLat,maxLon)
 */
router.get('/', (req, res, next) => {
  try {
    const { bbox } = req.query;
    const stops = req.dataLoader.getStops(bbox);
    
    logger.debug(`Returning ${stops.length} stops`);
    
    res.json({
      success: true,
      count: stops.length,
      data: stops
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/stops/:id
 * Returns a single stop by ID
 */
router.get('/:id', (req, res, next) => {
  try {
    const { id } = req.params;
    const stops = req.dataLoader.getStops();
    const stop = stops.find(s => s.id === id);
    
    if (!stop) {
      return res.status(404).json({
        success: false,
        error: 'Stop not found'
      });
    }
    
    res.json({
      success: true,
      data: stop
    });
  } catch (error) {
    next(error);
  }
});

/**
 * GET /api/v1/stops/nearby
 * Returns stops within specified radius
 * Query params: lat, lon, radius (meters, default 500)
 */
router.get('/nearby', (req, res, next) => {
  try {
    const { lat, lon, radius } = req.query;
    
    if (!lat || !lon) {
      return res.status(400).json({
        success: false,
        error: 'Latitude and longitude are required'
      });
    }
    
    const latitude = parseFloat(lat);
    const longitude = parseFloat(lon);
    const radiusMeters = radius ? parseInt(radius) : 500;
    
    const stops = req.dataLoader.findNearby(latitude, longitude, radiusMeters);
    
    logger.debug(`Found ${stops.length} stops near (${lat}, ${lon})`);
    
    res.json({
      success: true,
      count: stops.length,
      data: stops
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
