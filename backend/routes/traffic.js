/**
 * Traffic Routes
 * GET /api/v1/traffic - Get live traffic conditions
 */

const express = require('express');
const router = express.Router();
const logger = require('../utils/logger');

/**
 * @route   GET /api/v1/traffic
 * @desc    Get traffic conditions for an area
 */
router.get('/', (req, res) => {
  try {
    const { area } = req.query;
    
    // Mock traffic data for Bengaluru
    const mockTrafficData = {
      bengaluru: {
        overallStatus: 'moderate',
        congestionLevel: 65,
        averageSpeed: 28,
        affectedAreas: [
          {
            name: 'MG Road',
            status: 'heavy',
            delay: 15,
            description: 'Heavy traffic due to high volume'
          },
          {
            name: 'Silk Board',
            status: 'severe',
            delay: 25,
            description: 'Severe congestion, consider alternate route'
          },
          {
            name: 'Indiranagar',
            status: 'moderate',
            delay: 8,
            description: 'Moderate traffic flow'
          },
          {
            name: 'Whitefield',
            status: 'light',
            delay: 5,
            description: 'Light traffic, good conditions'
          }
        ],
        incidents: [
          {
            id: 'inc-001',
            type: 'accident',
            location: 'Outer Ring Road near Marathahalli',
            severity: 'high',
            description: 'Multi-vehicle accident, right lane blocked',
            reportedAt: new Date(Date.now() - 1800000).toISOString()
          },
          {
            id: 'inc-002',
            type: 'roadwork',
            location: 'Hosur Road near L&T Metro',
            severity: 'medium',
            description: 'Metro construction work, single lane closed',
            reportedAt: new Date(Date.now() - 7200000).toISOString()
          }
        ],
        lastUpdated: new Date().toISOString()
      },
      delhi: {
        overallStatus: 'heavy',
        congestionLevel: 78,
        averageSpeed: 22,
        affectedAreas: [
          {
            name: 'Connaught Place',
            status: 'severe',
            delay: 20,
            description: 'Severe traffic congestion'
          },
          {
            name: 'Dwarka',
            status: 'moderate',
            delay: 10,
            description: 'Moderate traffic'
          }
        ],
        incidents: [],
        lastUpdated: new Date().toISOString()
      },
      chennai: {
        overallStatus: 'light',
        congestionLevel: 45,
        averageSpeed: 35,
        affectedAreas: [
          {
            name: 'Anna Salai',
            status: 'moderate',
            delay: 7,
            description: 'Moderate traffic flow'
          }
        ],
        incidents: [],
        lastUpdated: new Date().toISOString()
      }
    };

    const cityKey = area?.toLowerCase() || 'bengaluru';
    const trafficData = mockTrafficData[cityKey] || mockTrafficData.bengaluru;

    res.json({
      success: true,
      data: trafficData
    });
  } catch (error) {
    logger.error('Error getting traffic data:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
