const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Notification = sequelize.define('Notification', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true
    },
    userId: {
      type: DataTypes.UUID,
      allowNull: false,
      references: { model: 'users', key: 'id' }
    },
    title: {
      type: DataTypes.STRING,
      allowNull: false
    },
    description: {
      type: DataTypes.TEXT,
      defaultValue: ''
    },
    category: {
      type: DataTypes.ENUM('delay', 'route_change', 'eco_tip', 'achievement', 'system', 'traffic', 'weather'),
      defaultValue: 'system'
    },
    urgency: {
      type: DataTypes.ENUM('info', 'warning', 'critical'),
      defaultValue: 'info'
    },
    icon: {
      type: DataTypes.STRING,
      defaultValue: 'information-outline'
    },
    read: {
      type: DataTypes.BOOLEAN,
      defaultValue: false
    },
    metadata: {
      type: DataTypes.JSON
    }
  }, {
    tableName: 'notifications',
    timestamps: true
  });

  Notification.associate = (models) => {
    Notification.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Notification;
};
