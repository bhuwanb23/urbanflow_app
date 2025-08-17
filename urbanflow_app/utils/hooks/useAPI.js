import { useState, useEffect, useCallback } from 'react';
import {
  authAPI,
  userAPI,
  tripsAPI,
  routesAPI,
  ecoStatsAPI,
  trafficAPI,
  notificationsAPI,
  demoAPI,
  healthAPI,
  tokenManager,
  authFlow,
} from '../api';

// ============================================================================
// AUTHENTICATION HOOK
// ============================================================================

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check if user is logged in on mount
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const isLoggedIn = await tokenManager.isLoggedIn();
      if (isLoggedIn) {
        const userData = await tokenManager.getUserData();
        setUser(userData);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setLoading(true);
      setError(null);
      
      const authData = await authFlow.login(credentials);
      setUser(authData.user);
      return authData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    try {
      setLoading(true);
      setError(null);
      
      const authData = await authFlow.register(userData);
      setUser(authData.user);
      return authData;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await authFlow.logout();
      setUser(null);
    } catch (err) {
      setError(err.message);
      // Even if logout fails, clear user state
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const updateProfile = async (profileData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedUser = await userAPI.updateProfile(profileData);
      setUser(updatedUser);
      return updatedUser;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
    checkAuthStatus,
  };
};

// ============================================================================
// TRIPS HOOK
// ============================================================================

export const useTrips = () => {
  const [trips, setTrips] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrips = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await tripsAPI.getTrips(params);
      setTrips(data.trips || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const createTrip = async (tripData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newTrip = await tripsAPI.createTrip(tripData);
      setTrips(prev => [newTrip, ...prev]);
      return newTrip;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateTrip = async (tripId, tripData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedTrip = await tripsAPI.updateTrip(tripId, tripData);
      setTrips(prev => prev.map(trip => 
        trip.id === tripId ? updatedTrip : trip
      ));
      return updatedTrip;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteTrip = async (tripId) => {
    try {
      setLoading(true);
      setError(null);
      
      await tripsAPI.deleteTrip(tripId);
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTripStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await tripsAPI.getTripStats();
      return stats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trips,
    loading,
    error,
    fetchTrips,
    createTrip,
    updateTrip,
    deleteTrip,
    getTripStats,
  };
};

// ============================================================================
// ROUTES HOOK
// ============================================================================

export const useRoutes = () => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchRoutes = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await routesAPI.getRoutes(params);
      setRoutes(data.routes || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getRoute = async (routeId) => {
    try {
      setLoading(true);
      setError(null);
      
      const route = await routesAPI.getRoute(routeId);
      return route;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const createRoute = async (routeData) => {
    try {
      setLoading(true);
      setError(null);
      
      const newRoute = await routesAPI.createRoute(routeData);
      setRoutes(prev => [newRoute, ...prev]);
      return newRoute;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateRoute = async (routeId, routeData) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedRoute = await routesAPI.updateRoute(routeId, routeData);
      setRoutes(prev => prev.map(route => 
        route.id === routeId ? updatedRoute : route
      ));
      return updatedRoute;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteRoute = async (routeId) => {
    try {
      setLoading(true);
      setError(null);
      
      await routesAPI.deleteRoute(routeId);
      setRoutes(prev => prev.filter(route => route.id !== routeId));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const searchRoutes = async (searchParams) => {
    try {
      setLoading(true);
      setError(null);
      
      const results = await routesAPI.searchRoutes(searchParams);
      return results;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getPopularRoutes = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const popularRoutes = await routesAPI.getPopularRoutes();
      return popularRoutes;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    routes,
    loading,
    error,
    fetchRoutes,
    getRoute,
    createRoute,
    updateRoute,
    deleteRoute,
    searchRoutes,
    getPopularRoutes,
  };
};

// ============================================================================
// ECO STATS HOOK
// ============================================================================

export const useEcoStats = () => {
  const [ecoStats, setEcoStats] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchEcoStats = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await ecoStatsAPI.getEcoStats(params);
      setEcoStats(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getWeeklyStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const weeklyStats = await ecoStatsAPI.getWeeklyStats();
      return weeklyStats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getMonthlyStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const monthlyStats = await ecoStatsAPI.getMonthlyStats();
      return monthlyStats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getYearlyStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const yearlyStats = await ecoStatsAPI.getYearlyStats();
      return yearlyStats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getAchievements = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const achievements = await ecoStatsAPI.getAchievements();
      return achievements;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getCarbonFootprint = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const carbonFootprint = await ecoStatsAPI.getCarbonFootprint();
      return carbonFootprint;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    ecoStats,
    loading,
    error,
    fetchEcoStats,
    getWeeklyStats,
    getMonthlyStats,
    getYearlyStats,
    getAchievements,
    getCarbonFootprint,
  };
};

// ============================================================================
// TRAFFIC HOOK
// ============================================================================

export const useTraffic = () => {
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchLiveTraffic = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await trafficAPI.getLiveTraffic(params);
      setTrafficData(data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getTrafficConditions = async (area) => {
    try {
      setLoading(true);
      setError(null);
      
      const conditions = await trafficAPI.getTrafficConditions(area);
      return conditions;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTrafficAlerts = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const alerts = await trafficAPI.getTrafficAlerts();
      return alerts;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getTrafficPredictions = async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const predictions = await trafficAPI.getTrafficPredictions(params);
      return predictions;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    trafficData,
    loading,
    error,
    fetchLiveTraffic,
    getTrafficConditions,
    getTrafficAlerts,
    getTrafficPredictions,
  };
};

// ============================================================================
// NOTIFICATIONS HOOK
// ============================================================================

export const useNotifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchNotifications = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await notificationsAPI.getNotifications(params);
      setNotifications(data.notifications || data);
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const markAsRead = async (notificationId) => {
    try {
      setLoading(true);
      setError(null);
      
      await notificationsAPI.markAsRead(notificationId);
      setNotifications(prev => prev.map(notification => 
        notification.id === notificationId 
          ? { ...notification, isRead: true }
          : notification
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const markAllAsRead = async () => {
    try {
      setLoading(true);
      setError(null);
      
      await notificationsAPI.markAllAsRead();
      setNotifications(prev => prev.map(notification => ({
        ...notification,
        isRead: true
      })));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const deleteNotification = async (notificationId) => {
    try {
      setLoading(true);
      setError(null);
      
      await notificationsAPI.deleteNotification(notificationId);
      setNotifications(prev => prev.filter(notification => 
        notification.id !== notificationId
      ));
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const getSettings = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const settings = await notificationsAPI.getSettings();
      return settings;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateSettings = async (settings) => {
    try {
      setLoading(true);
      setError(null);
      
      const updatedSettings = await notificationsAPI.updateSettings(settings);
      return updatedSettings;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    notifications,
    loading,
    error,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    deleteNotification,
    getSettings,
    updateSettings,
  };
};

// ============================================================================
// DEMO DATA HOOK
// ============================================================================

export const useDemoData = () => {
  const [demoData, setDemoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchTrafficData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await demoAPI.getTrafficData();
      setDemoData(prev => ({ ...prev, traffic: data }));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchRouteSuggestions = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const data = await demoAPI.getRouteSuggestions();
      setDemoData(prev => ({ ...prev, routes: data }));
      return data;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    demoData,
    loading,
    error,
    fetchTrafficData,
    fetchRouteSuggestions,
  };
};

// ============================================================================
// HEALTH CHECK HOOK
// ============================================================================

export const useHealthCheck = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const checkHealth = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const status = await healthAPI.getHealth();
      setHealthStatus(status);
      return status;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  const getServerStats = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const stats = await healthAPI.getStats();
      return stats;
    } catch (err) {
      setError(err.message);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  return {
    healthStatus,
    loading,
    error,
    checkHealth,
    getServerStats,
  };
};

// ============================================================================
// EXPORT ALL HOOKS
// ============================================================================

export default {
  useAuth,
  useTrips,
  useRoutes,
  useEcoStats,
  useTraffic,
  useNotifications,
  useDemoData,
  useHealthCheck,
};
