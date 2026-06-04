const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: { isEmail: true }
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false
    },
    name: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    phone: {
      type: DataTypes.STRING,
      defaultValue: ''
    },
    preferences: {
      type: DataTypes.JSON,
      defaultValue: {
        language: 'en',
        currency: 'INR',
        mobilityGoals: ['reduce_carbon', 'save_money'],
        preferredTransport: ['bus', 'train'],
        accessibilityNeeds: [],
        notificationsEnabled: true
      }
    },
    passwordResetToken: {
      type: DataTypes.STRING,
      allowNull: true
    },
    passwordResetExpires: {
      type: DataTypes.DATE,
      allowNull: true
    },
    notificationSettings: {
      type: DataTypes.JSON,
      defaultValue: {
        enabled: true,
        categories: { alerts: true, disruptions: true, achievements: true, reminders: true, weather: true, promotions: false },
        pushEnabled: true, emailEnabled: false, smsEnabled: false,
        quietHours: { enabled: true, start: '22:00', end: '07:00' }
      }
    },
    createdAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    updatedAt: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    }
  }, {
    tableName: 'users',
    timestamps: true
  });

  User.associate = (models) => {
    User.hasMany(models.Trip, { foreignKey: 'userId', as: 'trips' });
    User.hasMany(models.Notification, { foreignKey: 'userId', as: 'notifications' });
    User.hasMany(models.EcoStat, { foreignKey: 'userId', as: 'ecostats' });
  };

  return User;
};
