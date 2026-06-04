const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const EcoStat = sequelize.define('EcoStat', {
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
    period: {
      type: DataTypes.ENUM('day', 'week', 'month', 'year'),
      defaultValue: 'week'
    },
    date: {
      type: DataTypes.DATEONLY,
      defaultValue: DataTypes.NOW
    },
    co2Saved: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    totalDistance: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    totalTrips: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    tripsByMode: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    distanceByMode: {
      type: DataTypes.JSON,
      defaultValue: {}
    },
    caloriesBurned: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    costSaved: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    }
  }, {
    tableName: 'ecostats',
    timestamps: true,
    indexes: [
      { fields: ['userId'] }
    ]
  });

  EcoStat.associate = (models) => {
    EcoStat.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return EcoStat;
};
