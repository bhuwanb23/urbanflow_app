/**
 * usePopularRoutes Hook
 * Fetches popular route summaries from the backend.
 */

import { useState, useEffect, useCallback } from 'react';
import { routesAPI } from '../utils/api';

export function usePopularRoutes(options = {}) {
  const { refreshInterval = 300000, enabled = true } = options;

  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchRoutes = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      const response = await routesAPI.getPopularRoutes();
      const data = response?.data || response || [];
      const list = Array.isArray(data) ? data : data.routes || [];
      setRoutes(list);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load popular routes');
    } finally {
      setLoading(false);
    }
  }, [enabled]);

  useEffect(() => {
    fetchRoutes();
    if (enabled && refreshInterval > 0) {
      const id = setInterval(fetchRoutes, refreshInterval);
      return () => clearInterval(id);
    }
  }, [fetchRoutes, refreshInterval, enabled]);

  return {
    routes,
    loading,
    error,
    lastUpdated,
    refetch: fetchRoutes,
    hasData: routes.length > 0,
  };
}

export default usePopularRoutes;
