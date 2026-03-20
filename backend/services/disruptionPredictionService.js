/**
 * Disruption Prediction Service
 * Simple rule-based model to predict delays based on historical patterns
 */

const logger = require('../utils/logger');

class DisruptionPredictionService {
  constructor() {
    // In-memory storage for delay history
    this.delayHistory = new Map(); // routeId -> [delay records]
    this.maxHistoryLength = 100; // Keep last 100 records per route
  }

  /**
   * Record a delay observation
   */
  recordDelay(routeId, tripId, delayMinutes, timestamp = Date.now()) {
    if (!this.delayHistory.has(routeId)) {
      this.delayHistory.set(routeId, []);
    }

    const history = this.delayHistory.get(routeId);
    history.push({
      tripId,
      delayMinutes,
      timestamp,
      hour: new Date(timestamp).getHours(),
      dayOfWeek: new Date(timestamp).getDay()
    });

    // Trim history to max length
    if (history.length > this.maxHistoryLength) {
      history.shift();
    }

    logger.debug(`Recorded delay for route ${routeId}: ${delayMinutes.toFixed(1)} min`);
  }

  /**
   * Predict if a route will experience delays
   * Simple rule-based model:
   * - If average delay at this time of day > 5 min in last 3 days → PREDICT DELAY
   * - If >70% of trips delayed in last 3 days → PREDICT DELAY
   * - Otherwise → ON TIME
   */
  predictDisruption(routeId, currentHour = new Date().getHours()) {
    const history = this.delayHistory.get(routeId);
    
    if (!history || history.length === 0) {
      return {
        prediction: 'on-time',
        confidence: 0.50,
        expectedDelay: 0,
        reason: 'Insufficient historical data'
      };
    }

    // Filter to same time window (±2 hours) over last 3 days
    const now = Date.now();
    const threeDaysAgo = now - (3 * 24 * 60 * 60 * 1000);
    
    const relevantRecords = history.filter(record => {
      const recordTime = record.timestamp;
      const recordHour = record.hour;
      
      // Within last 3 days
      if (recordTime < threeDaysAgo) return false;
      
      // Same time window (±2 hours)
      const hourDiff = Math.abs(recordHour - currentHour);
      return hourDiff <= 2;
    });

    if (relevantRecords.length < 3) {
      return {
        prediction: 'on-time',
        confidence: 0.50,
        expectedDelay: 0,
        reason: 'Limited historical data for this time window'
      };
    }

    // Calculate statistics
    const totalRecords = relevantRecords.length;
    const delayedRecords = relevantRecords.filter(r => r.delayMinutes > 5);
    const avgDelay = relevantRecords.reduce((sum, r) => sum + r.delayMinutes, 0) / totalRecords;
    const maxDelay = Math.max(...relevantRecords.map(r => r.delayMinutes));
    const delayRate = delayedRecords.length / totalRecords;

    // Apply prediction rules
    let prediction = 'on-time';
    let confidence = 0.50;
    let reasons = [];

    // Rule 1: High average delay
    if (avgDelay > 5) {
      prediction = 'delayed';
      confidence += 0.20;
      reasons.push(`Average delay ${avgDelay.toFixed(1)} min at this time`);
    }

    // Rule 2: High delay frequency
    if (delayRate > 0.7) {
      prediction = 'delayed';
      confidence += 0.25;
      reasons.push(`${(delayRate * 100).toFixed(0)}% of trips delayed recently`);
    } else if (delayRate > 0.4) {
      confidence += 0.10;
      reasons.push(`${(delayRate * 100).toFixed(0)}% of trips delayed`);
    }

    // Rule 3: Severe delays present
    if (maxDelay > 15) {
      confidence += 0.10;
      reasons.push('Severe delays observed (>15 min)');
    }

    // Cap confidence at 0.95
    confidence = Math.min(confidence, 0.95);

    const result = {
      prediction,
      confidence: parseFloat(confidence.toFixed(2)),
      expectedDelay: prediction === 'delayed' ? avgDelay : 0,
      historicalAvgDelay: avgDelay,
      delayRate: parseFloat(delayRate.toFixed(2)),
      sampleSize: relevantRecords.length,
      reason: reasons.join('. ') || 'No significant delay patterns detected'
    };

    logger.debug(`Prediction for route ${routeId}: ${prediction} (${confidence.toFixed(2)})`);
    
    return result;
  }

  /**
   * Get proactive warning for a specific trip
   */
  getProactiveWarning(routeId, tripId, scheduledDeparture) {
    const departureHour = new Date(scheduledDeparture).getHours();
    const prediction = this.predictDisruption(routeId, departureHour);

    if (prediction.prediction === 'delayed' && prediction.confidence >= 0.70) {
      return {
        warning: true,
        severity: prediction.confidence >= 0.85 ? 'high' : 'medium',
        message: `Expected delay of ${prediction.expectedDelay.toFixed(0)} minutes based on recent patterns`,
        recommendation: prediction.expectedDelay > 10 
          ? 'Consider leaving earlier or checking alternative routes'
          : 'Monitor real-time status before departure',
        confidence: prediction.confidence,
        expectedDelay: prediction.expectedDelay
      };
    }

    return {
      warning: false,
      message: 'No disruptions expected'
    };
  }

  /**
   * Clear history for a route
   */
  clearHistory(routeId) {
    if (routeId) {
      this.delayHistory.delete(routeId);
    } else {
      this.delayHistory.clear();
    }
    logger.info(`Cleared delay history${routeId ? ` for route ${routeId}` : ''}`);
  }

  /**
   * Get statistics for a route
   */
  getStats(routeId) {
    const history = this.delayHistory.get(routeId);
    
    if (!history || history.length === 0) {
      return {
        routeId,
        totalRecords: 0,
        avgDelay: 0,
        delayRate: 0
      };
    }

    const totalRecords = history.length;
    const delayedTrips = history.filter(r => r.delayMinutes > 5);
    const avgDelay = history.reduce((sum, r) => sum + r.delayMinutes, 0) / totalRecords;
    const delayRate = delayedTrips.length / totalRecords;

    return {
      routeId,
      totalRecords,
      avgDelay: parseFloat(avgDelay.toFixed(2)),
      delayRate: parseFloat(delayRate.toFixed(2)),
      maxDelay: Math.max(...history.map(r => r.delayMinutes)),
      minDelay: Math.min(...history.map(r => r.delayMinutes))
    };
  }
}

// Export singleton instance
module.exports = new DisruptionPredictionService();
