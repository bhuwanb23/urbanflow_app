/**
 * useTrafficConditions Hook
 * Fetches live traffic conditions for a specific area from the backend.
 */

import { useState, useEffect, useCallback } from 'react';
import { trafficAPI } from '../utils/api';

export function useTrafficConditions(area = 'bengaluru', options = {}) {
  const { refreshInterval = 60000, enabled = true } = options;

  const [conditions, setConditions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastUpdated, setLastUpdated] = useState(null);

  const fetchConditions = useCallback(async () => {
    if (!enabled) return;
    try {
      setLoading(true);
      const response = await trafficAPI.getTrafficConditions(area);
      const data = response?.data || response || [];
      const list = Array.isArray(data) ? data : data.conditions || [];
      setConditions(list);
      setLastUpdated(new Date());
      setError(null);
    } catch (err) {
      setError(err.message || 'Failed to load traffic conditions');
    } finally {
      setLoading(false);
    }
  }, [area, enabled]);

  useEffect(() => {
    fetchConditions();
    if (enabled && refreshInterval > 0) {
      const id = setInterval(fetchConditions, refreshInterval);
      return () => clearInterval(id);
    }
  }, [fetchConditions, refreshInterval, enabled]);

  return {
    conditions,
    loading,
    error,
    lastUpdated,
    refetch: fetchConditions,
    hasData: conditions.length > 0,
  };
}

export default useTrafficConditions;
