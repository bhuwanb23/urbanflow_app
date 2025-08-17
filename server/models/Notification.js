const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const User = require('./User');

const Notification = sequelize.define('Notification', {
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
  title: {
    type: DataTypes.STRING(200),
    allowNull: false
  },
  message: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  type: {
    type: DataTypes.ENUM('route_update', 'traffic_alert', 'achievement', 'weekly_report', 'system'),
    defaultValue: 'system'
  },
  isRead: {
    type: DataTypes.BOOLEAN,
    defaultValue: false
  },
  priority: {
    type: DataTypes.ENUM('low', 'medium', 'high'),
    defaultValue: 'medium'
  },
  data: {
    type: DataTypes.TEXT,
    allowNull: true,
    get() {
      const value = this.getDataValue('data');
      return value ? JSON.parse(value) : {};
    },
    set(value) {
      this.setDataValue('data', JSON.stringify(value));
    }
  }
}, {
  tableName: 'notifications',
  timestamps: true
});

// Define association
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });
User.hasMany(Notification, { foreignKey: 'userId', as: 'userNotifications' });

module.exports = Notification;
