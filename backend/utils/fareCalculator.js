/**
 * Fare Calculator Utility
 * Aggregates fares from GTFS data and calculates total journey cost
 * Supports: bengaluru (default), delhi, chennai
 */

const logger = require('./logger');

// City-specific fare structures
const CITY_FARE_STRUCTURES = {
  bengaluru: {
    bus: { minFare: 10, maxFare: 75, farePerKm: 2.5, airConditionedMultiplier: 1.5 },
    metro: {
      minFare: 10, maxFare: 60,
      fareStages: [
        { distance: 2, fare: 10 }, { distance: 5, fare: 20 },
        { distance: 10, fare: 30 }, { distance: 15, fare: 40 },
        { distance: 20, fare: 50 }, { distance: Infinity, fare: 60 }
      ]
    }
  },
  delhi: {
    bus: { minFare: 5, maxFare: 25, farePerKm: 1.5, airConditionedMultiplier: 2.0 },
    metro: {
      minFare: 10, maxFare: 60,
      fareStages: [
        { distance: 2, fare: 10 }, { distance: 5, fare: 20 },
        { distance: 10, fare: 30 }, { distance: 15, fare: 40 },
        { distance: 20, fare: 50 }, { distance: Infinity, fare: 60 }
      ]
    }
  },
  chennai: {
    bus: { minFare: 7, maxFare: 40, farePerKm: 2.0, airConditionedMultiplier: 1.5 },
    metro: {
      minFare: 10, maxFare: 70,
      fareStages: [
        { distance: 2, fare: 10 }, { distance: 5, fare: 20 },
        { distance: 10, fare: 35 }, { distance: 15, fare: 50 },
        { distance: 20, fare: 60 }, { distance: Infinity, fare: 70 }
      ]
    }
  }
};

const getCityFare = (city, mode) => {
  const key = (city || 'bengaluru').toLowerCase();
  const cityFare = CITY_FARE_STRUCTURES[key];
  if (!cityFare) return CITY_FARE_STRUCTURES.bengaluru[mode];
  return cityFare[mode] || CITY_FARE_STRUCTURES.bengaluru[mode];
};

/**
 * Calculate fare for a bus leg based on GTFS fare data
 * @param {Object} leg - Journey leg with route info
 * @param {Object} gtfsFares - GTFS fare attributes
 * @returns {number} Fare in INR
 */
function calculateBusFare(leg, gtfsFares = null, city = 'bengaluru') {
  try {
    const fareStruct = getCityFare(city, 'bus');
    if (gtfsFares && gtfsFares[leg.route]) {
      const fare = gtfsFares[leg.route];
      return fare.min_fare || fareStruct.minFare;
    }
    const distanceKm = (leg.distance || 0) / 1000;
    const estimatedFare = fareStruct.minFare + (distanceKm * fareStruct.farePerKm);
    return Math.min(Math.round(estimatedFare), fareStruct.maxFare);
  } catch (error) {
    logger.error('Error calculating bus fare:', error);
    const fareStruct = getCityFare(city, 'bus');
    return fareStruct.minFare;
  }
}

/**
 * Calculate metro fare based on distance
 * @param {number} distanceMeters - Distance in meters
 * @returns {number} Fare in INR
 */
function calculateMetroFare(distanceMeters, city = 'bengaluru') {
  try {
    const metroStruct = getCityFare(city, 'metro');
    const distanceKm = distanceMeters / 1000;
    const stage = metroStruct.fareStages.find(s => distanceKm <= s.distance);
    return stage ? stage.fare : metroStruct.maxFare;
  } catch (error) {
    logger.error('Error calculating metro fare:', error);
    return getCityFare(city, 'metro').minFare;
  }
}

/**
 * Calculate fare for walking/cycling (zero)
 * @returns {number} Always 0
 */
function calculateWalkFare() {
  return 0;
}

/**
 * Calculate fare for auto/taxi based on distance
 * @param {number} distanceMeters - Distance in meters
 * @param {string} type - 'auto' or 'taxi'
 * @returns {number} Fare in INR
 */
function calculateAutoTaxiFare(distanceMeters, type = 'auto') {
  const distanceKm = distanceMeters / 1000;
  
  if (type === 'taxi') {
    // Taxi: ₹25 base + ₹18/km
    return Math.round(25 + (distanceKm * 18));
  } else {
    // Auto: ₹20 base + ₹12/km
    return Math.round(20 + (distanceKm * 12));
  }
}

/**
 * Calculate total fare for entire journey
 * @param {Array} legs - Journey legs
 * @param {Object} gtfsFares - GTFS fare lookup table
 * @returns {Object} Fare breakdown and total
 */
function calculateTotalFare(legs, gtfsFares = null, city = 'bengaluru') {
  const breakdown = [];
  let total = 0;
  
  legs.forEach((leg, index) => {
    let fare = 0;
    const mode = leg.mode.toLowerCase();
    
    switch (mode) {
      case 'bus':
        fare = calculateBusFare(leg, gtfsFares, city);
        break;
      case 'metro':
      case 'subway':
      case 'rail':
        fare = calculateMetroFare(leg.distance, city);
        break;
      case 'walk':
      case 'bicycle':
      case 'bike':
        fare = calculateWalkFare();
        break;
      case 'auto':
      case 'taxi':
        fare = calculateAutoTaxiFare(leg.distance, mode);
        break;
      default:
        fare = 0;
    }
    
    breakdown.push({
      legIndex: index,
      mode: leg.mode,
      route: leg.routeShortName || leg.route,
      from: leg.from.name,
      to: leg.to.name,
      distance: leg.distance,
      fare: fare,
      currency: 'INR'
    });
    
    total += fare;
  });
  
  return {
    total: total,
    currency: 'INR',
    breakdown: breakdown,
    formattedTotal: `₹${total}`
  };
}

/**
 * Apply transfer discount if applicable
 * @param {Array} legs - Journey legs
 * @param {number} totalFare - Total fare before discount
 * @returns {Object} Discounted fare info
 */
function applyTransferDiscount(legs, totalFare) {
  // Check if there are transfers (multiple transit legs)
  const transitLegs = legs.filter(leg => 
    ['bus', 'metro', 'subway', 'rail'].includes(leg.mode.toLowerCase())
  );
  
  // Free transfer within 90 minutes (BMTC policy)
  const hasTransfer = transitLegs.length > 1;
  const transferDiscount = hasTransfer ? Math.round(totalFare * 0.1) : 0; // 10% discount
  
  return {
    originalFare: totalFare,
    transferDiscount: transferDiscount,
    finalFare: totalFare - transferDiscount,
    hasTransfer: hasTransfer,
    message: hasTransfer ? 'Transfer discount applied (10%)' : 'No transfer discount'
  };
}

/**
 * Get fare information for a specific route from GTFS data
 * @param {string} routeId - Route ID
 * @param {Object} gtfsData - GTFS data object
 * @returns {Object} Fare range
 */
function getRouteFare(routeId, gtfsData) {
  if (!gtfsData || !gtfsData.fares) {
    return { min: 0, max: 0, currency: 'INR' };
  }
  
  const fare = gtfsData.fares[routeId];
  if (!fare) {
    return { min: 0, max: 0, currency: 'INR' };
  }
  
  return {
    min: fare.min_fare || 0,
    max: fare.max_fare || 0,
    currency: fare.currency || 'INR'
  };
}

module.exports = {
  calculateBusFare,
  calculateMetroFare,
  calculateWalkFare,
  calculateAutoTaxiFare,
  calculateTotalFare,
  applyTransferDiscount,
  getRouteFare,
  CITY_FARE_STRUCTURES
};
