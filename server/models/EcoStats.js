const mongoose = require('mongoose');

const ecoStatsSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },

  // Time Period
  period: {
    type: {
      type: String,
      enum: ['daily', 'weekly', 'monthly', 'yearly'],
      required: true
    },
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    year: { type: Number, required: true },
    month: { type: Number, required: true }, // 1-12
    week: { type: Number, required: true }, // 1-52
    day: { type: Number, required: true } // 1-31
  },

  // Environmental Impact Metrics
  co2Saved: {
    total: { type: Number, default: 0 }, // kg CO2
    daily: { type: Number, default: 0 }, // kg CO2 per day
    weekly: { type: Number, default: 0 }, // kg CO2 per week
    monthly: { type: Number, default: 0 }, // kg CO2 per month
    vsCar: { type: Number, default: 0 }, // kg CO2 saved vs car
    vsPublicTransport: { type: Number, default: 0 } // percentage
  },

  // Distance Metrics
  distanceWalked: {
    total: { type: Number, default: 0 }, // km
    daily: { type: Number, default: 0 }, // km per day
    weekly: { type: Number, default: 0 }, // km per week
    monthly: { type: Number, default: 0 } // km per month
  },
  distanceCycled: {
    total: { type: Number, default: 0 }, // km
    daily: { type: Number, default: 0 }, // km per day
    weekly: { type: Number, default: 0 }, // km per week
    monthly: { type: Number, default: 0 } // km per month
  },

  // Transportation Usage
  publicTransportTrips: {
    total: { type: Number, default: 0 },
    daily: { type: Number, default: 0 },
    weekly: { type: Number, default: 0 },
    monthly: { type: Number, default: 0 },
    breakdown: {
      bus: { type: Number, default: 0 },
      train: { type: Number, default: 0 },
      metro: { type: Number, default: 0 },
      ferry: { type: Number, default: 0 }
    }
  },

  // Eco Score & Performance
  ecoScore: {
    current: { type: Number, default: 0 }, // 0-100
    average: { type: Number, default: 0 }, // 0-100
    trend: { type: Number, default: 0 }, // percentage change from previous period
    grade: { type: String, default: 'F' }, // A+, A, B, C, D, F
    color: { type: String, default: '#ef4444' },
    backgroundColor: { type: String, default: '#fee2e2' }
  },

  // Goals & Achievements
  goals: {
    dailyCO2Target: { type: Number, default: 5.0 }, // kg CO2
    weeklyWalkingTarget: { type: Number, default: 50 }, // km
    monthlyPublicTransportTarget: { type: Number, default: 100 }, // trips
    ecoScoreTarget: { type: Number, default: 80 }, // percentage
    progress: {
      co2Target: { type: Number, default: 0 }, // percentage
      walkingTarget: { type: Number, default: 0 }, // percentage
      publicTransportTarget: { type: Number, default: 0 }, // percentage
      ecoScoreTarget: { type: Number, default: 0 } // percentage
    }
  },

  // Achievements & Badges
  achievements: [{
    id: { type: String, required: true },
    title: { type: String, required: true },
    subtitle: { type: String },
    icon: { type: String, required: true },
    gradientColors: [String],
    isCompleted: { type: Boolean, default: false },
    progress: { type: Number, default: 0 }, // 0-100
    unlockedAt: Date,
    description: String,
    category: {
      type: String,
      enum: ['eco_friendly', 'fitness', 'consistency', 'milestone', 'special']
    }
  }],

  // Weekly/Monthly Breakdown
  dailyStats: [{
    date: { type: Date, required: true },
    co2Saved: { type: Number, default: 0 },
    distanceWalked: { type: Number, default: 0 },
    distanceCycled: { type: Number, default: 0 },
    publicTransportTrips: { type: Number, default: 0 },
    ecoScore: { type: Number, default: 0 },
    trips: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Trip' }]
  }],

  // Transport Mode Analysis
  transportModeAnalysis: {
    mostUsed: { type: String, default: 'walk' },
    leastUsed: { type: String, default: 'car' },
    ecoFriendlyPercentage: { type: Number, default: 0 }, // percentage of eco-friendly trips
    carUsagePercentage: { type: Number, default: 0 }, // percentage of car trips
    publicTransportPercentage: { type: Number, default: 0 } // percentage of public transport trips
  },

  // Comparison with Previous Periods
  comparison: {
    previousPeriod: {
      co2Saved: { type: Number, default: 0 },
      distanceWalked: { type: Number, default: 0 },
      publicTransportTrips: { type: Number, default: 0 },
      ecoScore: { type: Number, default: 0 }
    },
    change: {
      co2Saved: { type: Number, default: 0 }, // percentage change
      distanceWalked: { type: Number, default: 0 }, // percentage change
      publicTransportTrips: { type: Number, default: 0 }, // percentage change
      ecoScore: { type: Number, default: 0 } // percentage change
    }
  },

  // Insights & Recommendations
  insights: [{
    type: {
      type: String,
      enum: ['improvement', 'achievement', 'suggestion', 'warning']
    },
    title: String,
    message: String,
    priority: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    },
    actionable: { type: Boolean, default: false },
    action: String // suggested action
  }],

  // Metadata
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  dataQuality: {
    type: String,
    enum: ['excellent', 'good', 'fair', 'poor'],
    default: 'good'
  },
  source: {
    type: String,
    enum: ['app_tracking', 'manual_entry', 'imported', 'calculated'],
    default: 'app_tracking'
  }
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

// Virtual for period label
ecoStatsSchema.virtual('periodLabel').get(function() {
  if (this.period.type === 'daily') {
    return new Date(this.period.startDate).toLocaleDateString();
  } else if (this.period.type === 'weekly') {
    return `Week ${this.period.week}, ${this.period.year}`;
  } else if (this.period.type === 'monthly') {
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[this.period.month - 1]} ${this.period.year}`;
  } else {
    return `${this.period.year}`;
  }
});

// Virtual for total distance
ecoStatsSchema.virtual('totalDistance').get(function() {
  return this.distanceWalked.total + this.distanceCycled.total;
});

// Virtual for goal completion percentage
ecoStatsSchema.virtual('overallGoalCompletion').get(function() {
  const goals = [
    this.goals.progress.co2Target,
    this.goals.progress.walkingTarget,
    this.goals.progress.publicTransportTarget,
    this.goals.progress.ecoScoreTarget
  ];
  return Math.round(goals.reduce((sum, goal) => sum + goal, 0) / goals.length);
});

// Pre-save middleware to calculate derived fields
ecoStatsSchema.pre('save', function(next) {
  // Calculate eco score grade
  if (this.ecoScore.current >= 90) this.ecoScore.grade = 'A+';
  else if (this.ecoScore.current >= 80) this.ecoScore.grade = 'A';
  else if (this.ecoScore.current >= 70) this.ecoScore.grade = 'B';
  else if (this.ecoScore.current >= 60) this.ecoScore.grade = 'C';
  else if (this.ecoScore.current >= 50) this.ecoScore.grade = 'D';
  else this.ecoScore.grade = 'F';

  // Set eco score colors based on grade
  if (this.ecoScore.grade === 'A+' || this.ecoScore.grade === 'A') {
    this.ecoScore.color = '#10b981';
    this.ecoScore.backgroundColor = '#dcfce7';
  } else if (this.ecoScore.grade === 'B') {
    this.ecoScore.color = '#3b82f6';
    this.ecoScore.backgroundColor = '#dbeafe';
  } else if (this.ecoScore.grade === 'C') {
    this.ecoScore.color = '#f59e0b';
    this.ecoScore.backgroundColor = '#fef3c7';
  } else {
    this.ecoScore.color = '#ef4444';
    this.ecoScore.backgroundColor = '#fee2e2';
  }

  next();
});

// Method to update stats from a new trip
ecoStatsSchema.methods.updateFromTrip = function(trip) {
  // Update CO2 saved
  this.co2Saved.total += trip.environmentalImpact.co2Saved;
  
  // Update distances
  const walkMode = trip.modes.find(mode => mode.type === 'walk');
  const bikeMode = trip.modes.find(mode => mode.type === 'bike');
  
  if (walkMode) {
    this.distanceWalked.total += walkMode.distance || 0;
  }
  if (bikeMode) {
    this.distanceCycled.total += bikeMode.distance || 0;
  }
  
  // Update public transport trips
  const publicTransportModes = trip.modes.filter(mode => 
    ['bus', 'train', 'metro', 'ferry'].includes(mode.type)
  );
  this.publicTransportTrips.total += publicTransportModes.length;
  
  // Update eco score
  this.ecoScore.current = trip.environmentalImpact.ecoScore;
  
  return this.save();
};

// Indexes for better query performance
ecoStatsSchema.index({ userId: 1, 'period.startDate': -1 });
ecoStatsSchema.index({ userId: 1, 'period.type': 1, 'period.year': 1, 'period.month': 1 });
ecoStatsSchema.index({ 'period.startDate': -1 });
ecoStatsSchema.index({ ecoScore: { current: -1 } });

module.exports = mongoose.model('EcoStats', ecoStatsSchema);
