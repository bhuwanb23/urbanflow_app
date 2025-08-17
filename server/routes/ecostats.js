const express = require('express');
const router = express.Router();
const { EcoStats } = require('../models');

// GET /api/v1/ecostats - Get all eco stats
router.get('/', async (req, res) => {
  try {
    const ecoStats = await EcoStats.findAll({
      include: [
        {
          model: require('../models').User,
          as: 'ecoStatsUser',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: ecoStats,
      count: ecoStats.length
    });
  } catch (error) {
    console.error('Error fetching eco stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching eco stats',
      error: error.message
    });
  }
});

// GET /api/v1/ecostats/count - Get eco stats count
router.get('/count', async (req, res) => {
  try {
    const count = await EcoStats.count();
    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error counting eco stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting eco stats',
      error: error.message
    });
  }
});

// GET /api/v1/ecostats/weekly - Get weekly eco stats
router.get('/weekly', async (req, res) => {
  try {
    const weeklyStats = await EcoStats.findAll({
      where: {
        'period.type': 'weekly'
      },
      include: [
        {
          model: require('../models').User,
          as: 'ecoStatsUser',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']],
      limit: 10
    });
    
    res.json({
      success: true,
      data: weeklyStats,
      count: weeklyStats.length
    });
  } catch (error) {
    console.error('Error fetching weekly eco stats:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching weekly eco stats',
      error: error.message
    });
  }
});

module.exports = router;
