/**
 * Mode Mapper Utility
 * Maps OTP transport modes to UrbanFlow icon keys and colors
 */

// Mode mapping from OTP to UrbanFlow format
const MODE_MAPPING = {
  // Public Transit
  'BUS': {
    icon: 'bus',
    color: '#16a34a',      // green-500
    bgColor: '#DCFCE7',    // green-100
    label: 'Bus',
    category: 'transit'
  },
  'SUBWAY': {
    icon: 'train',
    color: '#7c3aed',      // violet-500
    bgColor: '#DDD6FE',    // violet-100
    label: 'Metro',
    category: 'transit'
  },
  'RAIL': {
    icon: 'train',
    color: '#2563eb',      // blue-500
    bgColor: '#DBEAFE',    // blue-100
    label: 'Train',
    category: 'transit'
  },
  'TRAM': {
    icon: 'tram',
    color: '#0891b2',      // cyan-500
    bgColor: '#CFFAFE',    // cyan-100
    label: 'Tram',
    category: 'transit'
  },
  'FERRY': {
    icon: 'ferry',
    color: '#0ea5e9',      // sky-500
    bgColor: '#E0F2FE',    // sky-100
    label: 'Ferry',
    category: 'transit'
  },
  
  // Active Transport
  'WALK': {
    icon: 'walk',
    color: '#6b7280',      // gray-500
    bgColor: '#F3F4F6',    // gray-100
    label: 'Walk',
    category: 'active'
  },
  'BICYCLE': {
    icon: 'bicycle',
    color: '#10b981',      // emerald-500
    bgColor: '#D1FAE5',    // emerald-100
    label: 'Cycle',
    category: 'active'
  },
  
  // Private/Commercial
  'CAR': {
    icon: 'car',
    color: '#ef4444',      // red-500
    bgColor: '#FEE2E2',    // red-100
    label: 'Car',
    category: 'private'
  },
  'TAXI': {
    icon: 'car',
    color: '#f59e0b',      // amber-500
    bgColor: '#FEF3C7',    // amber-100
    label: 'Taxi',
    category: 'commercial'
  },
  'AUTO_RICKSHAW': {
    icon: 'car-side',
    color: '#f97316',      // orange-500
    bgColor: '#FFECD5',    // orange-100
    label: 'Auto',
    category: 'commercial'
  },

  // New transport modes
  'ELECTRIC_CAR': {
    icon: 'car-electric',
    color: '#22c55e',      // green-500
    bgColor: '#DCFCE7',    // green-100
    label: 'Electric Car',
    category: 'private'
  },
  'E_RICKSHAW': {
    icon: 'auto-rickshaw',
    color: '#14b8a6',      // teal-500
    bgColor: '#CCFBF1',    // teal-100
    label: 'E-Rickshaw',
    category: 'commercial'
  },
  'SCOOTER': {
    icon: 'motorbike',
    color: '#a855f7',      // purple-500
    bgColor: '#F3E8FF',    // purple-100
    label: 'Scooter',
    category: 'private'
  },
  'ELECTRIC_SCOOTER': {
    icon: 'motorbike-electric',
    color: '#10b981',      // emerald-500
    bgColor: '#D1FAE5',    // emerald-100
    label: 'E-Scooter',
    category: 'private'
  },
  'SHARED_BICYCLE': {
    icon: 'bicycle',
    color: '#0ea5e9',      // sky-500
    bgColor: '#E0F2FE',    // sky-100
    label: 'Shared Cycle',
    category: 'active'
  },
  'CABLE_CAR': {
    icon: 'cable-car',
    color: '#eab308',      // yellow-500
    bgColor: '#FEF9C3',    // yellow-100
    label: 'Cable Car',
    category: 'transit'
  }
};

/**
 * Get mode info by OTP mode name
 * @param {string} otpMode - OTP mode (e.g., 'BUS', 'WALK')
 * @returns {Object} Mode info with icon, color, etc.
 */
function getModeInfo(otpMode) {
  return MODE_MAPPING[otpMode.toUpperCase()] || {
    icon: 'help-circle',
    color: '#9ca3af',
    bgColor: '#F3F4F6',
    label: otpMode,
    category: 'other'
  };
}

/**
 * Get icon for a mode
 * @param {string} otpMode - OTP mode
 * @returns {string} Material Community Icons key
 */
function getModeIcon(otpMode) {
  return getModeInfo(otpMode).icon;
}

/**
 * Get color for a mode
 * @param {string} otpMode - OTP mode
 * @returns {string} Hex color code
 */
function getModeColor(otpMode) {
  return getModeInfo(otpMode).color;
}

/**
 * Get background color for a mode
 * @param {string} otpMode - OTP mode
 * @returns {string} Hex color code
 */
function getModeBgColor(otpMode) {
  return getModeInfo(otpMode).bgColor;
}

/**
 * Get display label for a mode
 * @param {string} otpMode - OTP mode
 * @returns {string} Human-readable label
 */
function getModeLabel(otpMode) {
  return getModeInfo(otpMode).label;
}

/**
 * Get category for a mode
 * @param {string} otpMode - OTP mode
 * @returns {string} Category (transit, active, private, commercial)
 */
function getModeCategory(otpMode) {
  return getModeInfo(otpMode).category;
}

/**
 * Check if mode is eco-friendly
 * @param {string} otpMode - OTP mode
 * @returns {boolean} True if eco-friendly
 */
function isEcoFriendly(otpMode) {
  const category = getModeCategory(otpMode);
  return ['transit', 'active'].includes(category);
}

/**
 * Map multiple OTP modes to UrbanFlow format
 * @param {Array<string>} otpModes - Array of OTP modes
 * @returns {Array<Object>} Array of mode info objects
 */
function mapMultipleModes(otpModes) {
  return otpModes.map(mode => ({
    otpMode: mode,
    ...getModeInfo(mode)
  }));
}

/**
 * Get all available modes
 * @returns {Array<string>} List of all mode keys
 */
function getAllModes() {
  return Object.keys(MODE_MAPPING);
}

/**
 * Get modes by category
 * @param {string} category - Category to filter by
 * @returns {Array<string>} Modes in that category
 */
function getModesByCategory(category) {
  return Object.entries(MODE_MAPPING)
    .filter(([_, info]) => info.category === category)
    .map(([mode, _]) => mode);
}

module.exports = {
  getModeInfo,
  getModeIcon,
  getModeColor,
  getModeBgColor,
  getModeLabel,
  getModeCategory,
  isEcoFriendly,
  mapMultipleModes,
  getAllModes,
  getModesByCategory,
  MODE_MAPPING
};
