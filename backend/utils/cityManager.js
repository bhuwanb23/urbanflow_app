/**
 * City Configuration Manager
 * Manages multiple city configurations for multi-city support
 */

const path = require('path');
const logger = require('./logger');

class CityManager {
  constructor() {
    this.cities = new Map();
    this.currentCity = process.env.ACTIVE_CITY || 'delhi';
    this.dataLoader = null;
    
    // Register default cities
    this.registerCity('delhi', {
      name: 'Delhi',
      displayName: 'Delhi NCR',
      state: 'Delhi',
      country: 'India',
      timezone: 'Asia/Kolkata',
      bounds: {
        north: 28.8833,
        south: 28.4167,
        east: 77.3500,
        west: 76.8333
      },
      gtfs: {
        staticDir: path.join(__dirname, '../../data/delhi/output'),
        shapesDir: path.join(__dirname, '../../data/delhi/output/shapes')
      },
      gtfsRt: {
        source: 'dimts',
        apiUrl: process.env.DELHI_API_URL || 'https://otd.delhi.gov.in/api/realtime',
        apiKey: process.env.DELHI_API_KEY || ''
      }
    });

    this.registerCity('bangalore', {
      name: 'Bangalore',
      displayName: 'Bengaluru',
      state: 'Karnataka',
      country: 'India',
      timezone: 'Asia/Kolkata',
      bounds: {
        north: 13.1333,
        south: 12.8333,
        east: 77.7500,
        west: 77.4167
      },
      gtfs: {
        staticDir: path.join(__dirname, '../../data/bengaluru/output'),
        shapesDir: path.join(__dirname, '../../data/bengaluru/output/shapes')
      },
      gtfsRt: {
        source: 'bmtc',
        apiUrl: process.env.DULT_VEHICLE_POSITIONS_URL || '',
        apiKey: process.env.DULT_API_KEY || ''
      }
    });

    this.registerCity('chennai', {
      name: 'Chennai',
      displayName: 'Chennai',
      state: 'Tamil Nadu',
      country: 'India',
      timezone: 'Asia/Kolkata',
      bounds: {
        north: 13.2500,
        south: 12.9167,
        east: 80.3333,
        west: 80.1667
      },
      gtfs: {
        staticDir: path.join(__dirname, '../../data/chennai/output'),
        shapesDir: path.join(__dirname, '../../data/chennai/output/shapes')
      },
      gtfsRt: {
        source: 'mota',
        apiUrl: process.env.CHENNAI_API_URL || '',
        apiKey: process.env.CHENNAI_API_KEY || ''
      }
    });
  }

  /**
   * Register a DataLoader instance for reloading data on city switch
   */
  setDataLoader(loader) {
    this.dataLoader = loader;
  }

  /**
   * Register a new city configuration
   */
  registerCity(cityId, config) {
    this.cities.set(cityId, {
      id: cityId,
      ...config,
      active: true,
      registeredAt: Date.now()
    });
    logger.info(`✅ Registered city: ${config.displayName} (${cityId})`);
  }

  /**
   * Get city configuration by ID
   */
  getCity(cityId) {
    return this.cities.get(cityId);
  }

  /**
   * Get current active city
   */
  getCurrentCity() {
    return this.getCity(this.currentCity);
  }

  /**
   * Set active city and reload GTFS data
   */
  async setActiveCity(cityId) {
    if (!this.cities.has(cityId)) {
      throw new Error(`City '${cityId}' not registered`);
    }
    const city = this.getCity(cityId);
    this.currentCity = cityId;

    // Update env vars so downstream services pick up new paths
    process.env.ACTIVE_CITY = cityId;
    process.env.DATA_DIR = path.relative(
      path.join(__dirname, '..'),
      city.gtfs.staticDir
    ).replace(/\\/g, '/');
    process.env.SCHEDULE_DIR = path.relative(
      path.join(__dirname, '..'),
      city.gtfs.shapesDir.replace(/shapes$/, 'schedule')
    ).replace(/\\/g, '/');
    process.env.SHAPES_DIR = path.relative(
      path.join(__dirname, '..'),
      city.gtfs.shapesDir
    ).replace(/\\/g, '/');

    // Reload GTFS data if DataLoader is available
    if (this.dataLoader) {
      this.dataLoader.dataDir = process.env.DATA_DIR;
      this.dataLoader.scheduleDir = process.env.SCHEDULE_DIR;
      this.dataLoader.shapesDir = process.env.SHAPES_DIR;
      this.dataLoader.scheduleCache = new Map();
      this.dataLoader.shapeCache = new Map();
      await this.dataLoader.loadAll();
    }

    logger.info(`🌆 Switched to city: ${city.displayName}`);
    return city;
  }

  /**
   * Get all registered cities
   */
  getAllCities() {
    return Array.from(this.cities.values());
  }

  /**
   * Get active cities only
   */
  getActiveCities() {
    return this.getAllCities().filter(city => city.active);
  }

  /**
   * Check if city is available
   */
  isCityAvailable(cityId) {
    return this.cities.has(cityId) && this.cities.get(cityId).active;
  }

  /**
   * Get city-specific GTFS data path
   */
  getGtfsPath(cityId, subPath = '') {
    const city = this.getCity(cityId);
    if (!city) {
      throw new Error(`City '${cityId}' not found`);
    }
    return path.join(city.gtfs.staticDir, subPath);
  }

  /**
   * Get city-specific GTFS-RT configuration
   */
  getGtfsRtConfig(cityId) {
    const city = this.getCity(cityId);
    if (!city) {
      throw new Error(`City '${cityId}' not found`);
    }
    return city.gtfsRt;
  }

  /**
   * Validate city data exists — checks each expected file individually
   */
  async validateCityData(cityId) {
    const fs = require('fs').promises;
    const path = require('path');
    const city = this.getCity(cityId);

    if (!city) {
      return {
        valid: false,
        error: `City '${cityId}' not found`
      };
    }

    const staticDir = city.gtfs.staticDir;
    const shapesDir = city.gtfs.shapesDir;
    const scheduleDir = staticDir.replace(/output$/, '') + 'schedule';
    const expectedFiles = [
      'stops.json', 'routes.json', 'transfers.json',
      'search_index.json', 'summary.json'
    ];

    logger.info(`Validating data for ${city.displayName}...`);
    logger.info(`  Static dir: ${staticDir}`);
    logger.info(`  Shapes dir: ${shapesDir}`);

    const missing = [];

    // Check main data dir
    const dirExists = await this._pathExists(staticDir);
    if (!dirExists) {
      logger.warn(`  [MISS] Output dir not found: ${staticDir}`);
      return {
        valid: false,
        city: city.displayName,
        staticDir,
        shapesDir,
        dirExists: false,
        missing: [staticDir],
        error: 'Output directory not found'
      };
    }
    logger.info(`  [ OK ] Output dir: ${staticDir}`);

    // Check each expected file
    for (const file of expectedFiles) {
      const exists = await this._pathExists(path.join(staticDir, file));
      if (exists) {
        logger.info(`  [ OK ] ${file}`);
      } else {
        logger.warn(`  [MISS] ${file}`);
        missing.push(file);
      }
    }

    // Check shapes dir
    const shapesExist = await this._pathExists(shapesDir);
    if (shapesExist) {
      let shapeCount = 0;
      try {
        const files = await fs.readdir(shapesDir);
        shapeCount = files.filter(f => f.endsWith('.json')).length;
      } catch { /* ignore */ }
      logger.info(`  [ OK ] shapes/ — ${shapeCount} files`);
    } else {
      logger.warn(`  [MISS] shapes/ dir: ${shapesDir}`);
      missing.push('shapes/');
    }

    // Check schedule dir
    const schedExists = await this._pathExists(scheduleDir);
    if (schedExists) {
      let schedCount = 0;
      try {
        const files = await fs.readdir(scheduleDir);
        schedCount = files.filter(f => f.endsWith('.json')).length;
      } catch { /* ignore */ }
      logger.info(`  [ OK ] schedule/ — ${schedCount} files`);
    } else {
      logger.info(`  [INFO] schedule/ dir not found (optional): ${scheduleDir}`);
    }

    const valid = missing.length === 0;
    if (valid) {
      logger.info(`  => Data valid for ${city.displayName}`);
    } else {
      logger.warn(`  => Data INCOMPLETE for ${city.displayName}: missing ${missing.join(', ')}`);
    }

    return {
      valid,
      city: city.displayName,
      staticDir,
      shapesDir,
      dirExists: true,
      missing,
    };
  }

  async _pathExists(p) {
    const fs = require('fs').promises;
    try {
      await fs.access(p);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Get summary of all cities
   */
  getSummary() {
    return {
      totalCities: this.cities.size,
      activeCities: this.getActiveCities().length,
      currentCity: this.getCurrentCity()?.displayName,
      cities: this.getActiveCities().map(city => ({
        id: city.id,
        name: city.displayName,
        state: city.state,
        timezone: city.timezone,
        hasGtfsRt: !!city.gtfsRt.apiKey
      }))
    };
  }
}

// Export singleton instance
module.exports = new CityManager();
