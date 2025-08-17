const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  // Basic Information
  name: {
    type: String,
    required: [true, 'Name is required'],
    trim: true,
    maxlength: [100, 'Name cannot exceed 100 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: true,
    lowercase: true,
    trim: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
    minlength: [6, 'Password must be at least 6 characters long']
  },
  avatar: {
    type: String,
    default: null
  },
  phone: {
    type: String,
    trim: true
  },

  // Location & Preferences
  location: {
    city: { type: String, default: 'Mumbai' },
    country: { type: String, default: 'India' },
    coordinates: {
      latitude: Number,
      longitude: Number
    }
  },
  preferredTransport: [{
    mode: {
      type: String,
      enum: ['train', 'bus', 'metro', 'bike', 'walk', 'auto', 'car'],
      required: true
    },
    priority: { type: Number, default: 1 }
  }],
  language: {
    type: String,
    default: 'en'
  },
  region: {
    type: String,
    default: 'IN'
  },

  // Sustainability & Goals
  sustainabilityGoals: {
    dailyCO2Target: { type: Number, default: 5.0 }, // kg CO2
    weeklyWalkingTarget: { type: Number, default: 50 }, // km
    monthlyPublicTransportTarget: { type: Number, default: 100 }, // trips
    ecoScoreTarget: { type: Number, default: 80 } // percentage
  },
  currentStats: {
    totalCO2Saved: { type: Number, default: 0 }, // kg CO2
    totalDistanceWalked: { type: Number, default: 0 }, // km
    totalPublicTransportTrips: { type: Number, default: 0 },
    averageEcoScore: { type: Number, default: 0 }
  },

  // Notification Preferences
  notifications: {
    pushEnabled: { type: Boolean, default: true },
    emailEnabled: { type: Boolean, default: true },
    smsEnabled: { type: Boolean, default: false },
    types: {
      routeUpdates: { type: Boolean, default: true },
      trafficAlerts: { type: Boolean, default: true },
      achievementUnlocks: { type: Boolean, default: true },
      weeklyReports: { type: Boolean, default: true }
    }
  },

  // Privacy Settings
  privacy: {
    profileVisibility: {
      type: String,
      enum: ['public', 'friends', 'private'],
      default: 'public'
    },
    locationSharing: { type: Boolean, default: false },
    tripHistorySharing: { type: Boolean, default: false }
  },

  // Account Status
  isActive: {
    type: Boolean,
    default: true
  },
  isVerified: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
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

// Virtual for full name
userSchema.virtual('fullName').get(function() {
  return this.name;
});

// Virtual for eco score percentage
userSchema.virtual('ecoScorePercentage').get(function() {
  if (this.currentStats.averageEcoScore === 0) return 0;
  return Math.round((this.currentStats.averageEcoScore / 100) * 100);
});

// Pre-save middleware to hash password
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare password
userSchema.methods.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Method to update stats
userSchema.methods.updateStats = function(newTripData) {
  if (newTripData.co2Saved) {
    this.currentStats.totalCO2Saved += newTripData.co2Saved;
  }
  if (newTripData.distanceWalked) {
    this.currentStats.totalDistanceWalked += newTripData.distanceWalked;
  }
  if (newTripData.isPublicTransport) {
    this.currentStats.totalPublicTransportTrips += 1;
  }
  return this.save();
};

// Indexes for better query performance
userSchema.index({ email: 1 });
userSchema.index({ location: '2dsphere' });
userSchema.index({ createdAt: -1 });

module.exports = mongoose.model('User', userSchema);
