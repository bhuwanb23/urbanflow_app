import { useState, useCallback, useRef, useEffect } from 'react';
import * as Location from 'expo-location';

/**
 * Custom hook for live tracking functionality
 * Tracks user location, speed, and movement during journey
 */
export function useLiveTracking() {
  const [isTracking, setIsTracking] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [speed, setSpeed] = useState(null);
  const [locationHistory, setLocationHistory] = useState([]);
  const subscriptionRef = useRef(null);

  // Ensure any active position subscription is cleaned up on unmount.
  useEffect(() => {
    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.remove();
        subscriptionRef.current = null;
      }
    };
  }, []);

  /**
   * Start location tracking
   */
  const startTracking = useCallback(async () => {
    try {
      // Request location permission
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        console.warn('Location permission denied');
        return;
      }

      setIsTracking(true);

      // Get initial location
      const location = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });

      setCurrentLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      setSpeed(location.coords.speed || 0);

      // Subscribe to location updates
      subscriptionRef.current = await Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.High,
          timeInterval: 5000, // Update every 5 seconds
          distanceInterval: 10, // Update every 10 meters
        },
        (location) => {
          setCurrentLocation({
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
          });
          setSpeed(location.coords.speed || 0);
          setLocationHistory(prev => [...prev.slice(-10), {
            latitude: location.coords.latitude,
            longitude: location.coords.longitude,
            timestamp: location.timestamp,
          }]);
        }
      );
    } catch (error) {
      console.error('Error starting location tracking:', error);
      setIsTracking(false);
    }
  }, []);

  /**
   * Stop location tracking
   */
  const stopTracking = useCallback(() => {
    setIsTracking(false);
    if (subscriptionRef.current) {
      subscriptionRef.current.remove();
      subscriptionRef.current = null;
    }
  }, []);

  /**
   * Manually update location (for testing/simulation)
   */
  const updateLocation = useCallback((location) => {
    setCurrentLocation(location);
  }, []);

  /**
   * Get distance traveled
   */
  const getDistanceTraveled = useCallback(() => {
    if (locationHistory.length < 2) return 0;
    
    // Simple distance calculation (in real app, use Haversine formula)
    return locationHistory.length * 0.01; // Approximate km
  }, [locationHistory]);

  /**
   * Get estimated arrival time based on current speed
   */
  const getETA = useCallback((remainingDistance) => {
    if (!speed || speed <= 0) return null;
    const timeHours = remainingDistance / speed;
    return Math.round(timeHours * 60); // Return minutes
  }, [speed]);

  return {
    isTracking,
    currentLocation,
    speed,
    locationHistory,
    startTracking,
    stopTracking,
    updateLocation,
    getDistanceTraveled,
    getETA,
  };
}

export default useLiveTracking;
