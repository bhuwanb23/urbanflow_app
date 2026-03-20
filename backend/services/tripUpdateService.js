/**
 * Trip Update Service
 * Manages real-time delay predictions from GTFS-RT feeds
 */

const axios = require('axios');
const gtfsParser = require('./gtfsRealtimeParser');
const logger = require('../utils/logger');

class TripUpdateService {
  constructor() {
    this.tripUpdates = new Map(); // Store by tripId
    this.lastUpdated = null;
    this.nextUpdate = null;
    this.updateInterval = 30000; // 30 seconds
    this.dultApiUrl = process.env.DULT_TRIP_UPDATES_URL || '';
    this.dultApiKey = process.env.DULT_API_KEY || '';
    
    // Start auto-refresh
    this.startAutoRefresh();
  }

  /**
   * Fetch latest trip updates from DULT API
   */
  async fetchTripUpdates() {
    try {
      if (!this.dultApiUrl) {
        logger.warn('DULT_TRIP_UPDATES_URL not configured, using mock data');
        return this._getMockTripUpdates();
      }

      const response = await axios.get(this.dultApiUrl, {
        headers: {
          'Authorization': `Bearer ${this.dultApiKey}`,
          'Accept': 'application/x-protobuf'
        },
        responseType: 'arraybuffer',
        timeout: 10000
      });

      const updates = gtfsParser.parseTripUpdates(response.data);
      
      // Update cache - group by tripId
      this.tripUpdates.clear();
      updates.forEach(update => {
        const key = `${update.tripId}_${update.stopId}`;
        this.tripUpdates.set(key, update);
      });

      this.lastUpdated = Date.now();
      this.nextUpdate = Date.now() + this.updateInterval;

      logger.info(`Updated ${updates.length} trip updates`);
      return updates;

    } catch (error) {
      logger.error('Error fetching trip updates:', error.message);
      
      // Return cached data or mock data as fallback
      if (this.tripUpdates.size > 0) {
        logger.info('Returning cached trip updates');
        return Array.from(this.tripUpdates.values());
      }
      
      return this._getMockTripUpdates();
    }
  }

  /**
   * Get all trip updates
   * @param {Object} filters - Optional filters
   * @returns {Array} Array of trip updates
   */
  getAllUpdates(filters = {}) {
    let updates = Array.from(this.tripUpdates.values());

    // Apply filters
    if (filters.routeId) {
      updates = updates.filter(u => u.routeId === filters.routeId);
    }

    if (filters.prediction) {
      updates = updates.filter(u => u.prediction === filters.prediction);
    }

    if (filters.minDelay) {
      updates = updates.filter(u => Math.abs(u.maxDelay) >= filters.minDelay);
    }

    return updates;
  }

  /**
   * Get delays for a specific route
   * @param {string} routeId 
   * @returns {Array}
   */
  getDelaysByRoute(routeId) {
    return this.getAllUpdates({ routeId });
  }

  /**
   * Get delay prediction for a specific trip and stop
   * @param {string} tripId 
   * @param {string} stopId 
   * @returns {Object|null}
   */
  getDelayForTrip(tripId, stopId) {
    const key = `${tripId}_${stopId}`;
    return this.tripUpdates.get(key) || null;
  }

  /**
   * Get average delay for a route
   * @param {string} routeId 
   * @returns {Object} Average delay in seconds and status
   */
  getAverageDelayForRoute(routeId) {
    const updates = this.getDelaysByRoute(routeId);
    
    if (updates.length === 0) {
      return {
        averageDelay: 0,
        status: 'on-time',
        totalTrips: 0
      };
    }

    const totalDelay = updates.reduce((sum, u) => sum + u.maxDelay, 0);
    const averageDelay = totalDelay / updates.length;

    return {
      averageDelay: Math.round(averageDelay),
      status: this._calculateOverallStatus(averageDelay),
      totalTrips: updates.length,
      delayedCount: updates.filter(u => u.prediction === 'delayed').length,
      onTimeCount: updates.filter(u => u.prediction === 'on-time').length,
      earlyCount: updates.filter(u => u.prediction === 'early').length
    };
  }

  /**
   * Get severely delayed trips (>5 minutes)
   * @returns {Array}
   */
  getSevereDelays() {
    return this.getAllUpdates().filter(u => {
      return u.prediction === 'delayed' && u.maxDelay > 300; // 5 minutes
    });
  }

  /**
   * Start automatic refresh of trip updates
   */
  startAutoRefresh() {
    setInterval(async () => {
      try {
        await this.fetchTripUpdates();
      } catch (error) {
        logger.error('Auto-refresh failed:', error.message);
      }
    }, this.updateInterval);

    logger.info('Trip update auto-refresh started');
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      totalUpdates: this.tripUpdates.size,
      lastUpdated: this.lastUpdated,
      nextUpdate: this.nextUpdate,
      isRunning: true
    };
  }

  /**
   * Calculate overall status from average delay
   */
  _calculateOverallStatus(averageDelaySeconds) {
    const averageDelayMinutes = averageDelaySeconds / 60;
    
    if (Math.abs(averageDelayMinutes) < 2) {
      return 'on-time';
    } else if (averageDelayMinutes > 5) {
      return 'severely-delayed';
    } else if (averageDelayMinutes > 2) {
      return 'delayed';
    } else if (averageDelayMinutes < -5) {
      return 'early';
    } else {
      return 'minor-delay';
    }
  }

  /**
   * Generate mock trip updates for development/testing
   */
  _getMockTripUpdates() {
    const mockUpdates = [
      {
        tripId: 'TRIP_500A_001',
        routeId: '500A',
        stopId: 'STOP_KORAMANGALA',
        stopSequence: 5,
        arrivalDelay: 120, // 2 minutes late
        departureDelay: 135,
        maxDelay: 135,
        prediction: 'minor-delay',
        confidence: 0.90,
        timestamp: Date.now()
      },
      {
        tripId: 'TRIP_500A_002',
        routeId: '500A',
        stopId: 'STOP_SILK_BOARD',
        stopSequence: 8,
        arrivalDelay: 420, // 7 minutes late
        departureDelay: 450,
        maxDelay: 450,
        prediction: 'delayed',
        confidence: 0.85,
        timestamp: Date.now()
      },
      {
        tripId: 'TRIP_201B_001',
        routeId: '201B',
        stopId: 'STOP_MG_ROAD',
        stopSequence: 3,
        arrivalDelay: -60, // 1 minute early
        departureDelay: -90,
        maxDelay: -60,
        prediction: 'on-time',
        confidence: 0.95,
        timestamp: Date.now()
      },
      {
        tripId: 'TRIP_KIA6_001',
        routeId: 'KIA-6',
        stopId: 'STOP_AIRPORT',
        stopSequence: 1,
        arrivalDelay: 600, // 10 minutes late
        departureDelay: 600,
        maxDelay: 600,
        prediction: 'delayed',
        confidence: 0.80,
        timestamp: Date.now()
      }
    ];

    // Update cache with mock data
    this.tripUpdates.clear();
    mockUpdates.forEach(update => {
      const key = `${update.tripId}_${update.stopId}`;
      this.tripUpdates.set(key, update);
    });

    this.lastUpdated = Date.now();
    this.nextUpdate = Date.now() + this.updateInterval;

    return mockUpdates;
  }
}

// Singleton instance
const service = new TripUpdateService();

module.exports = service;
