const mongoose = require('mongoose');

const liveTrafficSchema = new mongoose.Schema({
  // Location & Route Information
  location: {
    city: { type: String, required: true },
    region: String,
    country: { type: String, default: 'India' },
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    area: String, // Specific area or neighborhood
    placeId: String // Google Places ID
  },

  // Route Information
  route: {
    id: String,
    name: String, // e.g., "Highway 101", "Metro Blue Line"
    type: {
      type: String,
      enum: ['highway', 'arterial', 'local', 'metro', 'bus', 'train', 'ferry'],
      required: true
    },
    from: String, // Starting point
    to: String, // Ending point
    waypoints: [{
      coordinates: {
        latitude: Number,
        longitude: Number
      },
      name: String,
      description: String
    }]
  },

  // Traffic Conditions
  trafficConditions: {
    level: {
      type: String,
      enum: ['low', 'medium', 'high', 'severe', 'congested'],
      required: true
    },
    severity: {
      type: String,
      enum: ['minimal', 'minor', 'moderate', 'major', 'critical'],
      default: 'minor'
    },
    description: String, // Human-readable description
    color: String, // Color code for UI
    backgroundColor: String,
    icon: String // Icon for UI display
  },

  // Real-time Metrics
  currentMetrics: {
    averageSpeed: { type: Number, default: 0 }, // km/h
    travelTime: { type: Number, default: 0 }, // minutes
    delay: { type: Number, default: 0 }, // minutes
    congestionIndex: { type: Number, default: 0 }, // 0-100
    vehicleCount: { type: Number, default: 0 }, // estimated
    queueLength: { type: Number, default: 0 } // meters
  },

  // Historical Comparison
  historicalComparison: {
    normalTravelTime: { type: Number, default: 0 }, // minutes
    normalSpeed: { type: Number, default: 0 }, // km/h
    timeIncrease: { type: Number, default: 0 }, // percentage
    speedDecrease: { type: Number, default: 0 }, // percentage
    isWorseThanUsual: { type: Boolean, default: false }
  },

  // Transit Status (for public transport)
  transitStatus: {
    isOperational: { type: Boolean, default: true },
    status: {
      type: String,
      enum: ['on_time', 'delayed', 'cancelled', 'diverted', 'maintenance'],
      default: 'on_time'
    },
    delay: { type: Number, default: 0 }, // minutes
    nextDeparture: Date,
    frequency: { type: Number, default: 0 }, // minutes between services
    crowding: {
      type: String,
      enum: ['low', 'medium', 'high', 'very_high'],
      default: 'low'
    },
    accessibility: { type: Boolean, default: true }
  },

  // Live Updates & Alerts
  liveUpdates: [{
    timestamp: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['incident', 'update', 'warning', 'clearance', 'maintenance'],
      required: true
    },
    title: String,
    message: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'medium'
    },
    source: {
      type: String,
      enum: ['user_report', 'sensor', 'officer', 'system', 'third_party'],
      default: 'system'
    },
    isVerified: { type: Boolean, default: false },
    verifiedBy: String,
    verifiedAt: Date
  }],

  // Weather Conditions
  weather: {
    temperature: Number, // Celsius
    condition: String, // e.g., "rainy", "sunny", "foggy"
    humidity: Number, // percentage
    visibility: Number, // kilometers
    windSpeed: Number, // km/h
    precipitation: Number, // mm
    isAffectingTraffic: { type: Boolean, default: false }
  },

  // Events & Special Conditions
  events: [{
    name: String,
    type: {
      type: String,
      enum: ['sport', 'concert', 'festival', 'construction', 'accident', 'protest'],
      required: true
    },
    startTime: Date,
    endTime: Date,
    impact: {
      type: String,
      enum: ['minimal', 'minor', 'moderate', 'major', 'severe'],
      default: 'minor'
    },
    description: String,
    isActive: { type: Boolean, default: true }
  }],

  // Alternative Routes
  alternativeRoutes: [{
    routeId: String,
    name: String,
    type: String,
    estimatedTime: Number, // minutes
    distance: Number, // kilometers
    trafficLevel: String,
    reason: String, // why this alternative is suggested
    isRecommended: { type: Boolean, default: false }
  }],

  // Data Quality & Source
  dataQuality: {
    confidence: { type: Number, default: 0 }, // 0-100
    source: {
      type: String,
      enum: ['gps_tracking', 'sensor_network', 'user_reports', 'officer_reports', 'ai_prediction'],
      required: true
    },
    lastUpdated: { type: Date, default: Date.now },
    updateFrequency: { type: Number, default: 5 }, // minutes
    isRealTime: { type: Boolean, default: true }
  },

  // Predictive Analytics
  predictions: {
    shortTerm: { // 15-30 minutes
      expectedTrafficLevel: String,
      expectedDelay: Number,
      confidence: Number
    },
    mediumTerm: { // 1-2 hours
      expectedTrafficLevel: String,
      expectedDelay: Number,
      confidence: Number
    },
    longTerm: { // 4-6 hours
      expectedTrafficLevel: String,
      expectedDelay: Number,
      confidence: Number
    }
  },

  // Metadata
  tags: [String], // For categorization and search
  isActive: { type: Boolean, default: true },
  priority: {
    type: String,
    enum: ['low', 'normal', 'high', 'critical'],
    default: 'normal'
  },

  // Timestamps
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for traffic status summary
liveTrafficSchema.virtual('statusSummary').get(function() {
  if (this.trafficConditions.level === 'severe' || this.trafficConditions.level === 'congested') {
    return 'Heavy Traffic';
  } else if (this.trafficConditions.level === 'high') {
    return 'Moderate Traffic';
  } else if (this.trafficConditions.level === 'medium') {
    return 'Light Traffic';
  } else {
    return 'Clear';
  }
});

// Virtual for is urgent
liveTrafficSchema.virtual('isUrgent').get(function() {
  return this.trafficConditions.level === 'severe' || 
         this.trafficConditions.level === 'congested' ||
         this.priority === 'critical';
});

// Virtual for traffic color
liveTrafficSchema.virtual('trafficColor').get(function() {
  const colorMap = {
    'low': '#10b981',
    'medium': '#f59e0b',
    'high': '#f97316',
    'severe': '#ef4444',
    'congested': '#dc2626'
  };
  return colorMap[this.trafficConditions.level] || '#6b7280';
});

// Pre-save middleware to set default values
liveTrafficSchema.pre('save', function(next) {
  // Set default colors based on traffic level
  if (!this.trafficConditions.color) {
    this.trafficConditions.color = this.trafficColor;
  }

  // Set default background colors
  if (!this.trafficConditions.backgroundColor) {
    const bgMap = {
      'low': '#dcfce7',
      'medium': '#fef3c7',
      'high': '#fed7aa',
      'severe': '#fee2e2',
      'congested': '#fecaca'
    };
    this.trafficConditions.backgroundColor = bgMap[this.trafficConditions.level] || '#f3f4f6';
  }

  // Set default icons
  if (!this.trafficConditions.icon) {
    const iconMap = {
      'low': 'check-circle',
      'medium': 'alert-circle',
      'high': 'alert-triangle',
      'severe': 'close-circle',
      'congested': 'close-circle'
    };
    this.trafficConditions.icon = iconMap[this.trafficConditions.level] || 'information';
  }

  // Calculate if traffic is worse than usual
  if (this.historicalComparison.normalTravelTime > 0) {
    this.historicalComparison.isWorseThanUsual = 
      this.currentMetrics.travelTime > this.historicalComparison.normalTravelTime;
  }

  next();
});

// Method to add live update
liveTrafficSchema.methods.addUpdate = function(updateData) {
  this.liveUpdates.push(updateData);
  this.dataQuality.lastUpdated = new Date();
  return this.save();
};

// Method to update traffic conditions
liveTrafficSchema.methods.updateConditions = function(newConditions) {
  Object.assign(this.trafficConditions, newConditions);
  this.dataQuality.lastUpdated = new Date();
  return this.save();
};

// Method to mark as resolved
liveTrafficSchema.methods.markResolved = function() {
  this.trafficConditions.level = 'low';
  this.trafficConditions.severity = 'minimal';
  this.isActive = false;
  this.dataQuality.lastUpdated = new Date();
  return this.save();
};

// Indexes for better query performance
liveTrafficSchema.index({ 'location.coordinates': '2dsphere' });
liveTrafficSchema.index({ 'trafficConditions.level': 1 });
liveTrafficSchema.index({ 'route.type': 1 });
liveTrafficSchema.index({ 'dataQuality.lastUpdated': -1 });
liveTrafficSchema.index({ 'isActive': 1 });
liveTrafficSchema.index({ 'priority': 1 });
liveTrafficSchema.index({ 'location.city': 1 });

module.exports = mongoose.model('LiveTraffic', liveTrafficSchema);
