const fs = require('fs');
const path = require('path');
const logger = require('../utils/logger');

class DataLoader {
  constructor() {
    this.dataDir = process.env.DATA_DIR || '../data/output';
    this.scheduleDir = process.env.SCHEDULE_DIR || '../data/output/schedule';
    this.shapesDir = process.env.SHAPES_DIR || '../data/output/shapes';
    
    this.stops = null;
    this.routes = null;
    this.searchIndex = null;
    this.transfers = null;
    this.summary = null;
    
    // Cache for frequently accessed schedules and shapes
    this.scheduleCache = new Map();
    this.shapeCache = new Map();
  }

  async loadAll() {
    try {
      logger.info('Loading GTFS data files...');
      
      // Load main data files into memory
      this.stops = await this.loadJSON('stops.json');
      logger.info(`✓ Loaded ${this.stops.length} stops`);
      
      this.routes = await this.loadJSON('routes.json');
      logger.info(`✓ Loaded ${this.routes.length} routes`);
      
      this.searchIndex = await this.loadJSON('search_index.json');
      logger.info(`✓ Loaded ${this.searchIndex.length} search index entries`);
      
      this.transfers = await this.loadJSON('transfers.json');
      logger.info(`✓ Loaded ${this.transfers.length} transfers`);
      
      this.summary = await this.loadJSON('summary.json');
      logger.info(`✓ Loaded summary data`);
      
      logger.info('All GTFS data loaded successfully!');
    } catch (error) {
      logger.error('Error loading GTFS data:', error);
      throw error;
    }
  }

  async loadJSON(filename) {
    const filePath = path.join(__dirname, '..', this.dataDir, filename);
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(JSON.parse(data));
        }
      });
    });
  }

  getStops(bbox = null) {
    if (!bbox) {
      return this.stops;
    }
    
    // Filter stops by bounding box
    const [minLat, minLon, maxLat, maxLon] = bbox.split(',').map(Number);
    return this.stops.filter(stop => 
      stop.lat >= minLat && stop.lat <= maxLat &&
      stop.lon >= minLon && stop.lon <= maxLon
    );
  }

  getRoutes(limit = null) {
    if (limit) {
      return this.routes.slice(0, limit);
    }
    return this.routes;
  }

  getRouteById(routeId) {
    return this.routes.find(r => r.id === routeId);
  }

  getSearchIndex() {
    return this.searchIndex;
  }

  getTransfers() {
    return this.transfers;
  }

  getSummary() {
    return this.summary;
  }

  async getSchedule(routeId) {
    // Check cache first
    if (this.scheduleCache.has(routeId)) {
      return this.scheduleCache.get(routeId);
    }

    // Load from disk
    const filePath = path.join(this.scheduleDir, `${routeId}.json`);
    
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(new Error(`Schedule not found for route ${routeId}`));
        } else {
          const schedule = JSON.parse(data);
          // Cache it (with LRU strategy in production)
          if (this.scheduleCache.size < 100) {
            this.scheduleCache.set(routeId, schedule);
          }
          resolve(schedule);
        }
      });
    });
  }

  async getShape(shapeId) {
    // Check cache first
    if (this.shapeCache.has(shapeId)) {
      return this.shapeCache.get(shapeId);
    }

    // Load from disk
    const filePath = path.join(this.shapesDir, `${shapeId}.json`);
    
    return new Promise((resolve, reject) => {
      fs.readFile(filePath, 'utf8', (err, data) => {
        if (err) {
          reject(new Error(`Shape not found for ${shapeId}`));
        } else {
          const shape = JSON.parse(data);
          // Cache it
          if (this.shapeCache.size < 100) {
            this.shapeCache.set(shapeId, shape);
          }
          resolve(shape);
        }
      });
    });
  }

  findNearby(lat, lon, radiusMeters = 500) {
    // Simple distance calculation using bounding box
    // For production, use Haversine formula or geospatial index
    const latDelta = (radiusMeters / 111320) * (180 / Math.PI);
    const lonDelta = (radiusMeters / 111320) * (180 / Math.PI) / Math.cos(lat * Math.PI / 180);
    
    const minLat = lat - latDelta;
    const maxLat = lat + latDelta;
    const minLon = lon - lonDelta;
    const maxLon = lon + lonDelta;
    
    return this.stops.filter(stop => 
      stop.lat >= minLat && stop.lat <= maxLat &&
      stop.lon >= minLon && stop.lon <= maxLon
    );
  }
}

module.exports = DataLoader;
