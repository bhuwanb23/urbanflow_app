const { Sequelize } = require('sequelize');
const config = require('../config/database');
const logger = require('../utils/logger');

const env = process.env.NODE_ENV || 'development';
const dbConfig = config[env];

const sequelize = new Sequelize(dbConfig);

const models = {
  User: require('./User')(sequelize),
  Trip: require('./Trip')(sequelize),
  Notification: require('./Notification')(sequelize),
  EcoStat: require('./EcoStat')(sequelize)
};

Object.values(models).forEach(model => {
  if (model.associate) {
    model.associate(models);
  }
});

async function initializeDatabase() {
  try {
    await sequelize.authenticate();
    logger.info('SQLite database connected');
    await sequelize.sync({ force: false });
    logger.info('Database models synchronized');
    return models;
  } catch (error) {
    logger.error('Database initialization failed:', error);
    throw error;
  }
}

module.exports = { sequelize, initializeDatabase, ...models };
