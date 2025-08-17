const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

const LiveTraffic = sequelize.define('LiveTraffic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  city: {
    type: DataTypes.STRING,
    allowNull: false
  },
  area: {
    type: DataTypes.STRING,
    allowNull: false
  },
  latitude: {
    type: DataTypes.DECIMAL(10, 8),
    allowNull: true
  },
  longitude: {
    type: DataTypes.DECIMAL(11, 8),
    allowNull: true
  },
  trafficLevel: {
    type: DataTypes.ENUM('low', 'moderate', 'high', 'severe'),
    defaultValue: 'low'
  },
  congestionIndex: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 100
    },
    defaultValue: 0
  },
  averageSpeed: {
    type: DataTypes.DECIMAL(5, 2), // km/h
    allowNull: true
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: true
  },
  lastUpdated: {
    type: DataTypes.DATE,
    defaultValue: DataTypes.NOW
  }
}, {
  tableName: 'live_traffic',
  timestamps: true
});

module.exports = LiveTraffic;
