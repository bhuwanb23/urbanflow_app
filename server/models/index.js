// Database Models for UrbanFlow App
const User = require('./User');
const Trip = require('./Trip');
const Route = require('./Route');
const EcoStats = require('./EcoStats');
const Notification = require('./Notification');
const LiveTraffic = require('./LiveTraffic');

// Define associations with unique aliases
User.hasMany(Trip, { foreignKey: 'userId', as: 'userTrips' });
Trip.belongsTo(User, { foreignKey: 'userId', as: 'tripUser' });

User.hasMany(Route, { foreignKey: 'userId', as: 'userRoutes' });
Route.belongsTo(User, { foreignKey: 'userId', as: 'routeUser' });

User.hasMany(EcoStats, { foreignKey: 'userId', as: 'userEcoStats' });
EcoStats.belongsTo(User, { foreignKey: 'userId', as: 'ecoStatsUser' });

User.hasMany(Notification, { foreignKey: 'userId', as: 'userNotifications' });
Notification.belongsTo(User, { foreignKey: 'userId', as: 'notificationUser' });

module.exports = {
  User,
  Trip,
  Route,
  EcoStats,
  Notification,
  LiveTraffic
};
