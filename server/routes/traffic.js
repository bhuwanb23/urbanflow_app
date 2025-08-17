const express = require('express');
const router = express.Router();
const { LiveTraffic } = require('../models');

// GET /api/v1/traffic - Get all traffic data
router.get('/', async (req, res) => {
  try {
    const traffic = await LiveTraffic.findAll({
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: traffic,
      count: traffic.length
    });
  } catch (error) {
    console.error('Error fetching traffic data:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching traffic data',
      error: error.message
    });
  }
});

// GET /api/v1/traffic/count - Get traffic count
router.get('/count', async (req, res) => {
  try {
    const count = await LiveTraffic.count();
    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error counting traffic data:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting traffic data',
      error: error.message
    });
  }
});

// GET /api/v1/traffic/location - Get traffic by location
router.get('/location', async (req, res) => {
  try {
    const { city, routeType } = req.query;
    const whereClause = {};
    
    if (city) {
      whereClause['location.city'] = city;
    }
    
    if (routeType) {
      whereClause['route.type'] = routeType;
    }
    
    const traffic = await LiveTraffic.findAll({
      where: whereClause,
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: traffic,
      count: traffic.length
    });
  } catch (error) {
    console.error('Error fetching traffic by location:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching traffic by location',
      error: error.message
    });
  }
});

module.exports = router;
