/**
 * useLiveAlerts Hook
 * Fetches real-time service alerts from backend API
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../utils/api';

const API_BASE_URL = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`;

export function useLiveAlerts(options = {}) {
  const {
    severityFilter = null, // 'critical', 'warning', 'info'
    limit = null, // Number of recent items to fetch
    refreshInterval = 60000, // 60 seconds (alerts update less frequently)
    enabled = true
  } = options;

  const [alerts, setAlerts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [feedItems, setFeedItems] = useState([]);

  const fetchAlerts = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      
      let url = `${API_BASE_URL}/live/alerts`;
      
      if (severityFilter) {
        url += `/${severityFilter}`;
      } else if (limit) {
        url += `/recent?limit=${limit}`;
      }

      const response = await axios.get(url);
      
      if (response.data.success) {
        const alertsData = response.data.data?.alerts || [];
        setAlerts(alertsData);
        setLastUpdated(new Date(response.data.data?.lastUpdated || Date.now()));
        
        // Transform alerts to feed items for LiveDashboard
        const transformedFeedItems = alertsData.map(alert => ({
          id: alert.id,
          type: mapSeverityToFeedType(alert.severity),
          title: alert.headerText,
          description: alert.descriptionText,
          timestamp: new Date(alert.startTime || Date.now()),
          routeIds: alert.informedEntities?.map(e => e.routeId) || [],
          severity: alert.severity,
          cause: alert.cause,
          effect: alert.effect
        }));
        setFeedItems(transformedFeedItems);
        
        setError(null);
      } else {
        setError(response.data.error || 'Failed to fetch alerts');
      }
    } catch (err) {
      console.error('Error fetching live alerts:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [severityFilter, limit, refreshInterval, enabled]);

  useEffect(() => {
    // Initial fetch
    fetchAlerts();

    // Auto-refresh
    if (enabled && refreshInterval > 0) {
      const intervalId = setInterval(fetchAlerts, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchAlerts, refreshInterval, severityFilter, limit, enabled]);

  const refetch = useCallback(() => {
    return fetchAlerts();
  }, [fetchAlerts]);

  // Helper to map alert severity to feed item types
  const mapSeverityToFeedType = (severity) => {
    switch (severity) {
      case 'CRITICAL': return 'alert';
      case 'WARNING': return 'warning';
      case 'INFO': 
      default: return 'update';
    }
  };

  const getAlertsForRoute = useCallback((routeId) => {
    return alerts?.filter(alert => 
      alert.informedEntities?.some(e => e.routeId === routeId)
    ) || [];
  }, [alerts]);

  const hasCriticalAlerts = alerts?.some(a => a.severity === 'CRITICAL') || false;
  const hasWarningAlerts = alerts?.some(a => a.severity === 'WARNING') || false;

  return {
    alerts,
    feedItems,
    loading,
    error,
    lastUpdated,
    refetch,
    getAlertsForRoute,
    hasCriticalAlerts,
    hasWarningAlerts,
    hasData: alerts.length > 0
  };
}

export default useLiveAlerts;
