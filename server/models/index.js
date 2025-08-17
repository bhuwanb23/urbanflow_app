// Database Models for UrbanFlow App
const User = require('./User');
const Trip = require('./Trip');
const Route = require('./Route');
const EcoStats = require('./EcoStats');
const Notification = require('./Notification');
const LiveTraffic = require('./LiveTraffic');

// Define associations
User.hasMany(Trip, { foreignKey: 'userId', as: 'trips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Route, { foreignKey: 'userId', as: 'routes' });
Route.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(EcoStats, { foreignKey: 'userId', as: 'ecoStats' });
EcoStats.belongsTo(User, { foreignKey: 'userId', as: 'user' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'notifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'user' });

module.exports = {
  User,
  Trip,
  Route,
  EcoStats,
  Notification,
  LiveTraffic
};
