/**
 * City Configuration Manager
 * Manages multiple city configurations for multi-city support
 */

const path = require('path');

class CityManager {
  constructor() {
    this.cities = new Map();
    this.currentCity = process.env.ACTIVE_CITY || 'delhi';
    
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
        staticDir: path.join(__dirname, '../../data/output'),
        shapesDir: path.join(__dirname, '../../data/output/shapes')
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
   * Register a new city configuration
   */
  registerCity(cityId, config) {
    this.cities.set(cityId, {
      id: cityId,
      ...config,
      active: true,
      registeredAt: Date.now()
    });
    console.log(`✅ Registered city: ${config.displayName} (${cityId})`);
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
   * Set active city
   */
  setActiveCity(cityId) {
    if (!this.cities.has(cityId)) {
      throw new Error(`City '${cityId}' not registered`);
    }
    this.currentCity = cityId;
    console.log(`🌆 Switched to city: ${this.getCity(cityId).displayName}`);
    return this.getCity(cityId);
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
   * Validate city data exists
   */
  async validateCityData(cityId) {
    const fs = require('fs').promises;
    const city = this.getCity(cityId);
    
    if (!city) {
      return {
        valid: false,
        error: `City '${cityId}' not found`
      };
    }

    try {
      // Check if GTFS directory exists
      await fs.access(city.gtfs.staticDir);
      
      return {
        valid: true,
        city: city.displayName,
        hasGtfs: true,
        hasShapes: await this._directoryExists(city.gtfs.shapesDir)
      };
    } catch (error) {
      return {
        valid: false,
        city: city.displayName,
        hasGtfs: false,
        error: 'GTFS data not found'
      };
    }
  }

  async _directoryExists(dirPath) {
    const fs = require('fs').promises;
    try {
      await fs.access(dirPath);
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
