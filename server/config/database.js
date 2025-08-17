const mongoose = require('mongoose');
const { Sequelize } = require('sequelize');
const sqlite3 = require('sqlite3').verbose();
const path = require('path');

// Database configuration
const config = {
  // Database type (mongodb, postgresql, mysql, sqlite)
  type: process.env.DB_TYPE || 'mongodb',
  
  // MongoDB configuration
  mongodb: {
    uri: process.env.MONGODB_URI || 'mongodb://localhost:27017/urbanflow',
    options: {
      useNewUrlParser: true,
      useUnifiedTopology: true,
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
      socketTimeoutMS: 45000,
      bufferMaxEntries: 0,
      bufferCommands: false,
    }
  },
  
  // PostgreSQL configuration
  postgresql: {
    host: process.env.POSTGRES_HOST || 'localhost',
    port: process.env.POSTGRES_PORT || 5432,
    database: process.env.POSTGRES_DB || 'urbanflow',
    username: process.env.POSTGRES_USER || 'postgres',
    password: process.env.POSTGRES_PASSWORD || 'password',
    dialect: 'postgres',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  
  // MySQL configuration
  mysql: {
    host: process.env.MYSQL_HOST || 'localhost',
    port: process.env.MYSQL_PORT || 3306,
    database: process.env.MYSQL_DB || 'urbanflow',
    username: process.env.MYSQL_USER || 'root',
    password: process.env.MYSQL_PASSWORD || 'password',
    dialect: 'mysql',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  },
  
  // SQLite configuration
  sqlite: {
    path: process.env.SQLITE_PATH || './data/urbanflow.db',
    dialect: 'sqlite',
    logging: process.env.NODE_ENV === 'development' ? console.log : false,
    storage: process.env.SQLITE_PATH || './data/urbanflow.db'
  }
};

// Database connection instances
let connection = null;
let sequelize = null;
let sqliteDb = null;

// Connect to database based on type
const connectDB = async () => {
  try {
    const dbType = config.type.toLowerCase();
    
    switch (dbType) {
      case 'mongodb':
        connection = await connectMongoDB();
        break;
        
      case 'postgresql':
        connection = await connectPostgreSQL();
        break;
        
      case 'mysql':
        connection = await connectMySQL();
        break;
        
      case 'sqlite':
        connection = await connectSQLite();
        break;
        
      default:
        throw new Error(`Unsupported database type: ${dbType}`);
    }
    
    console.log(`✅ Connected to ${dbType.toUpperCase()} database`);
    return connection;
    
  } catch (error) {
    console.error('❌ Database connection error:', error);
    process.exit(1);
  }
};

// MongoDB connection
const connectMongoDB = async () => {
  try {
    const conn = await mongoose.connect(config.mongodb.uri, config.mongodb.options);
    
    // Handle connection events
    mongoose.connection.on('error', (err) => {
      console.error('MongoDB connection error:', err);
    });

    mongoose.connection.on('disconnected', () => {
      console.log('MongoDB disconnected');
    });

    mongoose.connection.on('reconnected', () => {
      console.log('MongoDB reconnected');
    });

    // Graceful shutdown
    process.on('SIGINT', async () => {
      try {
        await mongoose.connection.close();
        console.log('MongoDB connection closed through app termination');
        process.exit(0);
      } catch (err) {
        console.error('Error during MongoDB connection closure:', err);
        process.exit(1);
      }
    });
    
    return conn;
  } catch (error) {
    throw new Error(`MongoDB connection failed: ${error.message}`);
  }
};

// PostgreSQL connection
const connectPostgreSQL = async () => {
  try {
    sequelize = new Sequelize(
      config.postgresql.database,
      config.postgresql.username,
      config.postgresql.password,
      {
        host: config.postgresql.host,
        port: config.postgresql.port,
        dialect: config.postgresql.dialect,
        logging: config.postgresql.logging,
        pool: config.postgresql.pool,
        define: {
          timestamps: true,
          underscored: true
        }
      }
    );
    
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`PostgreSQL connection failed: ${error.message}`);
  }
};

// MySQL connection
const connectMySQL = async () => {
  try {
    sequelize = new Sequelize(
      config.mysql.database,
      config.mysql.username,
      config.mysql.password,
      {
        host: config.mysql.host,
        port: config.mysql.port,
        dialect: config.mysql.dialect,
        logging: config.mysql.logging,
        pool: config.mysql.pool,
        define: {
          timestamps: true,
          underscored: true
        }
      }
    );
    
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`MySQL connection failed: ${error.message}`);
  }
};

// SQLite connection
const connectSQLite = async () => {
  try {
    // Ensure data directory exists
    const dataDir = path.dirname(config.sqlite.path);
    const fs = require('fs');
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    
    sequelize = new Sequelize({
      dialect: config.sqlite.dialect,
      storage: config.sqlite.storage,
      logging: config.sqlite.logging,
      define: {
        timestamps: true,
        underscored: true
      }
    });
    
    await sequelize.authenticate();
    return sequelize;
  } catch (error) {
    throw new Error(`SQLite connection failed: ${error.message}`);
  }
};

// Database health check
const checkDBHealth = async () => {
  try {
    const dbType = config.type.toLowerCase();
    
    switch (dbType) {
      case 'mongodb':
        const status = mongoose.connection.readyState;
        const statusMap = {
          0: 'disconnected',
          1: 'connected',
          2: 'connecting',
          3: 'disconnecting'
        };
        return {
          type: 'mongodb',
          status: statusMap[status] || 'unknown',
          readyState: status,
          isHealthy: status === 1,
          timestamp: new Date()
        };
        
      case 'postgresql':
      case 'mysql':
      case 'sqlite':
        if (sequelize) {
          await sequelize.authenticate();
          return {
            type: dbType,
            status: 'connected',
            isHealthy: true,
            timestamp: new Date()
          };
        }
        return {
          type: dbType,
          status: 'disconnected',
          isHealthy: false,
          timestamp: new Date()
        };
        
      default:
        return {
          type: 'unknown',
          status: 'error',
          error: `Unsupported database type: ${dbType}`,
          isHealthy: false,
          timestamp: new Date()
        };
    }
  } catch (error) {
    return {
      type: config.type,
      status: 'error',
      error: error.message,
      isHealthy: false,
      timestamp: new Date()
    };
  }
};

// Create database indexes (MongoDB only)
const createIndexes = async () => {
  try {
    if (config.type.toLowerCase() === 'mongodb') {
      console.log('Creating MongoDB indexes...');
      
      // User indexes
      await mongoose.model('User').createIndexes();
      
      // Trip indexes
      await mongoose.model('Trip').createIndexes();
      
      // Route indexes
      await mongoose.model('Route').createIndexes();
      
      // EcoStats indexes
      await mongoose.model('EcoStats').createIndexes();
      
      // Notification indexes
      await mongoose.model('Notification').createIndexes();
      
      // LiveTraffic indexes
      await mongoose.model('LiveTraffic').createIndexes();
      
      console.log('✅ MongoDB indexes created successfully');
    } else {
      console.log(`ℹ️  Index creation not required for ${config.type}`);
    }
  } catch (error) {
    console.error('❌ Error creating indexes:', error);
  }
};

// Close database connection
const closeConnection = async () => {
  try {
    if (config.type.toLowerCase() === 'mongodb') {
      await mongoose.connection.close();
      console.log('MongoDB connection closed');
    } else if (sequelize) {
      await sequelize.close();
      console.log(`${config.type} connection closed`);
    }
  } catch (error) {
    console.error('Error closing database connection:', error);
  }
};

// Get database type
const getDatabaseType = () => config.type.toLowerCase();

// Get connection instance
const getConnection = () => {
  if (config.type.toLowerCase() === 'mongodb') {
    return mongoose.connection;
  }
  return sequelize;
};

// Export configuration and functions
module.exports = {
  config,
  connectDB,
  checkDBHealth,
  createIndexes,
  closeConnection,
  getDatabaseType,
  getConnection,
  mongoose,
  sequelize
};
