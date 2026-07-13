const express = require('express');
const router = express.Router();
const { Trip } = require('../models');
const logger = require('../utils/logger');

// Modes ordered from least to most eco-friendly (proxy for carbon intensity).
const ECO_RANKING = {
  car: 0,
  auto: 1,
  taxi: 1,
  bus: 2,
  metro: 3,
  train: 3,
  bike: 4,
  bicycle: 4,
  cycle: 4,
  walk: 5,
  walking: 5,
};

const ECO_FRIENDLY_MODES = ['walk', 'bike', 'metro', 'bus'];

const MOST_FREQUENT_ROUTE = 'rec-frequent-route';
const TIME_OF_DAY = 'rec-time-of-day';
const ECO_ALTERNATIVE = 'rec-eco-alternative';

const buildRecommendations = (trips, currentHour) => {
  const recommendations = [];

  if (!trips.length) {
    return recommendations;
  }

  // --- Frequency counts -------------------------------------------------
  const byRouteId = {};
  const byMode = {};
  const byHourMode = {}; // hour -> { mode -> count }

  trips.forEach((trip) => {
    const routeId = trip.routeId;
    const mode = trip.mode || 'unknown';
    const hour = new Date(trip.date).getHours();

    if (routeId) {
      byRouteId[routeId] = (byRouteId[routeId] || 0) + 1;
    }

    byMode[mode] = (byMode[mode] || 0) + 1;

    if (!byHourMode[hour]) byHourMode[hour] = {};
    byHourMode[hour][mode] = (byHourMode[hour][mode] || 0) + 1;
  });

  const topRouteId = Object.keys(byRouteId).sort((a, b) => byRouteId[b] - byRouteId[a])[0];
  const topRouteCount = topRouteId ? byRouteId[topRouteId] : 0;
  const topMode = Object.keys(byMode).sort((a, b) => byMode[b] - byMode[a])[0];

  const totalTrips = trips.length;
  const routeIdsWithData = Object.keys(byRouteId).length;
  const distinctHours = Object.keys(byHourMode).length;

  // --- 1. Most frequently used route -----------------------------------
  if (topRouteId) {
    const confidence = parseFloat((topRouteCount / totalTrips).toFixed(2));
    recommendations.push({
      id: MOST_FREQUENT_ROUTE,
      title: `Your usual route ${topRouteId}`,
      description: `You have taken route ${topRouteId} ${topRouteCount} time${topRouteCount === 1 ? '' : 's'} — it's your most travelled route.`,
      mode: topMode,
      routeId: topRouteId,
      confidence,
      reason: 'Based on your most frequently travelled route from trip history.',
    });
  }

  // --- 2. Time-of-day pattern ------------------------------------------
  const hourKey = String(currentHour);
  const hourBuckets = byHourMode[currentHour] || byHourMode[hourKey] || {};
  const hourModes = Object.keys(hourBuckets);
  if (hourModes.length) {
    const hourTopMode = hourModes.sort((a, b) => hourBuckets[b] - hourBuckets[a])[0];
    const hourTopCount = hourBuckets[hourTopMode];
    const hourTopRouteId = (() => {
      const matching = trips.filter((t) => {
        const h = new Date(t.date).getHours();
        return h === currentHour && (t.mode || 'unknown') === hourTopMode && t.routeId;
      });
      const counts = {};
      matching.forEach((t) => { counts[t.routeId] = (counts[t.routeId] || 0) + 1; });
      return Object.keys(counts).sort((a, b) => counts[b] - counts[a])[0];
    })();

    const confidence = parseFloat((hourTopCount / Math.max(1, trips.filter((t) => new Date(t.date).getHours() === currentHour).length)).toFixed(2));
    recommendations.push({
      id: TIME_OF_DAY,
      title: `Typical trip around ${currentHour}:00`,
      description: hourTopRouteId
        ? `Around this time of day you usually take route ${hourTopRouteId} (${hourTopMode}).`
        : `Around this time of day you usually travel by ${hourTopMode}.`,
      mode: hourTopMode,
      routeId: hourTopRouteId || null,
      confidence,
      reason: `Based on trips you've taken near ${currentHour}:00 in the past.`,
    });
  }

  // --- 3. Eco-friendlier alternative -----------------------------------
  if (topMode && ECO_RANKING[topMode] !== undefined) {
    const greener = ECO_FRIENDLY_MODES
      .filter((m) => (ECO_RANKING[m] || 0) > ECO_RANKING[topMode])
      .sort((a, b) => (ECO_RANKING[b] || 0) - (ECO_RANKING[a] || 0))[0];
    if (greener) {
      recommendations.push({
        id: ECO_ALTERNATIVE,
        title: `Try ${greener} instead of ${topMode}`,
        description: `Your most used mode is ${topMode}. Switching some trips to ${greener} can lower your carbon footprint.`,
        mode: greener,
        routeId: null,
        confidence: parseFloat((byMode[topMode] / totalTrips).toFixed(2)),
        reason: `Based on your dominant mode (${topMode}) and a lower-carbon alternative.`,
      });
    }
  }

  // Boost confidence slightly when we have richer history.
  if (routeIdsWithData >= 3 && distinctHours >= 3) {
    recommendations.forEach((r) => {
      r.confidence = parseFloat(Math.min(1, r.confidence + 0.1).toFixed(2));
    });
  }

  return recommendations;
};

router.get('/', async (req, res) => {
  try {
    const userId = req.user.id;
    const trips = await Trip.findAll({
      where: { userId },
      attributes: ['id', 'routeId', 'mode', 'date', 'distance'],
      order: [['date', 'DESC']],
    });

    const now = new Date();
    const currentHour = now.getHours();
    const recommendations = buildRecommendations(trips, currentHour);

    res.json({
      success: true,
      data: {
        recommendations,
        experimental: true,
        message: recommendations.length
          ? undefined
          : 'No trip history yet — start logging trips to get personalized recommendations.',
        generatedAt: now.toISOString(),
      },
    });
  } catch (error) {
    logger.error('Error getting recommendations:', error);
    res.status(500).json({ success: false, error: error.message });
  }
});

module.exports = router;
