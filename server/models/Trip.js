const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Trip = sequelize.define('Trip', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: 'users',
      key: 'id'
    }
  },
  fromName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  fromLatitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  fromLongitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  toName: {
    type: DataTypes.STRING,
    allowNull: false
  },
  toLatitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  toLongitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  startTime: {
    type: DataTypes.DATE,
    allowNull: false
  },
  endTime: {
    type: DataTypes.DATE,
    allowNull: true
  },
  actualDuration: {
    type: DataTypes.INTEGER, // minutes
    allowNull: true
  },
  estimatedDuration: {
    type: DataTypes.INTEGER, // minutes
    allowNull: true
  },
  actualDistance: {
    type: DataTypes.DECIMAL(8, 2), // km
    allowNull: true
  },
  estimatedDistance: {
    type: DataTypes.DECIMAL(8, 2), // km
    allowNull: true
  },
  modes: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('modes');
      return value ? JSON.parse(value) : [];
    },
    set(value) {
      this.setDataValue('modes', JSON.stringify(value));
    }
  },
  co2Saved: {
    type: DataTypes.DECIMAL(8, 2), // kg CO2
    defaultValue: 0
  },
  cost: {
    type: DataTypes.DECIMAL(8, 2), // INR
    defaultValue: 0
  },
  status: {
    type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
    defaultValue: 'planned'
  },
  rating: {
    type: DataTypes.INTEGER,
    validate: {
      min: 1,
      max: 5
    },
    allowNull: true
  },
  notes: {
    type: DataTypes.TEXT,
    allowNull: true
  }
}, {
  tableName: 'trips',
  timestamps: true
});

// Define association
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });

module.exports = Trip;
