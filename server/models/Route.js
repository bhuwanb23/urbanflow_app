const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Route = sequelize.define('Route', {
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
  name: {
    type: DataTypes.STRING(100),
    allowNull: false
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
  duration: {
    type: DataTypes.INTEGER, // minutes
    allowNull: true
  },
  distance: {
    type: DataTypes.DECIMAL(8, 2), // km
    allowNull: true
  },
  cost: {
    type: DataTypes.DECIMAL(8, 2), // INR
    defaultValue: 0
  },
  ecoScore: {
    type: DataTypes.INTEGER,
    validate: {
      min: 0,
      max: 100
    },
    defaultValue: 0
  },
  isFavorite: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  isActive: {
    type: DataTypes.BOOLEAN,
    defaultValue: true
  }
}, {
  tableName: 'routes',
  timestamps: true
});

// Define association
Route.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Route, { foreignKey: 'userId', as: 'routes' });

module.exports = Route;
