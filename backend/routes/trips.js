const express = require('express');
const router = express.Router();
const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const { Trip } = require('../models');

const getUserId = (req) => {
  try {
    return jwt.decode(req.headers.authorization?.split(' ')[1])?.id || null;
  } catch { return null; }
};

router.get('/stats', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { period = 'week' } = req.query;
    const now = new Date();
    let periodStart;

    switch (period) {
      case 'day': periodStart = new Date(now - 86400000); break;
      case 'week': periodStart = new Date(now - 604800000); break;
      case 'month': periodStart = new Date(now - 2592000000); break;
      case 'year': periodStart = new Date(now - 31536000000); break;
      default: periodStart = new Date(now - 604800000);
    }

    const trips = await Trip.findAll({
      where: { userId, date: { [Op.gte]: periodStart } }
    });

    const stats = {
      period, totalTrips: trips.length,
      totalDistance: trips.reduce((s, t) => s + (t.distance || 0), 0),
      totalDuration: trips.reduce((s, t) => s + (t.duration || 0), 0),
      totalCarbonSaved: trips.reduce((s, t) => s + (t.carbonSaved || 0), 0),
      totalCost: trips.reduce((s, t) => s + (t.cost || 0), 0),
      totalCalories: trips.reduce((s, t) => s + (t.caloriesBurned || 0), 0),
      byMode: {}, dailyTrend: []
    };

    trips.forEach(trip => {
      const m = trip.mode || 'other';
      if (!stats.byMode[m]) stats.byMode[m] = { count: 0, distance: 0, carbonSaved: 0 };
      stats.byMode[m].count++;
      stats.byMode[m].distance += trip.distance || 0;
      stats.byMode[m].carbonSaved += trip.carbonSaved || 0;
    });

    for (let i = 6; i >= 0; i--) {
      const d = new Date(now - i * 86400000);
      const ds = d.toISOString().split('T')[0];
      const dayTrips = trips.filter(t => new Date(t.date).toISOString().startsWith(ds));
      stats.dailyTrend.push({ date: ds, trips: dayTrips.length, distance: dayTrips.reduce((s, t) => s + (t.distance || 0), 0) });
    }

    res.json({ success: true, data: stats });
  } catch (error) {
    console.error('Error getting trip stats:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { limit = 20, offset = 0, mode, startDate, endDate } = req.query;
    const where = { userId };
    if (mode) where.mode = mode;
    if (startDate || endDate) {
      where.date = {};
      if (startDate) where.date[Op.gte] = new Date(startDate);
      if (endDate) where.date[Op.lte] = new Date(endDate);
    }
    const { count, rows } = await Trip.findAndCountAll({ where, order: [['date', 'DESC']], limit: parseInt(limit), offset: parseInt(offset) });
    res.json({ success: true, data: { trips: rows, total: count, limit: parseInt(limit), offset: parseInt(offset) } });
  } catch (error) {
    console.error('Error getting trips:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.get('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });
    res.json({ success: true, data: trip });
  } catch (error) {
    console.error('Error getting trip:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const userId = getUserId(req);
    const { from, to, ...rest } = req.body;
    if (!from || !to) {
      return res.status(400).json({ success: false, error: 'Missing required fields: from, to' });
    }
    const trip = await Trip.create({
      userId, date: new Date(),
      fromName: from.name || '', fromLat: from.lat, fromLon: from.lon,
      toName: to.name || '', toLat: to.lat, toLon: to.lon,
      ...rest
    });
    res.status(201).json({ success: true, data: trip, message: 'Trip created successfully' });
  } catch (error) {
    console.error('Error creating trip:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.put('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });
    await trip.update(req.body);
    res.json({ success: true, data: trip, message: 'Trip updated successfully' });
  } catch (error) {
    console.error('Error updating trip:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const trip = await Trip.findByPk(req.params.id);
    if (!trip) return res.status(404).json({ success: false, error: 'Trip not found' });
    await trip.destroy();
    res.json({ success: true, message: 'Trip deleted successfully' });
  } catch (error) {
    console.error('Error deleting trip:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
