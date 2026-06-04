/**
 * Environment Routes
 * GET /api/v1/environment/aqi - Get Air Quality Index
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * @route   GET /api/v1/environment/aqi
 * @desc    Get AQI data for a location
 */
router.get('/aqi', (req, res) => {
  try {
    const { location } = req.query;
    
    // Mock AQI data for Bengaluru
    const mockAqiData = {
      bengaluru: {
        aqi: 87,
        category: 'Moderate',
        color: '#FFFF00',
        pollutants: {
          pm25: 42,
          pm10: 68,
          no2: 35,
          so2: 12,
          co: 0.8,
          o3: 45
        },
        healthImplications: 'Air quality is acceptable for most people. However, sensitive groups may experience minor effects.',
        lastUpdated: new Date().toISOString()
      },
      delhi: {
        aqi: 178,
        category: 'Unhealthy',
        color: '#FF0000',
        pollutants: {
          pm25: 98,
          pm10: 156,
          no2: 67,
          so2: 28,
          co: 1.5,
          o3: 72
        },
        healthImplications: 'Everyone may begin to experience health effects; members of sensitive groups may experience more serious effects.',
        lastUpdated: new Date().toISOString()
      },
      chennai: {
        aqi: 65,
        category: 'Moderate',
        color: '#FFFF00',
        pollutants: {
          pm25: 32,
          pm10: 54,
          no2: 28,
          so2: 10,
          co: 0.6,
          o3: 38
        },
        healthImplications: 'Air quality is acceptable for most people.',
        lastUpdated: new Date().toISOString()
      }
    };

    const cityKey = location?.toLowerCase() || 'bengaluru';
    const aqiData = mockAqiData[cityKey] || mockAqiData.bengaluru;

    res.json({
      success: true,
      data: aqiData
    });
  } catch (error) {
    logger.error('Error getting AQI:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
