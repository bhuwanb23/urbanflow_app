const mongoose = require('mongoose');

const tripSchema = new mongoose.Schema({
  // Trip Identification
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },
  tripId: {
    type: String,
    unique: true,
    required: true
  },

  // Route Information
  from: {
    name: { type: String, required: [true, 'Origin name is required'] },
    address: String,
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    placeId: String // Google Places ID
  },
  to: {
    name: { type: String, required: [true, 'Destination name is required'] },
    address: String,
    coordinates: {
      latitude: { type: Number, required: true },
      longitude: { type: Number, required: true }
    },
    placeId: String // Google Places ID
  },

  // Trip Details
  startTime: {
    type: Date,
    required: [true, 'Start time is required']
  },
  endTime: {
    type: Date,
    required: [true, 'End time is required']
  },
  duration: {
    actual: { type: Number, required: true }, // in minutes
    estimated: { type: Number, required: true } // in minutes
  },
  distance: {
    actual: { type: Number, required: true }, // in kilometers
    estimated: { type: Number, required: true } // in kilometers
  },

  // Transportation Modes
  modes: [{
    type: {
      type: String,
      enum: ['walk', 'bike', 'bus', 'train', 'metro', 'auto', 'car', 'ferry'],
      required: true
    },
    name: String, // e.g., "Metro Blue Line", "Bus 45"
    duration: Number, // in minutes
    distance: Number, // in kilometers
    cost: {
      amount: Number,
      currency: { type: String, default: 'INR' }
    },
    stops: Number, // for public transport
    routeNumber: String, // for public transport
    accessibility: { type: Boolean, default: false },
    features: [String], // e.g., ['Electric', 'Air-conditioned', 'Wheelchair accessible']
    busy: { type: Boolean, default: false },
    electric: { type: Boolean, default: false }
  }],

  // Environmental Impact
  environmentalImpact: {
    co2Saved: { type: Number, required: true }, // in kg CO2
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

  // Trip Status & Progress
  status: {
    type: String,
    enum: ['planned', 'in_progress', 'completed', 'cancelled', 'delayed'],
    default: 'planned'
  },
  progress: {
    type: Number,
    min: 0,
    max: 100,
    default: 0
  },
  isFavorite: {
    type: Boolean,
    default: false
  },

  // Real-time Updates
  liveUpdates: [{
    timestamp: { type: Date, default: Date.now },
    type: {
      type: String,
      enum: ['delay', 'congestion', 'route_change', 'alert', 'update']
    },
    message: String,
    severity: {
      type: String,
      enum: ['low', 'medium', 'high', 'critical'],
      default: 'low'
    },
    affectsMode: String // which transport mode is affected
  }],

  // Route Alternatives
  alternatives: [{
    routeId: String,
    modes: [String],
    duration: Number,
    distance: Number,
    cost: Number,
    ecoScore: Number,
    reason: String // why this alternative was suggested
  }],

  // User Feedback
  rating: {
    overall: { type: Number, min: 1, max: 5 },
    comfort: { type: Number, min: 1, max: 5 },
    punctuality: { type: Number, min: 1, max: 5 },
    cleanliness: { type: Number, min: 1, max: 5 },
    comment: String
  },

  // Metadata
  tags: [String], // e.g., ['work', 'daily', 'eco-friendly']
  weather: {
    temperature: Number,
    condition: String,
    humidity: Number
  },
  trafficConditions: {
    level: {
      type: String,
      enum: ['low', 'medium', 'high', 'severe']
    },
    description: String
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

// Virtual for trip duration in hours and minutes
tripSchema.virtual('durationFormatted').get(function() {
  const hours = Math.floor(this.duration.actual / 60);
  const minutes = this.duration.actual % 60;
  if (hours > 0) {
    return `${hours}h ${minutes}m`;
  }
  return `${minutes}m`;
});

// Virtual for distance in km
tripSchema.virtual('distanceFormatted').get(function() {
  return `${this.distance.actual.toFixed(1)} km`;
});

// Virtual for cost formatted
tripSchema.virtual('costFormatted').get(function() {
  return `${this.totalCost.currency} ${this.totalCost.amount.toFixed(2)}`;
});

// Virtual for eco score grade
tripSchema.virtual('ecoScoreGrade').get(function() {
  if (this.environmentalImpact.ecoScore >= 90) return 'A+';
  if (this.environmentalImpact.ecoScore >= 80) return 'A';
  if (this.environmentalImpact.ecoScore >= 70) return 'B';
  if (this.environmentalImpact.ecoScore >= 60) return 'C';
  if (this.environmentalImpact.ecoScore >= 50) return 'D';
  return 'F';
});

// Pre-save middleware to generate trip ID
tripSchema.pre('save', function(next) {
  if (!this.tripId) {
    this.tripId = `TRIP_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }
  next();
});

// Method to calculate eco score
tripSchema.methods.calculateEcoScore = function() {
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

// Indexes for better query performance
tripSchema.index({ userId: 1, createdAt: -1 });
tripSchema.index({ status: 1 });
tripSchema.index({ startTime: -1 });
tripSchema.index({ 'from.coordinates': '2dsphere' });
tripSchema.index({ 'to.coordinates': '2dsphere' });
tripSchema.index({ environmentalImpact: { ecoScore: -1 } });

module.exports = mongoose.model('Trip', tripSchema);
