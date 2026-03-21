/**
 * Trips Routes
 * GET /api/v1/trips - Get all user trips
 * GET /api/v1/trips/:id - Get specific trip
 * POST /api/v1/trips - Create new trip
 * PUT /api/v1/trips/:id - Update trip
 * DELETE /api/v1/trips/:id - Delete trip
 * GET /api/v1/trips/stats - Get trip statistics
 */

const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');

// Mock trips database (replace with SQLite in production)
let trips = new Map();

// Initialize with some demo trips
const initializeDemoTrips = () => {
  const now = Date.now();
  const demoTrips = [
    {
      id: 'trip-001',
      userId: 'user-001',
      date: new Date(now - 2 * 24 * 60 * 60 * 1000).toISOString(), // 2 days ago
      from: { name: 'MG Road', lat: 12.9716, lon: 77.5946 },
      to: { name: 'Indiranagar', lat: 12.9716, lon: 77.6412 },
      distance: 5.2,
      duration: 25,
      mode: 'bus',
      routeId: 'route-123',
      carbonSaved: 1.2,
      cost: 25,
      caloriesBurned: 45,
      status: 'completed'
    },
    {
      id: 'trip-002',
      userId: 'user-001',
      date: new Date(now - 1 * 24 * 60 * 60 * 1000).toISOString(), // 1 day ago
      from: { name: 'Koramangala', lat: 12.9352, lon: 77.6245 },
      to: { name: 'Silk Board', lat: 12.9176, lon: 77.6238 },
      distance: 8.5,
      duration: 35,
      mode: 'train',
      routeId: 'route-456',
      carbonSaved: 2.1,
      cost: 40,
      caloriesBurned: 120,
      status: 'completed'
    },
    {
      id: 'trip-003',
      userId: 'user-001',
      date: new Date(now - 5 * 60 * 60 * 1000).toISOString(), // 5 hours ago
      from: { name: 'Whitefield', lat: 12.9698, lon: 77.7499 },
      to: { name: 'KR Puram', lat: 13.0389, lon: 77.6978 },
      distance: 12.3,
      duration: 45,
      mode: 'multimodal',
      legs: [
        { mode: 'walk', distance: 0.5, duration: 6 },
        { mode: 'bus', distance: 10.8, duration: 35 },
        { mode: 'walk', distance: 1.0, duration: 4 }
      ],
      routeId: 'route-789',
      carbonSaved: 3.5,
      cost: 35,
      caloriesBurned: 180,
      status: 'completed'
    }
  ];
  
  demoTrips.forEach(trip => {
    trips.set(trip.id, trip);
  });
};

initializeDemoTrips();

/**
 * @route   GET /api/v1/trips/stats
 * @desc    Get trip statistics
 * @access  Private
 */
router.get('/stats', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    const { period = 'week' } = req.query;
    
    // Filter trips by user and period
    let userTrips = Array.from(trips.values()).filter(t => t.userId === userId);
    
    const now = Date.now();
    let periodStart;
    
    switch (period) {
      case 'day':
        periodStart = now - 24 * 60 * 60 * 1000;
        break;
      case 'week':
        periodStart = now - 7 * 24 * 60 * 60 * 1000;
        break;
      case 'month':
        periodStart = now - 30 * 24 * 60 * 60 * 1000;
        break;
      case 'year':
        periodStart = now - 365 * 24 * 60 * 60 * 1000;
        break;
      default:
        periodStart = now - 7 * 24 * 60 * 60 * 1000;
    }
    
    userTrips = userTrips.filter(t => new Date(t.date).getTime() >= periodStart);
    
    // Calculate statistics
    const stats = {
      period,
      totalTrips: userTrips.length,
      totalDistance: userTrips.reduce((sum, t) => sum + (t.distance || 0), 0),
      totalDuration: userTrips.reduce((sum, t) => sum + (t.duration || 0), 0),
      totalCarbonSaved: userTrips.reduce((sum, t) => sum + (t.carbonSaved || 0), 0),
      totalCost: userTrips.reduce((sum, t) => sum + (t.cost || 0), 0),
      totalCalories: userTrips.reduce((sum, t) => sum + (t.caloriesBurned || 0), 0),
      byMode: {},
      dailyTrend: []
    };
    
    // Group by mode
    userTrips.forEach(trip => {
      const mode = trip.mode || 'other';
      if (!stats.byMode[mode]) {
        stats.byMode[mode] = {
          count: 0,
          distance: 0,
          carbonSaved: 0
        };
      }
      stats.byMode[mode].count++;
      stats.byMode[mode].distance += trip.distance || 0;
      stats.byMode[mode].carbonSaved += trip.carbonSaved || 0;
    });
    
    // Daily trend (last 7 days)
    const last7Days = [];
    for (let i = 6; i >= 0; i--) {
      const date = new Date(now - i * 24 * 60 * 60 * 1000);
      const dateStr = date.toISOString().split('T')[0];
      const dayTrips = userTrips.filter(t => t.date.startsWith(dateStr));
      last7Days.push({
        date: dateStr,
        trips: dayTrips.length,
        distance: dayTrips.reduce((sum, t) => sum + (t.distance || 0), 0)
      });
    }
    stats.dailyTrend = last7Days;
    
    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting trip stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/trips
 * @desc    Get all user trips with optional filtering
 * @access  Private
 */
router.get('/', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    const { limit = 20, offset = 0, mode, startDate, endDate } = req.query;
    
    // Filter trips by user
    let userTrips = Array.from(trips.values()).filter(t => t.userId === userId);
    
    // Apply filters
    if (mode) {
      userTrips = userTrips.filter(t => t.mode === mode);
    }
    
    if (startDate) {
      userTrips = userTrips.filter(t => new Date(t.date) >= new Date(startDate));
    }
    
    if (endDate) {
      userTrips = userTrips.filter(t => new Date(t.date) <= new Date(endDate));
    }
    
    // Sort by date (newest first)
    userTrips.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Apply pagination
    const paginatedTrips = userTrips.slice(parseInt(offset), parseInt(offset) + parseInt(limit));
    
    res.json({
      success: true,
      data: {
        trips: paginatedTrips,
        total: userTrips.length,
        limit: parseInt(limit),
        offset: parseInt(offset)
      }
    });
  } catch (error) {
    console.error('Error getting trips:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/trips/:id
 * @desc    Get specific trip by ID
 * @access  Private
 */
router.get('/:id', async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = trips.get(tripId);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }
    
    res.json({
      success: true,
      data: trip
    });
  } catch (error) {
    console.error('Error getting trip:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   POST /api/v1/trips
 * @desc    Create new trip
 * @access  Private
 */
router.post('/', async (req, res) => {
  try {
    const userId = req.headers.authorization?.split(' ')[1] ? 
      jwt.decode(req.headers.authorization.split(' ')[1])?.id : 'user-001';
    
    const tripData = req.body;
    
    // Validate required fields
    const requiredFields = ['from', 'to', 'distance', 'duration'];
    for (const field of requiredFields) {
      if (!tripData[field]) {
        return res.status(400).json({
          success: false,
          error: `Missing required field: ${field}`
        });
      }
    }
    
    // Create new trip
    const newTrip = {
      id: `trip-${Date.now()}`,
      userId,
      date: new Date().toISOString(),
      status: tripData.status || 'completed',
      ...tripData
    };
    
    trips.set(newTrip.id, newTrip);
    
    res.status(201).json({
      success: true,
      data: newTrip,
      message: 'Trip created successfully'
    });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   PUT /api/v1/trips/:id
 * @desc    Update existing trip
 * @access  Private
 */
router.put('/:id', async (req, res) => {
  try {
    const tripId = req.params.id;
    const updates = req.body;
    const trip = trips.get(tripId);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }
    
    // Update trip
    const updatedTrip = { ...trip, ...updates };
    trips.set(tripId, updatedTrip);
    
    res.json({
      success: true,
      data: updatedTrip,
      message: 'Trip updated successfully'
    });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   DELETE /api/v1/trips/:id
 * @desc    Delete trip
 * @access  Private
 */
router.delete('/:id', async (req, res) => {
  try {
    const tripId = req.params.id;
    const trip = trips.get(tripId);
    
    if (!trip) {
      return res.status(404).json({
        success: false,
        error: 'Trip not found'
      });
    }
    
    trips.delete(tripId);
    
    res.json({
      success: true,
      message: 'Trip deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
