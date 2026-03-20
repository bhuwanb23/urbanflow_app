/**
 * Alerts Service
 * Manages service alerts and incidents from GTFS-RT feeds
 */

const axios = require('axios');
const gtfsParser = require('./gtfsRealtimeParser');
const logger = require('../utils/logger');

class AlertsService {
  constructor() {
    this.alerts = [];
    this.lastUpdated = null;
    this.nextUpdate = null;
    this.updateInterval = 60000; // 1 minute (alerts change less frequently)
    this.dultApiUrl = process.env.DULT_ALERTS_URL || '';
    this.dultApiKey = process.env.DULT_API_KEY || '';
    
    // Start auto-refresh
    this.startAutoRefresh();
  }

  /**
   * Fetch latest alerts from DULT API
   */
  async fetchAlerts() {
    try {
      if (!this.dultApiUrl) {
        logger.warn('DULT_ALERTS_URL not configured, using mock data');
        return this._getMockAlerts();
      }

      const response = await axios.get(this.dultApiUrl, {
        headers: {
          'Authorization': `Bearer ${this.dultApiKey}`,
          'Accept': 'application/x-protobuf'
        },
        responseType: 'arraybuffer',
        timeout: 10000
      });

      const alerts = gtfsParser.parseAlerts(response.data);
      
      // Update cache
      this.alerts = alerts;
      this.lastUpdated = Date.now();
      this.nextUpdate = Date.now() + this.updateInterval;

      logger.info(`Updated ${alerts.length} service alerts`);
      return alerts;

    } catch (error) {
      logger.error('Error fetching alerts:', error.message);
      
      // Return cached data or mock data as fallback
      if (this.alerts.length > 0) {
        logger.info('Returning cached alerts');
        return this.alerts;
      }
      
      return this._getMockAlerts();
    }
  }

  /**
   * Get all active alerts
   * @param {Object} filters - Optional filters
   * @returns {Array} Array of alerts
   */
  getAllAlerts(filters = {}) {
    let alerts = [...this.alerts];

    // Filter by severity
    if (filters.severity) {
      alerts = alerts.filter(a => a.severityLevel === filters.severity);
    }

    // Filter by route
    if (filters.routeId) {
      alerts = alerts.filter(a => 
        a.affectedRoutes.some(r => r.routeId === filters.routeId)
      );
    }

    // Filter by cause
    if (filters.cause) {
      alerts = alerts.filter(a => a.cause === filters.cause);
    }

    // Only active alerts
    const now = Date.now();
    alerts = alerts.filter(a => {
      if (!a.activePeriod.end) return true; // Ongoing alerts
      return a.activePeriod.end > now;
    });

    // Sort by severity (CRITICAL first)
    const severityOrder = { CRITICAL: 0, WARNING: 1, INFO: 2 };
    alerts.sort((a, b) => severityOrder[a.severityLevel] - severityOrder[b.severityLevel]);

    return alerts;
  }

  /**
   * Get alerts for a specific route
   * @param {string} routeId 
   * @returns {Array}
   */
  getAlertsByRoute(routeId) {
    return this.getAllAlerts({ routeId });
  }

  /**
   * Get critical alerts only
   * @returns {Array}
   */
  getCriticalAlerts() {
    return this.getAllAlerts({ severity: 'CRITICAL' });
  }

  /**
   * Get alert by ID
   * @param {string} alertId 
   * @returns {Object|null}
   */
  getAlertById(alertId) {
    return this.alerts.find(a => a.alertId === alertId) || null;
  }

  /**
   * Transform alert into feed item format for frontend
   * @param {Object} alert 
   * @returns {Object}
   */
  transformToFeedItem(alert) {
    const timeAgo = this._getTimeAgo(alert.activePeriod.start);
    
    return {
      id: alert.alertId,
      title: alert.header,
      description: alert.description,
      category: this._getCategoryFromCause(alert.cause),
      icon: this._getIconForSeverity(alert.severityLevel),
      timestamp: alert.activePeriod.start,
      timeAgo: timeAgo,
      urgency: alert.severityLevel,
      badge: this._getBadgeText(alert.severityLevel),
      affectedRoutes: alert.affectedRoutes.map(r => r.routeId),
      url: alert.url
    };
  }

  /**
   * Get recent alerts for live feed
   * @param {number} limit - Maximum number of alerts to return
   * @returns {Array}
   */
  getRecentFeedItems(limit = 5) {
    const alerts = this.getAllAlerts();
    return alerts
      .slice(0, limit)
      .map(alert => this.transformToFeedItem(alert));
  }

  /**
   * Start automatic refresh of alerts
   */
  startAutoRefresh() {
    setInterval(async () => {
      try {
        await this.fetchAlerts();
      } catch (error) {
        logger.error('Auto-refresh failed:', error.message);
      }
    }, this.updateInterval);

    logger.info('Alerts auto-refresh started');
  }

  /**
   * Get service status
   */
  getStatus() {
    const alerts = this.getAllAlerts();
    return {
      totalAlerts: alerts.length,
      criticalAlerts: alerts.filter(a => a.severityLevel === 'CRITICAL').length,
      warningAlerts: alerts.filter(a => a.severityLevel === 'WARNING').length,
      lastUpdated: this.lastUpdated,
      nextUpdate: this.nextUpdate,
      isRunning: true
    };
  }

  // Helper methods

  _getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return `${seconds}s ago`;
    const minutes = Math.floor(seconds / 60);
    if (minutes < 60) return `${minutes}m ago`;
    const hours = Math.floor(minutes / 60);
    return `${hours}h ago`;
  }

  _getCategoryFromCause(cause) {
    const categoryMap = {
      'ACCIDENT': 'incident',
      'CONSTRUCTION': 'maintenance',
      'MAINTENANCE': 'maintenance',
      'WEATHER': 'weather',
      'STRIKE': 'service-change',
      'DEMONSTRATION': 'service-change',
      'MEDICAL_EMERGENCY': 'incident',
      'POLICE_ACTIVITY': 'incident',
      'TECHNICAL_PROBLEM': 'technical'
    };
    return categoryMap[cause] || 'general';
  }

  _getIconForSeverity(severity) {
    const iconMap = {
      'CRITICAL': 'alert-circle',
      'WARNING': 'alert-outline',
      'INFO': 'information-outline'
    };
    return iconMap[severity] || 'information-outline';
  }

  _getBadgeText(severity) {
    const badgeMap = {
      'CRITICAL': 'URGENT',
      'WARNING': 'IMPACT',
      'INFO': 'NEW'
    };
    return badgeMap[severity] || 'INFO';
  }

  /**
   * Generate mock alerts for development/testing
   */
  _getMockAlerts() {
    const mockAlerts = [
      {
        alertId: 'ALERT_001',
        header: 'Line 4 Expansion Active',
        description: 'North Station to Riverside Route Now in Service. New stops added along the route with increased frequency during peak hours.',
        severityLevel: 'INFO',
        cause: 'ADDITIONAL_SERVICE',
        effect: 'ADDITIONAL_SERVICE',
        url: '',
        activePeriod: {
          start: Date.now() - (2 * 60 * 1000), // 2 minutes ago
          end: null
        },
        affectedRoutes: [{ routeId: '4', agencyId: 'BMTC' }]
      },
      {
        alertId: 'ALERT_002',
        header: 'Main Street Maintenance',
        description: 'Surface repairs between 5th & 8th Avenue causing delays. Expect 10-15 minute delays on routes 500A, 201B.',
        severityLevel: 'WARNING',
        cause: 'CONSTRUCTION',
        effect: 'SIGNIFICANT_DELAYS',
        url: '',
        activePeriod: {
          start: Date.now() - (15 * 60 * 1000), // 15 minutes ago
          end: Date.now() + (2 * 60 * 60 * 1000) // 2 hours from now
        },
        affectedRoutes: [
          { routeId: '500A', agencyId: 'BMTC' },
          { routeId: '201B', agencyId: 'BMTC' }
        ]
      },
      {
        alertId: 'ALERT_003',
        header: 'EV Hub Deployment Complete',
        description: '3 new charging clusters now operational in Zone B. Electric buses deployed on routes KIA-6, KIA-7, and VAYU-3.',
        severityLevel: 'INFO',
        cause: 'ADDITIONAL_SERVICE',
        effect: 'ADDITIONAL_SERVICE',
        url: '',
        activePeriod: {
          start: Date.now() - (44 * 60 * 1000), // 44 minutes ago
          end: null
        },
        affectedRoutes: [
          { routeId: 'KIA-6', agencyId: 'BMTC' },
          { routeId: 'KIA-7', agencyId: 'BMTC' },
          { routeId: 'VAYU-3', agencyId: 'BMTC' }
        ]
      }
    ];

    this.alerts = mockAlerts;
    this.lastUpdated = Date.now();
    this.nextUpdate = Date.now() + this.updateInterval;

    return mockAlerts;
  }
}

// Singleton instance
const service = new AlertsService();

module.exports = service;
