/**
 * Vehicle Position Service
 * Manages real-time bus positions from GTFS-RT feeds
 */

const axios = require('axios');
const gtfsParser = require('./gtfsRealtimeParser');
const logger = require('../utils/logger');

class VehiclePositionService {
  constructor() {
    this.vehiclePositions = new Map(); // Store by vehicleId
    this.lastUpdated = null;
    this.nextUpdate = null;
    this.updateInterval = 30000; // 30 seconds
    this.dultApiUrl = process.env.DULT_VEHICLE_POSITIONS_URL || '';
    this.dultApiKey = process.env.DULT_API_KEY || '';
    
    // Start auto-refresh
    this.startAutoRefresh();
  }

  /**
   * Fetch latest vehicle positions from DULT API
   */
  async fetchVehiclePositions() {
    try {
      if (!this.dultApiUrl) {
        logger.warn('DULT_VEHICLE_POSITIONS_URL not configured, using mock data');
        return this._getMockVehiclePositions();
      }

      const response = await axios.get(this.dultApiUrl, {
        headers: {
          'Authorization': `Bearer ${this.dultApiKey}`,
          'Accept': 'application/x-protobuf'
        },
        responseType: 'arraybuffer',
        timeout: 10000
      });

      const vehicles = gtfsParser.parseVehiclePositions(response.data);
      
      // Update cache
      this.vehiclePositions.clear();
      vehicles.forEach(vehicle => {
        this.vehiclePositions.set(vehicle.vehicleId, vehicle);
      });

      this.lastUpdated = Date.now();
      this.nextUpdate = Date.now() + this.updateInterval;

      logger.info(`Updated ${vehicles.length} vehicle positions`);
      return vehicles;

    } catch (error) {
      logger.error('Error fetching vehicle positions:', error.message);
      
      // Return cached data or mock data as fallback
      if (this.vehiclePositions.size > 0) {
        logger.info('Returning cached vehicle positions');
        return Array.from(this.vehiclePositions.values());
      }
      
      return this._getMockVehiclePositions();
    }
  }

  /**
   * Get all vehicle positions
   * @param {Object} filters - Optional filters
   * @returns {Array} Array of vehicle positions
   */
  getAllVehicles(filters = {}) {
    let vehicles = Array.from(this.vehiclePositions.values());

    // Apply filters
    if (filters.routeId) {
      vehicles = vehicles.filter(v => v.routeId === filters.routeId);
    }

    if (filters.status) {
      vehicles = vehicles.filter(v => v.currentStatus === filters.status);
    }

    if (filters.lat && filters.lon && filters.radius) {
      vehicles = vehicles.filter(v => {
        const distance = this._calculateDistance(
          filters.lat, filters.lon,
          v.latitude, v.longitude
        );
        return distance <= filters.radius;
      });
    }

    return vehicles;
  }

  /**
   * Get vehicle by ID
   * @param {string} vehicleId 
   * @returns {Object|null}
   */
  getVehicleById(vehicleId) {
    return this.vehiclePositions.get(vehicleId) || null;
  }

  /**
   * Get vehicles for a specific route
   * @param {string} routeId 
   * @returns {Array}
   */
  getVehiclesByRoute(routeId) {
    return this.getAllVehicles({ routeId });
  }

  /**
   * Calculate delay status based on schedule
   * @param {Object} vehicle 
   * @returns {string} on-time, delayed, or early
   */
  calculateDelayStatus(vehicle) {
    // This would integrate with schedule data
    // For now, use occupancy as a proxy
    if (vehicle.occupancyStatus === 'FULL' || 
        vehicle.occupancyStatus === 'CRUSHED_STANDING_ROOM_ONLY') {
      return 'delayed';
    }
    
    if (vehicle.congestionLevel === 'RUNNING_SMOOTHLY') {
      return 'on-time';
    }

    if (vehicle.congestionLevel === 'SEVERE_CONGESTION') {
      return 'delayed';
    }

    return 'on-time';
  }

  /**
   * Start automatic refresh of vehicle positions
   */
  startAutoRefresh() {
    setInterval(async () => {
      try {
        await this.fetchVehiclePositions();
      } catch (error) {
        logger.error('Auto-refresh failed:', error.message);
      }
    }, this.updateInterval);

    logger.info('Vehicle position auto-refresh started');
  }

  /**
   * Get service status
   */
  getStatus() {
    return {
      totalVehicles: this.vehiclePositions.size,
      lastUpdated: this.lastUpdated,
      nextUpdate: this.nextUpdate,
      isRunning: true
    };
  }

  /**
   * Calculate distance between two points (Haversine formula)
   * @returns {number} Distance in kilometers
   */
  _calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // Earth's radius in km
    const dLat = this._toRad(lat2 - lat1);
    const dLon = this._toRad(lon2 - lon1);
    
    const a = Math.sin(dLat/2) * Math.sin(dLat/2) +
              Math.cos(this._toRad(lat1)) * Math.cos(this._toRad(lat2)) *
              Math.sin(dLon/2) * Math.sin(dLon/2);
    
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  }

  _toRad(degrees) {
    return degrees * Math.PI / 180;
  }

  /**
   * Generate mock vehicle positions for development/testing
   */
  _getMockVehiclePositions() {
    const mockVehicles = [
      {
        vehicleId: 'BMTC-500A-001',
        routeId: '500A',
        latitude: 12.9716,
        longitude: 77.5946,
        bearing: 45,
        speed: 8.5,
        timestamp: Date.now(),
        currentStatus: 'IN_TRANSIT_TO',
        occupancyStatus: 'MANY_SEATS_AVAILABLE',
        congestionLevel: 'RUNNING_SMOOTHLY'
      },
      {
        vehicleId: 'BMTC-500A-002',
        routeId: '500A',
        latitude: 12.9352,
        longitude: 77.6245,
        bearing: 90,
        speed: 5.2,
        timestamp: Date.now(),
        currentStatus: 'STOPPED_AT',
        occupancyStatus: 'FEW_SEATS_AVAILABLE',
        congestionLevel: 'STOP_AND_GO'
      },
      {
        vehicleId: 'BMTC-201B-001',
        routeId: '201B',
        latitude: 12.9698,
        longitude: 77.7499,
        bearing: 180,
        speed: 12.3,
        timestamp: Date.now(),
        currentStatus: 'IN_TRANSIT_TO',
        occupancyStatus: 'STANDING_ROOM_ONLY',
        congestionLevel: 'CONGESTION'
      },
      {
        vehicleId: 'BMTC-KIA-001',
        routeId: 'KIA-6',
        latitude: 13.1986,
        longitude: 77.7066,
        bearing: 270,
        speed: 15.0,
        timestamp: Date.now(),
        currentStatus: 'IN_TRANSIT_TO',
        occupancyStatus: 'MANY_SEATS_AVAILABLE',
        congestionLevel: 'RUNNING_SMOOTHLY'
      }
    ];

    // Update cache with mock data
    this.vehiclePositions.clear();
    mockVehicles.forEach(vehicle => {
      this.vehiclePositions.set(vehicle.vehicleId, vehicle);
    });

    this.lastUpdated = Date.now();
    this.nextUpdate = Date.now() + this.updateInterval;

    return mockVehicles;
  }
}

// Singleton instance
const service = new VehiclePositionService();

module.exports = service;
