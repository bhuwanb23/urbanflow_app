import React, { createContext, useContext, useState, useCallback } from 'react';
import { MOCK_ROUTE_DATA } from '../constants/routeConstants';

/**
 * Route Context
 * Provides route state management across all route components
 */
const RouteContext = createContext(null);

/**
 * Route Provider Component
 * Wraps the route screen and provides state to all child components
 */
export function RouteProvider({ children }) {
  const [currentRoute, setCurrentRoute] = useState(MOCK_ROUTE_DATA);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [currentSegmentIndex, setCurrentSegmentIndex] = useState(0);

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
    if (currentRoute?.segments && segmentIndex >= 0 && segmentIndex < currentRoute.segments.length) {
      setCurrentSegmentIndex(segmentIndex);
    }
  }, [currentRoute]);

  /**
   * Complete the current segment and move to next
   */
  const completeSegment = useCallback(() => {
    if (currentRoute?.segments && currentSegmentIndex < currentRoute.segments.length - 1) {
      setCurrentSegmentIndex(prev => prev + 1);
    }
  }, [currentRoute, currentSegmentIndex]);

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
