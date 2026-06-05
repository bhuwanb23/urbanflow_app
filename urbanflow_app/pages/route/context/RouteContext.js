import React, { createContext, useContext, useState, useEffect, useCallback, useRef } from 'react';
import { routesAPI } from '../../../utils/api';

/**
 * Route Context
 * Provides route state management across all route components.
 *
 * The provider fetches the route from the backend using
 * `routesAPI.getRoute(routeId)` whenever a `routeId` prop is
 * supplied. An `initialRoute` prop may be used to seed the
 * state (for example, when a planner hands off a fully formed
 * route without a network round-trip, or in tests). When both
 * are supplied, `initialRoute` wins and is treated as the
 * authoritative source — the network fetch is skipped.
 */
const RouteContext = createContext(null);

/**
 * Route Provider Component
 * Wraps the route screen and provides state to all child components
 */
export function RouteProvider({ children, routeId, initialRoute }) {
  const [currentRoute, setCurrentRoute] = useState(initialRoute || null);
  const [isLoading, setIsLoading] = useState(Boolean(routeId) && !initialRoute);
  const [error, setError] = useState(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);
  const lastFetchedId = useRef(null);

  // Fetch the route from the backend when routeId is provided and we
  // don't already have an initial route seeded in.
  useEffect(() => {
    if (initialRoute) {
      setCurrentRoute(initialRoute);
      setIsLoading(false);
      setError(null);
      return;
    }
    if (!routeId) {
      return;
    }
    let cancelled = false;
    lastFetchedId.current = routeId;
    setIsLoading(true);
    setError(null);
    routesAPI
      .getRoute(routeId)
      .then((response) => {
        if (cancelled || lastFetchedId.current !== routeId) return;
        const data = response?.data?.route || response?.data || response;
        if (data && (data.id || data.segments || data.legs)) {
          setCurrentRoute(data);
          setError(null);
        } else {
          setError('Route not found');
        }
      })
      .catch((err) => {
        if (cancelled || lastFetchedId.current !== routeId) return;
        setError(err?.message || 'Failed to load route');
      })
      .finally(() => {
        if (cancelled) return;
        setIsLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, [routeId, initialRoute]);

  // Calculate progress percentage
  const progress = currentRoute?.segments
    ? ((currentSegmentIndex + 1) / currentRoute.segments.length) * 100
    : 0;

  /**
   * Update the current route data
   */
  const updateRoute = useCallback((routeData) => {
    setCurrentRoute(routeData);
    setError(null);
  }, []);

  /**
   * Update journey progress to a specific segment
   */
  const updateProgress = useCallback((segmentIndex) => {
    setCurrentSegmentIndex((current) => {
      const total = currentRoute?.segments?.length || 0;
      if (total === 0) return 0;
      if (segmentIndex < 0) return 0;
      if (segmentIndex >= total) return current;
      return segmentIndex;
    });
  }, [currentRoute]);

  /**
   * Complete the current segment and move to next
   */
  const completeSegment = useCallback(() => {
    setCurrentSegmentIndex((prev) => {
      const total = currentRoute?.segments?.length || 0;
      if (total === 0) return 0;
      if (prev < total - 1) return prev + 1;
      return prev;
    });
  }, [currentRoute]);

  /**
   * Reset journey progress
   */
  const resetProgress = useCallback(() => {
    setCurrentSegmentIndex(0);
  }, []);

  /**
   * Set loading state
   */
  const setLoading = useCallback((loading) => {
    setIsLoading(loading);
    if (loading) setError(null);
  }, []);

  /**
   * Handle errors
   */
  const handleError = useCallback((errorMessage) => {
    setError(errorMessage);
    setIsLoading(false);
  }, []);

  /**
   * Retry the most recent fetch (routeId-based)
   */
  const refetch = useCallback(() => {
    if (!routeId) return Promise.resolve();
    setIsLoading(true);
    setError(null);
    return routesAPI
      .getRoute(routeId)
      .then((response) => {
        const data = response?.data?.route || response?.data || response;
        if (data && (data.id || data.segments || data.legs)) {
          setCurrentRoute(data);
          setError(null);
        } else {
          setError('Route not found');
        }
        return data;
      })
      .catch((err) => {
        setError(err?.message || 'Failed to load route');
        throw err;
      })
      .finally(() => setIsLoading(false));
  }, [routeId]);

  const value = {
    currentRoute,
    isLoading,
    error,
    progress,
    currentSegmentIndex,
    totalSegments: currentRoute?.segments?.length || 0,
    completedSegments: currentSegmentIndex,
    updateRoute,
    updateProgress,
    completeSegment,
    resetProgress,
    setLoading,
    handleError,
    refetch,
  };

  return (
    <RouteContext.Provider value={value}>
      {children}
    </RouteContext.Provider>
  );
}

/**
 * Custom hook to use route context
 */
export function useRoute() {
  const context = useContext(RouteContext);
  if (!context) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
}

export default RouteContext;
