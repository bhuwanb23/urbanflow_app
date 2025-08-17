const express = require('express');
const router = express.Router();
const { Trip } = require('../models');

// GET /api/v1/trips - Get all trips
router.get('/', async (req, res) => {
  try {
    const trips = await Trip.findAll({
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
      data: trips,
      count: trips.length
    });
  } catch (error) {
    console.error('Error fetching trips:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trips',
      error: error.message
    });
  }
});

// GET /api/v1/trips/count - Get trip count
router.get('/count', async (req, res) => {
  try {
    const count = await Trip.count();
    res.json({
      success: true,
      count: count
    });
  } catch (error) {
    console.error('Error counting trips:', error);
    res.status(500).json({
      success: false,
      message: 'Error counting trips',
      error: error.message
    });
  }
});

// GET /api/v1/trips/:id - Get specific trip
router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id, {
      include: [
        {
          model: require('../models').User,
          as: 'user',
          attributes: ['id', 'name', 'email']
        }
      ]
    });
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    res.json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Error fetching trip:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching trip',
      error: error.message
    });
  }
});

// POST /api/v1/trips - Create new trip
router.post('/', async (req, res) => {
  try {
    const tripData = {
      ...req.body,
      userId: req.body.userId || 1 // Default to first user for demo
    };
    
    const trip = await Trip.create(tripData);
    
    res.status(201).json({
      success: true,
      message: 'Trip created successfully',
      data: trip
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({
      success: false,
      message: 'Error creating trip',
      error: error.message
    });
  }
});

// PUT /api/v1/trips/:id - Update trip
router.put('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    await trip.update(req.body);
    
    res.json({
      success: true,
      message: 'Trip updated successfully',
      data: trip
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({
      success: false,
      message: 'Error updating trip',
      error: error.message
    });
  }
});

// DELETE /api/v1/trips/:id - Delete trip
router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        message: 'Trip not found'
      });
    }
    
    await trip.destroy();
    
    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({
      success: false,
      message: 'Error deleting trip',
      error: error.message
    });
  }
});

module.exports = router;
