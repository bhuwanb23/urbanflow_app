const mongoose = require('mongoose');

const notificationSchema = new mongoose.Schema({
  // User Reference
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'User ID is required']
  },

  // Notification Content
  title: {
    type: String,
    required: [true, 'Notification title is required'],
    maxlength: [100, 'Title cannot exceed 100 characters']
  },
  message: {
    type: String,
    required: [true, 'Notification message is required'],
    maxlength: [500, 'Message cannot exceed 500 characters']
  },
  subtitle: String,
  summary: String,

  // Notification Type & Category
  type: {
    type: String,
    enum: [
      'route_update',
      'traffic_alert',
      'achievement_unlock',
      'goal_reminder',
      'system_alert',
      'promotion',
      'weather_alert',
      'maintenance_alert',
      'congestion_warning',
      'eco_tip',
      'weekly_report',
      'friend_activity'
    ],
    required: [true, 'Notification type is required']
  },
  category: {
    type: String,
    enum: ['urgent', 'important', 'normal', 'low'],
    default: 'normal'
  },
  priority: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low'],
    default: 'medium'
  },

  // Visual Elements
  icon: {
    type: String,
    default: 'bell'
  },
  iconColor: {
    type: String,
    default: '#6366f1'
  },
  backgroundColor: {
    type: String,
    default: '#f3f4f6'
  },
  gradientColors: [String],

  // Action & Navigation
  actionType: {
    type: String,
    enum: ['navigate', 'open_url', 'dismiss', 'custom'],
    default: 'dismiss'
  },
  actionData: {
    screen: String, // Screen to navigate to
    route: String, // Route parameters
    url: String, // External URL
    customAction: String // Custom action identifier
  },
  isActionable: {
    type: Boolean,
    default: false
  },

  // Related Data
  relatedTripId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Trip'
  },
  relatedRouteId: String,
  relatedAchievementId: String,
  relatedGoalId: String,

  // Status & Read State
  isRead: {
    type: Boolean,
    default: false
  },
  isImportant: {
    type: Boolean,
    default: false
  },
  isPinned: {
    type: Boolean,
    default: false
  },
  readAt: Date,

  // Delivery & Display
  deliveryMethod: {
    type: String,
    enum: ['push', 'in_app', 'email', 'sms'],
    default: 'in_app'
  },
  isDelivered: {
    type: Boolean,
    default: false
  },
  deliveredAt: Date,
  deliveryAttempts: {
    type: Number,
    default: 0
  },

  // Scheduling
  scheduledFor: Date, // When to show the notification
  expiresAt: Date, // When the notification expires
  isRecurring: {
    type: Boolean,
    default: false
  },
  recurrencePattern: {
    frequency: { type: String, enum: ['daily', 'weekly', 'monthly'] },
    interval: { type: Number, default: 1 },
    endDate: Date
  },

  // User Interaction
  userActions: [{
    action: {
      type: String,
      enum: ['read', 'dismiss', 'pin', 'mark_important', 'delete', 'share']
    },
    timestamp: { type: Date, default: Date.now },
    metadata: mongoose.Schema.Types.Mixed
  }],

  // Analytics & Performance
  openRate: {
    type: Number,
    default: 0
  },
  clickRate: {
    type: Number,
    default: 0
  },
  engagementScore: {
    type: Number,
    default: 0
  },

  // Metadata
  tags: [String], // For categorization and filtering
  source: {
    type: String,
    enum: ['system', 'user_generated', 'third_party', 'ai_generated'],
    default: 'system'
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

// Virtual for notification age
notificationSchema.virtual('age').get(function() {
  const now = new Date();
  const diffMs = now - this.createdAt;
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffMinutes = Math.floor(diffMs / (1000 * 60));

  if (diffDays > 0) return `${diffDays}d ago`;
  if (diffHours > 0) return `${diffHours}h ago`;
  if (diffMinutes > 0) return `${diffMinutes}m ago`;
  return 'Just now';
});

// Virtual for notification status
notificationSchema.virtual('status').get(function() {
  if (this.isRead) return 'read';
  if (this.isImportant) return 'important';
  if (this.isPinned) return 'pinned';
  return 'unread';
});

// Virtual for urgency indicator
notificationSchema.virtual('isUrgent').get(function() {
  return this.priority === 'critical' || this.category === 'urgent';
});

// Pre-save middleware to set default values
notificationSchema.pre('save', function(next) {
  // Set default icon based on type
  if (!this.icon) {
    const iconMap = {
      'route_update': 'map-marker-path',
      'traffic_alert': 'alert-triangle',
      'achievement_unlock': 'trophy',
      'goal_reminder': 'target',
      'system_alert': 'information',
      'promotion': 'gift',
      'weather_alert': 'weather-partly-cloudy',
      'maintenance_alert': 'wrench',
      'congestion_warning': 'car-multiple',
      'eco_tip': 'leaf',
      'weekly_report': 'chart-line',
      'friend_activity': 'account-group'
    };
    this.icon = iconMap[this.type] || 'bell';
  }

  // Set default colors based on category
  if (!this.iconColor) {
    const colorMap = {
      'urgent': '#ef4444',
      'important': '#f59e0b',
      'normal': '#6366f1',
      'low': '#6b7280'
    };
    this.iconColor = colorMap[this.category] || '#6366f1';
  }

  // Set default background based on category
  if (!this.backgroundColor) {
    const bgMap = {
      'urgent': '#fee2e2',
      'important': '#fef3c7',
      'normal': '#f3f4f6',
      'low': '#f9fafb'
    };
    this.backgroundColor = bgMap[this.category] || '#f3f4f6';
  }

  next();
});

// Method to mark as read
notificationSchema.methods.markAsRead = function() {
  this.isRead = true;
  this.readAt = new Date();
  this.userActions.push({
    action: 'read',
    timestamp: new Date()
  });
  return this.save();
};

// Method to toggle importance
notificationSchema.methods.toggleImportant = function() {
  this.isImportant = !this.isImportant;
  this.userActions.push({
    action: this.isImportant ? 'mark_important' : 'unmark_important',
    timestamp: new Date()
  });
  return this.save();
};

// Method to pin/unpin
notificationSchema.methods.togglePin = function() {
  this.isPinned = !this.isPinned;
  this.userActions.push({
    action: this.isPinned ? 'pin' : 'unpin',
    timestamp: new Date()
  });
  return this.save();
};

// Method to dismiss
notificationSchema.methods.dismiss = function() {
  this.userActions.push({
    action: 'dismiss',
    timestamp: new Date()
  });
  return this.save();
};

// Indexes for better query performance
notificationSchema.index({ userId: 1, createdAt: -1 });
notificationSchema.index({ userId: 1, isRead: 1 });
notificationSchema.index({ userId: 1, type: 1 });
notificationSchema.index({ userId: 1, category: 1 });
notificationSchema.index({ scheduledFor: 1 });
notificationSchema.index({ expiresAt: 1 });
notificationSchema.index({ 'relatedTripId': 1 });

module.exports = mongoose.model('Notification', notificationSchema);
