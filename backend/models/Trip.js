const { DataTypes } = require('sequelize');

module.exports = (sequelize) => {
  const Trip = sequelize.define('Trip', {
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
    date: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW
    },
    fromName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    fromLat: {
      type: DataTypes.FLOAT
    },
    fromLon: {
      type: DataTypes.FLOAT
    },
    toName: {
      type: DataTypes.STRING,
      allowNull: false
    },
    toLat: {
      type: DataTypes.FLOAT
    },
    toLon: {
      type: DataTypes.FLOAT
    },
    distance: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    duration: {
      type: DataTypes.INTEGER,
      defaultValue: 0
    },
    mode: {
      type: DataTypes.STRING,
      defaultValue: 'bus'
    },
    routeId: {
      type: DataTypes.STRING
    },
    legs: {
      type: DataTypes.JSON
    },
    carbonSaved: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    cost: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    caloriesBurned: {
      type: DataTypes.FLOAT,
      defaultValue: 0
    },
    status: {
      type: DataTypes.ENUM('planned', 'in_progress', 'completed', 'cancelled'),
      defaultValue: 'completed'
    }
  }, {
    tableName: 'trips',
    timestamps: true,
    indexes: [
      { fields: ['userId'] }
    ]
  });

  Trip.associate = (models) => {
    Trip.belongsTo(models.User, { foreignKey: 'userId', as: 'user' });
  };

  return Trip;
};
