const express = require('express');
const router = express.Router();
const { Op } = require('sequelize');
const { Trip } = require('../models');
const logger = require('../utils/logger');

const getPeriodRange = (period) => {
  const now = new Date();
  let start;
  switch (period) {
    case 'day': start = new Date(now - 86400000); break;
    case 'week': start = new Date(now - 604800000); break;
    case 'month': start = new Date(now - 2592000000); break;
    case 'year': start = new Date(now - 31536000000); break;
    default: start = new Date(now - 604800000);
  }
  return { start, end: now };
};

const computeStats = async (userId, period) => {
  const { start, end } = getPeriodRange(period);
  const trips = await Trip.findAll({ where: { userId, date: { [Op.between]: [start, end] } } });

  const totalTrips = trips.length;
  const totalDistance = trips.reduce((s, t) => s + (t.distance || 0), 0);
  const totalDuration = trips.reduce((s, t) => s + (t.duration || 0), 0);
  const totalCarbon = trips.reduce((s, t) => s + (t.carbonSaved || 0), 0);
  const totalCost = trips.reduce((s, t) => s + (t.cost || 0), 0);
  const totalCalories = trips.reduce((s, t) => s + (t.caloriesBurned || 0), 0);

  const tripsByMode = {};
  const distanceByMode = {};
  trips.forEach(t => {
    const m = t.mode || 'other';
    tripsByMode[m] = (tripsByMode[m] || 0) + 1;
    distanceByMode[m] = (distanceByMode[m] || 0) + (t.distance || 0);
  });

  const dailyTrend = [];
  for (let i = 6; i >= 0; i--) {
    const d = new Date(end - i * 86400000);
    const ds = d.toISOString().split('T')[0];
    const dayTrips = trips.filter(t => new Date(t.date).toISOString().startsWith(ds));
    dailyTrend.push({
      day: ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'][d.getDay()],
      trips: dayTrips.length,
      carbon: dayTrips.reduce((s, t) => s + (t.carbonSaved || 0), 0)
    });
  }

  const carbonEquiv = {
    treesPlanted: Math.floor(totalCarbon / 21),
    carsOffRoad: parseFloat((totalCarbon / 46).toFixed(2)),
    homesPowered: parseFloat((totalCarbon / 195).toFixed(2))
  };

  return {
    period, startDate: start.toISOString(), endDate: end.toISOString(),
    trips: { total: totalTrips, byMode: tripsByMode },
    distance: { total: parseFloat(totalDistance.toFixed(2)), unit: 'km', byMode: distanceByMode },
    carbon: { saved: parseFloat(totalCarbon.toFixed(2)), unit: 'kg CO2', equivalent: carbonEquiv },
    health: { caloriesBurned: totalCalories, activeMinutes: Math.round(totalDuration || 0), stepsTaken: Math.round(totalDistance * 1312) },
    cost: { saved: parseFloat(totalCost.toFixed(2)), currency: 'INR', comparedTo: 'private vehicle' },
    weeklyTrend: dailyTrend
  };
};

const achievements = [
  { id: 'ach-001', title: 'Green Commuter', description: 'Completed 10 bus trips in a week', icon: 'bus', category: 'transport', target: 10 },
  { id: 'ach-002', title: 'Carbon Warrior', description: 'Saved 20 kg of CO2 in a month', icon: 'leaf', category: 'environment', target: 20 },
  { id: 'ach-003', title: 'Walking Champion', description: 'Walked 50 km in a month', icon: 'walk', category: 'health', target: 50 },
  { id: 'ach-004', title: 'Early Bird', description: 'Completed 5 trips before 8 AM', icon: 'sunrise', category: 'consistency', target: 5 },
  { id: 'ach-005', title: 'Multimodal Master', description: 'Used 3 different transport modes in a week', icon: 'target', category: 'variety', target: 3 },
  { id: 'ach-006', title: 'Cost Saver', description: 'Saved Rs 1000 by using public transport', icon: 'cash', category: 'financial', target: 1000 }
];

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const { period = 'week' } = req.query;
    const stats = await computeStats(userId, period);
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error getting eco stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/weekly', async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await computeStats(userId, 'week');
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error getting weekly eco stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/monthly', async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await computeStats(userId, 'month');
    res.json({ success: true, data: stats });
  } catch (error) {
    logger.error('Error getting monthly eco stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/achievements', async (req, res) => {
  try {
    const userId = req.user.id;

    const { start: weekStart } = getPeriodRange('week');
    const { start: monthStart } = getPeriodRange('month');

    const weekTrips = await Trip.findAll({ where: { userId, date: { [Op.gte]: weekStart } } });
    const monthTrips = await Trip.findAll({ where: { userId, date: { [Op.gte]: monthStart } } });

    const weekBusTrips = weekTrips.filter(t => t.mode === 'bus').length;
    const monthCarbon = monthTrips.reduce((s, t) => s + (t.carbonSaved || 0), 0);
    const monthWalkDist = monthTrips.filter(t => t.mode === 'walk').reduce((s, t) => s + (t.distance || 0), 0);
    const modesUsed = new Set(weekTrips.map(t => t.mode).filter(Boolean)).size;
    const monthCost = monthTrips.reduce((s, t) => s + (t.cost || 0), 0);

    const computed = achievements.map(a => {
      let current = 0;
      switch (a.id) {
        case 'ach-001': current = weekBusTrips; break;
        case 'ach-002': current = monthCarbon; break;
        case 'ach-003': current = monthWalkDist; break;
        case 'ach-004': current = weekTrips.filter(t => new Date(t.date).getHours() < 8).length; break;
        case 'ach-005': current = modesUsed; break;
        case 'ach-006': current = monthCost; break;
      }
      const unlocked = current >= a.target;
      return { ...a, unlocked, unlockedAt: unlocked ? new Date().toISOString() : null, progress: Math.min(100, Math.round((current / a.target) * 100)), current };
    });

    const unlocked = computed.filter(a => a.unlocked);
    res.json({
      success: true,
      data: { achievements: computed, summary: { total: computed.length, unlocked: unlocked.length, locked: computed.length - unlocked.length, completionRate: Math.round((unlocked.length / computed.length) * 100) } }
    });
  } catch (error) {
    logger.error('Error getting achievements:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/summary', async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await computeStats(userId, 'week');
    const { start: weekStart } = getPeriodRange('week');
    await Trip.count({ where: { userId, date: { [Op.gte]: weekStart } } });
    res.json({
      success: true,
      data: {
        carbonSaved: stats.carbon.saved,
        tripsCompleted: stats.trips.total,
        distanceCovered: stats.distance.total,
        achievementsUnlocked: achievements.length
      }
    });
  } catch (error) {
    logger.error('Error getting summary:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
