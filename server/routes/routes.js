const express = require('express');
const router = express.Router();
const { Route } = require('../models');

// GET /api/v1/routes - Get all routes
router.get('/', async (req, res) => {
  try {
    const routes = await Route.findAll({
      include: [
        {
          model: require('../models').User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ],
      order: [['createdAt', 'DESC']]
    });
    
    res.json({
      success: true,
      data: routes,
      count: routes.length
    });
  } catch (error) {
    console.error('Error fetching routes:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching routes',
      error: error.message
    });
  }
});

// GET /api/v1/routes/count - Get route count
router.get('/count', async (req, res) => {
  try {
    const count = await Route.count();
    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error counting routes:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting routes',
      error: error.message
    });
  }
});

// POST /api/v1/routes - Create new route
router.post('/', async (req, res) => {
  try {
    const routeData = {
      ...req.body,
      userId: req.body.userId || 1 // Default to first user for demo
    };
    
    const route = await Route.create(routeData);
    
    res.status(201).json({
      success: true,
      message: 'Route created successfully',
      data: route
    });
  } catch (error) {
    console.error('Error creating route:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating route',
      error: error.message
    });
  }
});

module.exports = router;
