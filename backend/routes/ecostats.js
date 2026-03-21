/**
 * Eco-Stats Routes
 * GET /api/v1/ecostats - Get user eco statistics
 * GET /api/v1/ecostats/achievements - Get user achievements
 */

const express = require('express');
const router = express.Router();

// Mock eco-stats data generator
const generateEcoStats = (period = 'week') => {
  const now = new Date();
  let startDate;
  
  switch (period) {
    case 'day':
      startDate = new Date(now.getTime() - 24 * 60 * 60 * 1000);
      break;
    case 'week':
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      break;
    case 'month':
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
      break;
    case 'year':
      startDate = new Date(now.getTime() - 365 * 24 * 60 * 60 * 1000);
      break;
    default:
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }

  // Mock data for Bengaluru user
  return {
    period,
    startDate: startDate.toISOString(),
    endDate: now.toISOString(),
    trips: {
      total: Math.floor(Math.random() * 20) + 10,
      byMode: {
        bus: Math.floor(Math.random() * 10) + 5,
        train: Math.floor(Math.random() * 5) + 2,
        walk: Math.floor(Math.random() * 8) + 3,
        bike: Math.floor(Math.random() * 3),
        car: Math.floor(Math.random() * 2)
      }
    },
    distance: {
      total: parseFloat((Math.random() * 150 + 50).toFixed(2)),
      unit: 'km',
      byMode: {
        bus: parseFloat((Math.random() * 80 + 30).toFixed(2)),
        train: parseFloat((Math.random() * 40 + 10).toFixed(2)),
        walk: parseFloat((Math.random() * 15 + 5).toFixed(2)),
        bike: parseFloat((Math.random() * 10).toFixed(2)),
        car: parseFloat((Math.random() * 5).toFixed(2))
      }
    },
    carbon: {
      saved: parseFloat((Math.random() * 25 + 10).toFixed(2)),
      unit: 'kg CO2',
      equivalent: {
        treesPlanted: Math.floor(Math.random() * 3) + 1,
        carsOffRoad: parseFloat((Math.random() * 0.5).toFixed(2)),
        homesPowered: parseFloat((Math.random() * 0.1).toFixed(2))
      }
    },
    health: {
      caloriesBurned: Math.floor(Math.random() * 2000 + 500),
      activeMinutes: Math.floor(Math.random() * 300 + 100),
      stepsTaken: Math.floor(Math.random() * 50000 + 20000)
    },
    cost: {
      saved: parseFloat((Math.random() * 800 + 300).toFixed(2)),
      currency: 'INR',
      comparedTo: 'private vehicle'
    },
    weeklyTrend: [
      { day: 'Mon', trips: 3, carbon: 4.2 },
      { day: 'Tue', trips: 4, carbon: 5.1 },
      { day: 'Wed', trips: 2, carbon: 2.8 },
      { day: 'Thu', trips: 5, carbon: 6.3 },
      { day: 'Fri', trips: 3, carbon: 3.9 },
      { day: 'Sat', trips: 1, carbon: 1.5 },
      { day: 'Sun', trips: 2, carbon: 2.4 }
    ]
  };
};

// Mock achievements data
const achievements = [
  {
    id: 'ach-001',
    title: 'Green Commuter',
    description: 'Completed 10 bus trips in a week',
    icon: '🚌',
    category: 'transport',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 100,
    target: 10,
    current: 10
  },
  {
    id: 'ach-002',
    title: 'Carbon Warrior',
    description: 'Saved 20 kg of CO2 in a month',
    icon: '🌱',
    category: 'environment',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 100,
    target: 20,
    current: 23.5
  },
  {
    id: 'ach-003',
    title: 'Walking Champion',
    description: 'Walked 50 km in a month',
    icon: '🚶',
    category: 'health',
    unlocked: false,
    unlockedAt: null,
    progress: 65,
    target: 50,
    current: 32.5
  },
  {
    id: 'ach-004',
    title: 'Early Bird',
    description: 'Completed 5 trips before 8 AM',
    icon: '🌅',
    category: 'consistency',
    unlocked: true,
    unlockedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    progress: 100,
    target: 5,
    current: 7
  },
  {
    id: 'ach-005',
    title: 'Multimodal Master',
    description: 'Used 3 different transport modes in a week',
    icon: '🎯',
    category: 'variety',
    unlocked: false,
    unlockedAt: null,
    progress: 66,
    target: 3,
    current: 2
  },
  {
    id: 'ach-006',
    title: 'Cost Saver',
    description: 'Saved ₹1000 by using public transport',
    icon: '💰',
    category: 'financial',
    unlocked: false,
    unlockedAt: null,
    progress: 45,
    target: 1000,
    current: 450
  }
];

/**
 * @route   GET /api/v1/ecostats
 * @desc    Get user eco statistics for specified period
 */
router.get('/', (req, res) => {
  try {
    const { period = 'week' } = req.query;
    
    const stats = generateEcoStats(period);

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting eco stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/ecostats/weekly
 * @desc    Get weekly eco statistics (shortcut)
 */
router.get('/weekly', (req, res) => {
  try {
    const stats = generateEcoStats('week');

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting weekly eco stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/ecostats/monthly
 * @desc    Get monthly eco statistics (shortcut)
 */
router.get('/monthly', (req, res) => {
  try {
    const stats = generateEcoStats('month');

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error getting monthly eco stats:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/ecostats/achievements
 * @desc    Get user achievements
 */
router.get('/achievements', (req, res) => {
  try {
    res.json({
      success: true,
      data: {
        achievements,
        summary: {
          total: achievements.length,
          unlocked: achievements.filter(a => a.unlocked).length,
          locked: achievements.filter(a => !a.unlocked).length,
          completionRate: Math.round((achievements.filter(a => a.unlocked).length / achievements.length) * 100)
        }
      }
    });
  } catch (error) {
    console.error('Error getting achievements:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

/**
 * @route   GET /api/v1/ecostats/summary
 * @desc    Get quick summary of eco impact
 */
router.get('/summary', (req, res) => {
  try {
    const weeklyStats = generateEcoStats('week');
    
    res.json({
      success: true,
      data: {
        carbonSaved: weeklyStats.carbon.saved,
        tripsCompleted: weeklyStats.trips.total,
        distanceCovered: weeklyStats.distance.total,
        achievementsUnlocked: achievements.filter(a => a.unlocked).length
      }
    });
  } catch (error) {
    console.error('Error getting summary:', error);
    res.status(500).json({
      success: false,
      error: error.message
    });
  }
});

module.exports = router;
