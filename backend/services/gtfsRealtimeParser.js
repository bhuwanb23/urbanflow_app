/**
 * GTFS-Realtime Parser Service
 * Parses GTFS-RT protobuf feeds from DULT portal
 * 
 * Feeds:
 * - VehiclePositions: Real-time bus locations
 * - TripUpdates: Delay predictions and schedule changes
 * - Alerts: Service disruptions and incidents
 */

const fs = require('fs');
const path = require('path');
const gtfsRealtimeBindings = require('gtfs-realtime-bindings');
const logger = require('../utils/logger');

class GtfsRealtimeParser {
  constructor() {
    this.loadedFeeds = {};
  }

  /**
   * Parse VehiclePositions feed from protobuf buffer
   * @param {Buffer} protobufBuffer - Raw protobuf data from DULT API
   * @returns {Array} Array of vehicle position objects
   */
  parseVehiclePositions(protobufBuffer) {
    try {
      const feed = gtfsRealtimeBindings.transit_realtime.FeedMessage.decode(protobufBuffer);
      
      if (!feed.entity || !Array.isArray(feed.entity)) {
        logger.warn('Invalid VehiclePositions feed structure');
        return [];
      }

      const vehicles = feed.entity
        .filter(entity => entity.vehicle)
        .map(entity => {
          const vehicle = entity.vehicle;
          
          return {
            vehicleId: vehicle.vehicle?.id || '',
            routeId: vehicle.trip?.routeId || '',
            tripId: vehicle.trip?.tripId || '',
            latitude: vehicle.position?.latitude || null,
            longitude: vehicle.position?.longitude || null,
            bearing: vehicle.position?.bearing || 0,
            speed: vehicle.position?.speed || 0, // meters per second
            timestamp: vehicle.timestamp ? vehicle.timestamp.toNumber() * 1000 : Date.now(),
            currentStopSequence: vehicle.currentStopSequence || null,
            stopId: vehicle.stopId || null,
            currentStatus: this._parseVehicleStatus(vehicle.currentStatus),
            occupancyStatus: this._parseOccupancyStatus(vehicle.occupancyStatus),
            congestionLevel: this._parseCongestionLevel(vehicle.congestionLevel)
          };
        })
        .filter(v => v.latitude !== null && v.longitude !== null); // Only valid positions

      logger.info(`Parsed ${vehicles.length} vehicle positions`);
      return vehicles;
    } catch (error) {
      logger.error('Error parsing VehiclePositions:', error.message);
      return [];
    }
  }

  /**
   * Parse TripUpdates feed from protobuf buffer
   * @param {Buffer} protobufBuffer - Raw protobuf data from DULT API
   * @returns {Array} Array of trip update objects with delay predictions
   */
  parseTripUpdates(protobufBuffer) {
    try {
      const feed = gtfsRealtimeBindings.transit_realtime.FeedMessage.decode(protobufBuffer);
      
      if (!feed.entity || !Array.isArray(feed.entity)) {
        logger.warn('Invalid TripUpdates feed structure');
        return [];
      }

      const updates = feed.entity
        .filter(entity => entity.tripUpdate)
        .flatMap(entity => {
          const tripUpdate = entity.tripUpdate;
          const tripId = tripUpdate.trip?.tripId || '';
          const routeId = tripUpdate.trip?.routeId || '';
          
          // Extract stop time updates
          if (!tripUpdate.stopTimeUpdate || !Array.isArray(tripUpdate.stopTimeUpdate)) {
            return [];
          }

          return tripUpdate.stopTimeUpdate.map(stopUpdate => {
            const arrivalDelay = stopUpdate.arrival?.delay || 0;
            const departureDelay = stopUpdate.departure?.delay || 0;
            const maxDelay = Math.max(arrivalDelay, departureDelay);
            
            return {
              tripId,
              routeId,
              stopId: stopUpdate.stopId || '',
              stopSequence: stopUpdate.stopSequence || 0,
              arrivalDelay: arrivalDelay, // seconds
              departureDelay: departureDelay, // seconds
              maxDelay: maxDelay,
              prediction: this._calculatePrediction(maxDelay),
              confidence: this._calculateConfidence(arrivalDelay, departureDelay),
              timestamp: stopUpdate.arrival?.time 
                ? stopUpdate.arrival.time.toNumber() * 1000 
                : Date.now()
            };
          });
        });

      logger.info(`Parsed ${updates.length} trip updates`);
      return updates;
    } catch (error) {
      logger.error('Error parsing TripUpdates:', error.message);
      return [];
    }
  }

  /**
   * Parse Alerts feed from protobuf buffer
   * @param {Buffer} protobufBuffer - Raw protobuf data from DULT API
   * @returns {Array} Array of service alert objects
   */
  parseAlerts(protobufBuffer) {
    try {
      const feed = gtfsRealtimeBindings.transit_realtime.FeedMessage.decode(protobufBuffer);
      
      if (!feed.entity || !Array.isArray(feed.entity)) {
        logger.warn('Invalid Alerts feed structure');
        return [];
      }

      const alerts = feed.entity
        .filter(entity => entity.alert)
        .map(entity => {
          const alert = entity.alert;
          
          // Get description text
          const description = this._getTranslation(alert.descriptionText);
          const header = this._getTranslation(alert.headerText);
          
          // Get affected entities
          const informedEntities = alert.informedEntity || [];
          const affectedRoutes = informedEntities
            .filter(e => e.routeId)
            .map(e => ({
              routeId: e.routeId,
              agencyId: e.agencyId || ''
            }));

          return {
            alertId: entity.id || `alert_${Date.now()}`,
            header: header || 'Service Alert',
            description: description || '',
            severityLevel: this._parseSeverity(alert.effect),
            cause: this._parseCause(alert.cause),
            effect: this._parseEffect(alert.effect),
            url: this._getTranslation(alert.url),
            activePeriod: {
              start: alert.activePeriod?.[0]?.start 
                ? alert.activePeriod[0].start.toNumber() * 1000 
                : Date.now(),
              end: alert.activePeriod?.[0]?.end 
                ? alert.activePeriod[0].end.toNumber() * 1000 
                : null
            },
            affectedRoutes,
            informedEntity: informedEntities
          };
        });

      logger.info(`Parsed ${alerts.length} service alerts`);
      return alerts;
    } catch (error) {
      logger.error('Error parsing Alerts:', error.message);
      return [];
    }
  }

  /**
   * Load GTFS-RT feed from file (for development/testing)
   * @param {string} filePath - Path to protobuf file
   * @param {string} feedType - Type of feed: 'vehicle', 'trip', or 'alert'
   * @returns {Array} Parsed feed data
   */
  loadFeedFromFile(filePath, feedType) {
    try {
      const buffer = fs.readFileSync(filePath);
      
      switch (feedType.toLowerCase()) {
        case 'vehicle':
          return this.parseVehiclePositions(buffer);
        case 'trip':
          return this.parseTripUpdates(buffer);
        case 'alert':
          return this.parseAlerts(buffer);
        default:
          logger.error('Unknown feed type:', feedType);
          return [];
      }
    } catch (error) {
      logger.error('Error loading feed from file:', error.message);
      return [];
    }
  }

  // Helper methods

  _parseVehicleStatus(status) {
    const statusMap = {
      0: 'MISSING_DATA',
      1: 'INCOMING_AT',
      2: 'IN_TRANSIT_TO',
      3: 'IN_COMING_TO',
      4: 'STOPPED_AT',
      5: 'IDENTIFIED',
      6: 'NOT_ACCEPTING_PASSENGERS',
      7: 'NO_DATA_AVAILABLE',
      8: 'DEPARTED'
    };
    return statusMap[status] || 'UNKNOWN';
  }

  _parseOccupancyStatus(status) {
    const occupancyMap = {
      0: 'EMPTY',
      1: 'MANY_SEATS_AVAILABLE',
      2: 'FEW_SEATS_AVAILABLE',
      3: 'STANDING_ROOM_ONLY',
      4: 'CRUSHED_STANDING_ROOM_ONLY',
      5: 'FULL',
      6: 'NOT_ACCEPTING_PASSENGERS',
      7: 'NO_DATA_AVAILABLE',
      8: 'NOT_BOARDABLE'
    };
    return occupancyMap[status] || 'UNKNOWN';
  }

  _parseCongestionLevel(level) {
    const levelMap = {
      0: 'UNKNOWN_CONGESTION',
      1: 'RUNNING_SMOOTHLY',
      2: 'STOP_AND_GO',
      3: 'CONGESTION',
      4: 'SEVERE_CONGESTION'
    };
    return levelMap[level] || 'UNKNOWN';
  }

  _calculatePrediction(delaySeconds) {
    const delayMinutes = delaySeconds / 60;
    
    if (Math.abs(delayMinutes) < 2) {
      return 'on-time';
    } else if (delayMinutes > 5) {
      return 'delayed';
    } else if (delayMinutes < -5) {
      return 'early';
    } else {
      return 'minor-delay';
    }
  }

  _calculateConfidence(arrivalDelay, departureDelay) {
    // Higher confidence if both arrival and departure delays are similar
    const diff = Math.abs(arrivalDelay - departureDelay);
    if (diff < 30) return 0.95; // Very confident
    if (diff < 60) return 0.85; // Confident
    if (diff < 120) return 0.70; // Moderate
    return 0.50; // Low confidence
  }

  _getTranslation(translatedText) {
    if (!translatedText || !Array.isArray(translatedText)) {
      return '';
    }
    // Return first available translation (prefer English)
    const english = translatedText.find(t => t.language === 'en');
    return english?.text || translatedText[0]?.text || '';
  }

  _parseSeverity(effect) {
    const severityMap = {
      1: 'INFO',      // NO_SERVICE
      2: 'INFO',      // REDUCED_SERVICE
      3: 'WARNING',   // SIGNIFICANT_DELAYS
      4: 'WARNING',   // DETOUR
      5: 'WARNING',   // ADDITIONAL_SERVICE
      6: 'INFO',      // MODIFIED_PATH
      7: 'CRITICAL',  // STOP_MOVED
      8: 'INFO',      // UNKNOWN_EFFECT
    };
    return severityMap[effect] || 'INFO';
  }

  _parseCause(cause) {
    const causeMap = {
      1: 'UNKNOWN_CAUSE',
      2: 'OTHER_CAUSE',
      3: 'TECHNICAL_PROBLEM',
      4: 'STRIKE',
      5: 'DEMONSTRATION',
      6: 'ACCIDENT',
      7: 'HOLIDAY',
      8: 'WEATHER',
      9: 'MAINTENANCE',
      10: 'CONSTRUCTION',
      11: 'POLICE_ACTIVITY',
      12: 'MEDICAL_EMERGENCY'
    };
    return causeMap[cause] || 'UNKNOWN_CAUSE';
  }

  _parseEffect(effect) {
    const effectMap = {
      1: 'NO_SERVICE',
      2: 'REDUCED_SERVICE',
      3: 'SIGNIFICANT_DELAYS',
      4: 'DETOUR',
      5: 'ADDITIONAL_SERVICE',
      6: 'MODIFIED_PATH',
      7: 'STOP_MOVED',
      8: 'UNKNOWN_EFFECT'
    };
    return effectMap[effect] || 'UNKNOWN_EFFECT';
  }
}

// Singleton instance
const parser = new GtfsRealtimeParser();

module.exports = parser;
