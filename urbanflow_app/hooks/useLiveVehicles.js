/**
 * useLiveVehicles Hook
 * Fetches real-time bus positions from backend API
 */

import { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import { API_CONFIG } from '../utils/api';

const API_BASE_URL = `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}`;

export function useLiveVehicles(options = {}) {
  const {
    routeId = null,
    refreshInterval = 30000, // 30 seconds
    enabled = true
  } = options;

  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchVehicles = useCallback(async () => {
    if (!enabled) return;

    try {
      setLoading(true);
      
      const url = routeId 
        ? `${API_BASE_URL}/live/vehicles/route/${routeId}`
        : `${API_BASE_URL}/live/vehicles`;

      const response = await axios.get(url);
      
      if (response.data.success) {
        setVehicles(response.data.data.vehicles);
        setLastUpdated(new Date(response.data.data.lastUpdated));
        setError(null);
      } else {
        setError(response.data.error || 'Failed to fetch vehicles');
      }
    } catch (err) {
      console.error('Error fetching live vehicles:', err);
      setError(err.message || 'Network error');
    } finally {
      setLoading(false);
    }
  }, [routeId, refreshInterval, enabled]);

  useEffect(() => {
    // Initial fetch
    fetchVehicles();

    // Auto-refresh
    if (enabled && refreshInterval > 0) {
      const intervalId = setInterval(fetchVehicles, refreshInterval);
      return () => clearInterval(intervalId);
    }
  }, [fetchVehicles, refreshInterval, enabled]);

  const refetch = useCallback(() => {
    return fetchVehicles();
  }, [fetchVehicles]);

  return {
    vehicles,
    loading,
    error,
    lastUpdated,
    refetch,
    hasData: vehicles.length > 0
  };
}

export default useLiveVehicles;
