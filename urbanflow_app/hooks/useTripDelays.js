/**
 * useTripDelays Hook
 * Fetches real-time delay predictions from backend API
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const API_BASE_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api/v1';

export function useTripDelays(options = {}) {
  const {
    routeId = null,
    tripId = null,
    severityFilter = null, // 'minor', 'moderate', 'severe'
    refreshInterval = 30000, // 30 seconds
    enabled = true
  } = options;

  const [delays, setDelays] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);
  const [summary, setSummary] = useState({
    totalTrips: 0,
    onTime: 0,
    delayed: 0,
    severe: 0
  });

  const fetchDelays = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      
      let url = `${API_BASE_URL}/live/delays`;
      
      if (severityFilter) {
        url += `/${severityFilter}`;
      } else if (routeId) {
        url += `/route/${routeId}`;
      } else if (tripId) {
        url += `/trip/${tripId}`;
      }

      const response = await axios.get(url);
      
      if (response.data.success) {
        const delaysData = response.data.data.delays;
        setDelays(delaysData);
        setLastUpdated(new Date(response.data.data.lastUpdated));
        
        // Calculate summary
        const summaryStats = {
          totalTrips: delaysData.length,
          onTime: delaysData.filter(d => d.prediction === 'on-time').length,
          delayed: delaysData.filter(d => ['delayed', 'minor-delay'].includes(d.prediction)).length,
          severe: delaysData.filter(d => d.prediction === 'severe').length
        };
        setSummary(summaryStats);
        
        setError(null);
      } else {
        setError(response.data.error || 'Failed to fetch delays');
      }
    } catch (err) {
      console.error('Error fetching trip delays:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [routeId, tripId, severityFilter, refreshInterval, enabled]);

  useEffect(() => {
    // Initial fetch
    fetchDelays();

    // Auto-refresh
    if (enabled && refreshInterval > 0) {
      const intervalId = setInterval(fetchDelays, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchDelays, refreshInterval, severityFilter, routeId, tripId, enabled]);

  const refetch = useCallback(() => {
    return fetchDelays();
  }, [fetchDelays]);

  const getDelayForRoute = useCallback((routeId) => {
    return delays.find(d => d.routeId === routeId);
  }, [delays]);

  const getDelayForTrip = useCallback((tripId) => {
    return delays.find(d => d.tripId === tripId);
  }, [delays]);

  return {
    delays,
    loading,
    error,
    lastUpdated,
    summary,
    refetch,
    getDelayForRoute,
    getDelayForTrip,
    hasData: delays.length > 0
  };
}

export default useTripDelays;
