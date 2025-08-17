const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const EcoStats = sequelize.define('EcoStats', {
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
  date: {
    type: DataTypes.DATEONLY,
    allowNull: false
  },
  totalCO2Saved: {
    type: DataTypes.DECIMAL(10, 2), // kg CO2
    defaultValue: 0
  },
  totalDistanceWalked: {
    type: DataTypes.DECIMAL(10, 2), // km
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
  tripsCount: {
    type: DataTypes.INTEGER,
    defaultValue: 0
  },
  totalCost: {
    type: DataTypes.DECIMAL(10, 2), // INR
    defaultValue: 0
  }
}, {
  tableName: 'eco_stats',
  timestamps: true
});

// Define association
EcoStats.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(EcoStats, { foreignKey: 'userId', as: 'ecoStats' });

module.exports = EcoStats;
