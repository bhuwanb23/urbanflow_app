const { DataTypes } = require('sequelize');
const bcrypt = require('bcryptjs');
const { sequelize } = require('../config/database');

const User = sequelize.define('User', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  name: {
    type: DataTypes.STRING(100),
    allowNull: false,
    validate: {
      notEmpty: true,
      len: [1, 100]
    }
  },
  email: {
    type: DataTypes.STRING,
    allowNull: false,
    unique: true,
    validate: {
      isEmail: true,
      notEmpty: true
    }
  },
  password: {
    type: DataTypes.STRING,
    allowNull: false,
    validate: {
      len: [6, 255]
    }
  },
  avatar: {
    type: DataTypes.STRING,
    allowNull: true
  },
  phone: {
    type: DataTypes.STRING,
    allowNull: true
  },
  city: {
    type: DataTypes.STRING,
    defaultValue: 'Mumbai'
  },
  country: {
    type: DataTypes.STRING,
    defaultValue: 'India'
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  preferredTransport: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('preferredTransport');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('preferredTransport', JSON.stringify(value));
    }
  },
  language: {
    type: DataTypes.STRING(5),
    defaultValue: 'en'
  },
  region: {
    type: DataTypes.STRING(5),
    defaultValue: 'IN'
  },
  dailyCO2Target: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 5.0
  },
  weeklyWalkingTarget: {
    type: DataTypes.INTEGER,
    defaultValue: 50
  },
  monthlyPublicTransportTarget: {
    type: DataTypes.INTEGER,
    defaultValue: 100
  },
  ecoScoreTarget: {
    type: DataTypes.INTEGER,
    defaultValue: 80
  },
  totalCO2Saved: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalDistanceWalked: {
    type: DataTypes.DECIMAL(10, 2),
    defaultValue: 0
  },
  totalPublicTransportTrips: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  averageEcoScore: {
    type: DataTypes.DECIMAL(5, 2),
    defaultValue: 0
  },
  notifications: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('notifications');
      return value ? JSON.parse(value) : {
        pushEnabled: true,
        emailEnabled: true,
        smsEnabled: false,
        types: {
          routeUpdates: true,
          trafficAlerts: true,
          achievementUnlocks: true,
          weeklyReports: true
        }
      };
    },
    set(value) {
      this.setDataValue('notifications', JSON.stringify(value));
    }
  },
  privacy: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('privacy');
      return value ? JSON.parse(value) : {
        profileVisibility: 'public',
        locationSharing: false,
        tripHistorySharing: false
      };
    },
    set(value) {
      this.setDataValue('privacy', JSON.stringify(value));
    }
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  },
  isVerified: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  lastLogin: {
    type: DataTypes.DATE,
    allowNull: true
  }
}, {
  tableName: 'users',
  timestamps: true,
  hooks: {
    beforeCreate: async (user) => {
      if (user.password) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    },
    beforeUpdate: async (user) => {
      if (user.changed('password')) {
        user.password = await bcrypt.hash(user.password, 12);
      }
    }
  }
});

// Instance method to compare password
User.prototype.comparePassword = async function(candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// Instance method to get public profile
User.prototype.getPublicProfile = function() {
  return {
    id: this.id,
    name: this.name,
    email: this.email,
    avatar: this.avatar,
    city: this.city,
    country: this.country,
    totalCO2Saved: this.totalCO2Saved,
    totalDistanceWalked: this.totalDistanceWalked,
    averageEcoScore: this.averageEcoScore,
    createdAt: this.createdAt
  };
};

module.exports = User;
