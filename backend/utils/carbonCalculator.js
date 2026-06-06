/**
 * Carbon Calculator Utility
 * Calculates CO2 emissions and savings for journey legs
 */

// CO2 emission factors (kg CO2 per km)
// Source: International Energy Agency (IEA) and Indian Ministry of Road Transport
const EMISSION_FACTORS = {
  bus: 0.089,      // BMTC bus average (diesel CNG mix)
  metro: 0.041,    // BMRCL metro (electricity grid average)
  rail: 0.041,     // Suburban rail
  subway: 0.041,   // Metro/subway
  tram: 0.035,     // Tram/light rail
  ferry: 0.115,    // Ferry
  walk: 0.0,       // Zero emissions
  bicycle: 0.0,    // Zero emissions
  bike: 0.0,       // Zero emissions
  car: 0.192,      // Private car baseline (petrol)
  electric_car: 0.050, // Electric car (grid avg)
  auto: 0.115,     // Auto-rickshaw (2-stroke)
  e_rickshaw: 0.030, // E-rickshaw (electric 3-wheeler)
  taxi: 0.165,     // Taxi/ride-share
  motorcycle: 0.103, // Motorcycle
  scooter: 0.070,  // Petrol scooter
  electric_scooter: 0.020, // Electric scooter
  shared_bicycle: 0.0, // Shared bicycle (zero)
  cable_car: 0.020  // Cable car / gondola
};

/**
 * Calculate CO2 emissions for a single leg
 * @param {number} distanceKm - Distance in kilometers
 * @param {string} mode - Transport mode
 * @returns {number} CO2 emissions in kg
 */
function calculateLegEmissions(distanceKm, mode) {
  const normalizedMode = mode.toLowerCase();
  const factor = EMISSION_FACTORS[normalizedMode] ?? EMISSION_FACTORS.car;

  return distanceKm * factor;
}

/**
 * Calculate total trip emissions
 * @param {Array} legs - Journey legs with distance and mode
 * @returns {number} Total CO2 emissions in kg
 */
function calculateTotalEmissions(legs) {
  return legs.reduce((total, leg) => {
    const distanceKm = (leg.distance || 0) / 1000; // Convert meters to km
    return total + calculateLegEmissions(distanceKm, leg.mode);
  }, 0);
}

/**
 * Calculate CO2 saved compared to private car
 * @param {Array} legs - Journey legs
 * @param {number} totalDistanceKm - Total trip distance in km
 * @returns {number} CO2 saved in kg
 */
function calculateCarbonSaved(legs, totalDistanceKm = null) {
  // If total distance not provided, sum from legs
  const distance = totalDistanceKm || (legs.reduce((sum, leg) => sum + (leg.distance || 0), 0) / 1000);
  
  // Car baseline emissions
  const carEmissions = distance * EMISSION_FACTORS.car;
  
  // Actual trip emissions
  const tripEmissions = calculateTotalEmissions(legs);
  
  // CO2 saved
  return Math.max(0, carEmissions - tripEmissions);
}

/**
 * Get eco-score rating based on carbon savings
 * @param {number} carbonSavedKg - CO2 saved in kg
 * @param {number} totalDistanceKm - Total distance in km
 * @returns {Object} Eco score with letter grade and percentage
 */
function getEcoScore(carbonSavedKg, totalDistanceKm) {
  if (totalDistanceKm <= 0) {
    return {
      grade: 'N/A',
      percentage: 0,
      description: 'Unable to calculate'
    };
  }
  
  // Maximum possible savings (if all by walking/cycling)
  const maxSavings = totalDistanceKm * EMISSION_FACTORS.car;
  
  // Percentage of maximum savings achieved
  const percentage = (carbonSavedKg / maxSavings) * 100;
  
  // Letter grade
  let grade, description;
  if (percentage >= 90) {
    grade = 'A+';
    description = 'Excellent! Zero-emission journey';
  } else if (percentage >= 75) {
    grade = 'A';
    description = 'Outstanding eco-friendly choice';
  } else if (percentage >= 60) {
    grade = 'B';
    description = 'Great sustainable option';
  } else if (percentage >= 45) {
    grade = 'C';
    description = 'Good environmental impact';
  } else if (percentage >= 30) {
    grade = 'D';
    description = 'Moderate eco-impact';
  } else {
    grade = 'E';
    description = 'Consider greener alternatives';
  }
  
  return { grade, percentage: Math.round(percentage), description };
}

/**
 * Get emission factor for a mode
 * @param {string} mode - Transport mode
 * @returns {number} Emission factor (kg CO2/km)
 */
function getEmissionFactor(mode) {
  return EMISSION_FACTORS[mode.toLowerCase()] ?? EMISSION_FACTORS.car;
}

/**
 * Compare multiple transport modes
 * @param {number} distanceKm - Distance in km
 * @param {Array<string>} modes - Array of transport modes
 * @returns {Array} Comparison data
 */
function compareModes(distanceKm, modes) {
  return modes.map(mode => ({
    mode,
    emissions: calculateLegEmissions(distanceKm, mode),
    factor: getEmissionFactor(mode),
    savings: Math.max(0, (distanceKm * EMISSION_FACTORS.car) - calculateLegEmissions(distanceKm, mode))
  }));
}

module.exports = {
  calculateLegEmissions,
  calculateTotalEmissions,
  calculateCarbonSaved,
  getEcoScore,
  getEmissionFactor,
  compareModes,
  EMISSION_FACTORS
};
