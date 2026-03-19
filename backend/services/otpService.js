const axios = require('axios');
const logger = require('../utils/logger');

// OTP API Configuration
const OTP_API_BASE = process.env.OTP_API_URL || 'http://localhost:8080/otp/routers/default';

/**
 * OpenTripPlanner Service Layer
 * Handles all communication with OTP REST API
 */
class OTPService {
  /**
   * Plan a journey between two locations
   * @param {Object} params - Journey parameters
   * @param {string} params.fromPlace - "lat,lon" format
   * @param {string} params.toPlace - "lat,lon" format
   * @param {string} params.modes - Comma-separated modes (e.g., "BUS,WALK")
   * @param {string} params.time - Time in HHMM format (optional)
   * @param {string} params.date - Date in DD-MM-YYYY format (optional)
   * @param {number} params.numItineraries - Number of results (default: 3)
   * @param {boolean} params.wheelchair - Wheelchair accessible (default: false)
   * @returns {Promise<Object>} OTP journey plan response
   */
  async planJourney({
    fromPlace,
    toPlace,
    modes = 'BUS,WALK',
    time = '0800',
    date = null,
    numItineraries = 3,
    wheelchair = false,
    optimize = 'QUICK'
  }) {
    try {
      // Use current date if not provided
      if (!date) {
        const now = new Date();
        date = `${String(now.getDate()).padStart(2, '0')}-${String(now.getMonth() + 1).padStart(2, '0')}-${now.getFullYear()}`;
      }

      // Build OTP API URL
      const url = `${OTP_API_BASE}/plan`;
      const params = new URLSearchParams({
        fromPlace,
        toPlace,
        mode: modes.toUpperCase(),
        time,
        date,
        numItineraries: numItineraries.toString(),
        wheelchair: wheelchair.toString(),
        optimize
      });

      logger.debug(`Calling OTP API: ${url}?${params.toString()}`);

      const response = await axios.get(url, {
        params,
        timeout: 10000, // 10 second timeout
        headers: {
          'Accept': 'application/json'
        }
      });

      logger.debug(`OTP response received: ${response.data.plan?.itineraries?.length || 0} itineraries`);

      return response.data;
    } catch (error) {
      throw this.handleOTPErrors(error);
    }
  }

  /**
   * Parse OTP response into UrbanFlow format
   * @param {Object} otpData - Raw OTP response
   * @returns {Array} Parsed itineraries
   */
  parseOTPResponse(otpData) {
    if (!otpData.plan || !otpData.plan.itineraries) {
      return [];
    }

    return otpData.plan.itineraries.map((itinerary, index) => ({
      id: `itin_${index}_${Date.now()}`,
      duration: itinerary.duration,
      startTime: itinerary.startTime,
      endTime: itinerary.endTime,
      walkDistance: itinerary.walkDistance,
      transitTime: itinerary.transitTime,
      waitingTime: itinerary.waitingTime,
      walkTime: itinerary.walkTime,
      legs: itinerary.legs.map(leg => ({
        mode: leg.mode,
        route: leg.route,
        routeShortName: leg.routeShortName,
        agencyName: leg.agencyName,
        from: {
          name: leg.from.name,
          lat: leg.from.lat,
          lon: leg.from.lon,
          departure: leg.departure,
          stopId: leg.from.stopId
        },
        to: {
          name: leg.to.name,
          lat: leg.to.lat,
          lon: leg.to.lon,
          arrival: leg.arrival,
          stopId: leg.to.stopId
        },
        distance: leg.distance,
        duration: leg.endTime - leg.startTime,
        startTime: leg.startTime,
        endTime: leg.endTime,
        realTime: leg.realTime,
        headsign: leg.headsign,
        interlineWithPreviousLeg: leg.interlineWithPreviousLeg
      }))
    }));
  }

  /**
   * Handle OTP API errors
   * @param {Error} error - Axios error
   * @returns {Error} User-friendly error
   */
  handleOTPErrors(error) {
    logger.error('OTP API Error:', {
      message: error.message,
      code: error.code,
      status: error.response?.status
    });

    if (error.code === 'ECONNREFUSED') {
      return new Error('OpenTripPlanner service is not running. Please start OTP server.');
    }

    if (error.code === 'ETIMEDOUT' || error.code === 'TIMEOUT') {
      return new Error('Journey planning timed out. Please try again.');
    }

    if (error.response?.status === 400) {
      return new Error('Invalid journey parameters. Please check your input.');
    }

    if (error.response?.status === 404) {
      return new Error('No routes found for the specified locations.');
    }

    if (error.response?.status === 500) {
      return new Error('OTP server error. Please try again later.');
    }

    return error;
  }

  /**
   * Check if OTP service is healthy
   * @returns {Promise<boolean>} Health status
   */
  async isHealthy() {
    try {
      const response = await axios.get(`${OTP_API_BASE.replace('/routers/default', '')}/health`, {
        timeout: 5000
      });
      return response.status === 200;
    } catch (error) {
      logger.debug('OTP health check failed:', error.message);
      return false;
    }
  }

  /**
   * Get router information
   * @returns {Promise<Object>} Router info
   */
  async getRouterInfo() {
    try {
      const response = await axios.get(`${OTP_API_BASE}`, {
        timeout: 5000
      });
      return response.data;
    } catch (error) {
      throw new Error(`Failed to get router info: ${error.message}`);
    }
  }
}

module.exports = new OTPService();
