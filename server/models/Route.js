const mongoose = require('mongoose');

const routeSchema = new mongoose.Schema({
  // Route Identification
  routeId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },

  // Route Information
  name: {
    type: String,
    required: [true, 'Route name is required'],
    maxlength: [100, 'Route name cannot exceed 100 characters']
  },
  description: String,
  isPublic: {
    type: Boolean,
    default: false
  },
  isFavorite: {
    type: Boolean,
    default: false
  },

  // Origin & Destination
  origin: {
    name: { type: String, required: [true, 'Origin name is required'] },
    address: String,
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    placeId: String, // Google Places ID
    type: {
      type: String,
      enum: ['home', 'work', 'favorite', 'custom'],
      default: 'custom'
    }
  },
  destination: {
    name: { type: String, required: [true, 'Destination name is required'] },
    address: String,
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    placeId: String, // Google Places ID
    type: {
      type: String,
      enum: ['home', 'work', 'favorite', 'custom'],
      default: 'custom'
    }
  },

  // Route Details
  distance: {
    total: { type: Number, required: true }, // kilometers
    walking: { type: Number, default: 0 }, // kilometers
    cycling: { type: Number, default: 0 }, // kilometers
    driving: { type: Number, default: 0 } // kilometers
  },
  duration: {
    total: { type: Number, required: true }, // minutes
    walking: { type: Number, default: 0 }, // minutes
    cycling: { type: Number, default: 0 }, // minutes
    driving: { type: Number, default: 0 }, // minutes
    publicTransport: { type: Number, default: 0 } // minutes
  },

  // Transportation Modes
  modes: [{
    type: {
      type: String,
      enum: ['walk', 'bike', 'bus', 'train', 'metro', 'auto', 'car', 'ferry'],
      required: true
    },
    name: String, // e.g., "Metro Blue Line", "Bus 45"
    duration: Number, // minutes
    distance: Number, // kilometers
    cost: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    stops: Number, // for public transport
    routeNumber: String, // for public transport
    frequency: Number, // minutes between services
    accessibility: { type: Boolean, default: false },
    features: [String], // e.g., ['Electric', 'Air-conditioned', 'Wheelchair accessible']
    busy: { type: Boolean, default: false },
    electric: { type: Boolean, default: false }
  }],

  // Environmental Impact
  environmentalImpact: {
    co2Saved: { type: Number, required: true }, // kg CO2
    ecoScore: { type: Number, required: true }, // 0-100
    ecoScoreColor: { type: String, default: '#10b981' },
    ecoScoreBg: { type: String, default: '#dcfce7' },
    comparison: {
      vsCar: { type: Number, required: true }, // kg CO2 saved vs car
      vsPublicTransport: { type: Number, default: 0 } // percentage public transport used
    }
  },

  // Cost Information
  totalCost: {
    amount: { type: Number, required: true },
    currency: { type: String, default: 'INR' },
    breakdown: [{
      mode: String,
      amount: Number,
      description: String
    }]
  },

  // Route Preferences & Constraints
  preferences: {
    avoidHighways: { type: Boolean, default: false },
    avoidTolls: { type: Boolean, default: false },
    preferWalking: { type: Boolean, default: false },
    preferCycling: { type: Boolean, default: false },
    preferPublicTransport: { type: Boolean, default: true },
    maxWalkingDistance: { type: Number, default: 2 }, // kilometers
    maxCyclingDistance: { type: Number, default: 10 }, // kilometers
    accessibility: { type: Boolean, default: false },
    wheelchairAccessible: { type: Boolean, default: false }
  },

  // Time Constraints
  timeConstraints: {
    departureTime: Date,
    arrivalTime: Date,
    isFlexible: { type: Boolean, default: true },
    flexibilityWindow: { type: Number, default: 30 }, // minutes
    preferredTime: {
      type: String,
      enum: ['morning', 'afternoon', 'evening', 'night'],
      default: 'morning'
    }
  },

  // Route Status & Usage
  status: {
    type: String,
    enum: ['active', 'inactive', 'archived', 'deleted'],
    default: 'active'
  },
  usageCount: {
    type: Number,
    default: 0
  },
  lastUsed: Date,
  averageRating: {
    type: Number,
    min: 1,
    max: 5,
    default: 0
  },
  totalRatings: {
    type: Number,
    default: 0
  },

  // Alternative Routes
  alternatives: [{
    routeId: String,
    modes: [String],
    duration: Number,
    distance: Number,
    cost: Number,
    ecoScore: Number,
    reason: String, // why this alternative was suggested
    isRecommended: { type: Boolean, default: false }
  }],

  // Route Segments & Waypoints
  segments: [{
    order: { type: Number, required: true },
    mode: String,
    from: {
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    to: {
      name: String,
      coordinates: {
        latitude: Number,
        longitude: Number
      }
    },
    duration: Number,
    distance: Number,
    instructions: String,
    polyline: String // encoded polyline for map display
  }],

  // Route History & Analytics
  history: [{
    date: { type: Date, default: Date.now },
    actualDuration: Number,
    actualDistance: Number,
    actualCost: Number,
    weather: String,
    trafficConditions: String,
    rating: Number,
    feedback: String
  }],

  // Tags & Categories
  tags: [String], // e.g., ['work', 'daily', 'eco-friendly', 'scenic']
  category: {
    type: String,
    enum: ['commute', 'leisure', 'shopping', 'health', 'education', 'other'],
    default: 'other'
  },

  // Sharing & Collaboration
  sharedWith: [{
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    permission: {
      type: String,
      enum: ['view', 'edit', 'admin'],
      default: 'view'
    },
    sharedAt: { type: Date, default: Date.now }
  }],
  isShared: {
    type: Boolean,
    default: false
  },

  // Metadata
  source: {
    type: String,
    enum: ['user_created', 'imported', 'suggested', 'copied'],
    default: 'user_created'
  },
  version: {
    type: String,
    default: '1.0'
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

// Virtual for route duration in hours and minutes
routeSchema.virtual('durationFormatted').get(function() {
  const hours = Math.floor(this.duration.total / 60);
  const minutes = this.duration.total % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

// Virtual for distance in km
routeSchema.virtual('distanceFormatted').get(function() {
  return `${this.distance.total.toFixed(1)} km`;
});

// Virtual for cost formatted
routeSchema.virtual('costFormatted').get(function() {
  return `${this.totalCost.currency} ${this.totalCost.amount.toFixed(2)}`;
});

// Virtual for eco score grade
routeSchema.virtual('ecoScoreGrade').get(function() {
  if (this.environmentalImpact.ecoScore >= 90) return 'A+';
  if (this.environmentalImpact.ecoScore >= 80) return 'A';
  if (this.environmentalImpact.ecoScore >= 70) return 'B';
  if (this.environmentalImpact.ecoScore >= 60) return 'C';
  if (this.environmentalImpact.ecoScore >= 50) return 'D';
  return 'F';
});

// Virtual for route efficiency score
routeSchema.virtual('efficiencyScore').get(function() {
  // Calculate efficiency based on distance, time, and eco score
  const distanceScore = Math.max(0, 100 - (this.distance.total * 10));
  const timeScore = Math.max(0, 100 - (this.duration.total / 2));
  const ecoScore = this.environmentalImpact.ecoScore;
  
  return Math.round((distanceScore + timeScore + ecoScore) / 3);
});

// Pre-save middleware to generate route ID
routeSchema.pre('save', function(next) {
  if (!this.routeId) {
    this.routeId = `ROUTE_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Method to calculate eco score
routeSchema.methods.calculateEcoScore = function() {
  let score = 100;
  
  // Deduct points for car usage
  const carMode = this.modes.find(mode => mode.type === 'car');
  if (carMode) {
    score -= 30;
  }
  
  // Add points for walking/cycling
  const walkMode = this.modes.find(mode => mode.type === 'walk');
  const bikeMode = this.modes.find(mode => mode.type === 'bike');
  if (walkMode) score += 10;
  if (bikeMode) score += 15;
  
  // Add points for public transport
  const publicTransportModes = this.modes.filter(mode => 
    ['bus', 'train', 'metro', 'ferry'].includes(mode.type)
  );
  score += publicTransportModes.length * 5;
  
  // Ensure score is within bounds
  this.environmentalImpact.ecoScore = Math.max(0, Math.min(100, score));
  return this.environmentalImpact.ecoScore;
};

// Method to increment usage
routeSchema.methods.incrementUsage = function() {
  this.usageCount += 1;
  this.lastUsed = new Date();
  return this.save();
};

// Method to add rating
routeSchema.methods.addRating = function(rating) {
  const totalRating = this.averageRating * this.totalRatings + rating;
  this.totalRatings += 1;
  this.averageRating = totalRating / this.totalRatings;
  return this.save();
};

// Indexes for better query performance
routeSchema.index({ userId: 1, createdAt: -1 });
routeSchema.index({ userId: 1, isFavorite: 1 });
routeSchema.index({ userId: 1, category: 1 });
routeSchema.index({ 'origin.coordinates': '2dsphere' });
routeSchema.index({ 'destination.coordinates': '2dsphere' });
routeSchema.index({ environmentalImpact: { ecoScore: -1 } });
routeSchema.index({ isPublic: 1 });
routeSchema.index({ tags: 1 });

module.exports = mongoose.model('Route', routeSchema);
