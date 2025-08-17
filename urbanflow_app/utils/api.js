import AsyncStorage from '@react-native-async-storage/async-storage';

// API Configuration
const API_CONFIG = {
  BASE_URL: 'http://192.168.31.67:3000',
  VERSION: 'v1',
  TIMEOUT: 10000,
};

// Storage Keys
const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
};

// Helper function to get API URL
const getApiUrl = (endpoint) => {
  return `${API_CONFIG.BASE_URL}/api/${API_CONFIG.VERSION}${endpoint}`;
};

// Helper function to get auth token
const getAuthToken = async () => {
  try {
    return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
  } catch (error) {
    console.error('Error getting auth token:', error);
    return null;
  }
};

// Base API call function
const apiCall = async (endpoint, options = {}) => {
  try {
    const token = await getAuthToken();
    const url = getApiUrl(endpoint);
    
    const defaultHeaders = {
      'Content-Type': 'application/json',
    };

    if (token) {
      defaultHeaders['Authorization'] = `Bearer ${token}`;
    }

    const response = await fetch(url, {
      ...options,
      headers: {
        ...defaultHeaders,
        ...options.headers,
      },
    });

    const data = await response.json();

    // Handle authentication errors
    if (response.status === 401 || response.status === 403) {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
      throw new Error('Session expired. Please login again.');
    }

    if (!response.ok) {
      throw new Error(data.message || `API call failed: ${response.status}`);
    }

    return data;
  } catch (error) {
    console.error(`API call error for ${endpoint}:`, error);
    throw error;
  }
};

// ============================================================================
// AUTHENTICATION API
// ============================================================================

export const authAPI = {
  // Register new user
  register: async (userData) => {
    return await apiCall('/auth/register', {
      method: 'POST',
      body: JSON.stringify(userData),
    });
  },

  // Login user
  login: async (credentials) => {
    return await apiCall('/auth/login', {
      method: 'POST',
      body: JSON.stringify(credentials),
    });
  },

  // Verify token
  verifyToken: async () => {
    return await apiCall('/auth/verify');
  },

  // Logout
  logout: async () => {
    return await apiCall('/auth/logout', {
      method: 'POST',
    });
  },
};

// ============================================================================
// USER PROFILE API
// ============================================================================

export const userAPI = {
  // Get user profile
  getProfile: async () => {
    return await apiCall('/user/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await apiCall('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// ============================================================================
// TRIPS API
// ============================================================================

export const tripsAPI = {
  // Get all user trips
  getTrips: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/trips?${queryString}` : '/trips';
    return await apiCall(endpoint);
  },

  // Get trip by ID
  getTrip: async (tripId) => {
    return await apiCall(`/trips/${tripId}`);
  },

  // Create new trip
  createTrip: async (tripData) => {
    return await apiCall('/trips', {
      method: 'POST',
      body: JSON.stringify(tripData),
    });
  },

  // Update trip
  updateTrip: async (tripId, tripData) => {
    return await apiCall(`/trips/${tripId}`, {
      method: 'PUT',
      body: JSON.stringify(tripData),
    });
  },

  // Delete trip
  deleteTrip: async (tripId) => {
    return await apiCall(`/trips/${tripId}`, {
      method: 'DELETE',
    });
  },

  // Get trip statistics
  getTripStats: async () => {
    return await apiCall('/trips/stats');
  },
};

// ============================================================================
// ROUTES API
// ============================================================================

export const routesAPI = {
  // Get all user routes
  getRoutes: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/routes?${queryString}` : '/routes';
    return await apiCall(endpoint);
  },

  // Get route by ID
  getRoute: async (routeId) => {
    return await apiCall(`/routes/${routeId}`);
  },

  // Create new route
  createRoute: async (routeData) => {
    return await apiCall('/routes', {
      method: 'POST',
      body: JSON.stringify(routeData),
    });
  },

  // Update route
  updateRoute: async (routeId, routeData) => {
    return await apiCall(`/routes/${routeId}`, {
      method: 'PUT',
      body: JSON.stringify(routeData),
    });
  },

  // Delete route
  deleteRoute: async (routeId) => {
    return await apiCall(`/routes/${routeId}`, {
      method: 'DELETE',
    });
  },

  // Search routes
  searchRoutes: async (searchParams) => {
    const queryString = new URLSearchParams(searchParams).toString();
    return await apiCall(`/routes/search?${queryString}`);
  },

  // Get popular routes
  getPopularRoutes: async () => {
    return await apiCall('/routes/popular');
  },
};

// ============================================================================
// ECO STATS API
// ============================================================================

export const ecoStatsAPI = {
  // Get user eco stats
  getEcoStats: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/ecostats?${queryString}` : '/ecostats';
    return await apiCall(endpoint);
  },

  // Get weekly stats
  getWeeklyStats: async () => {
    return await apiCall('/ecostats/weekly');
  },

  // Get monthly stats
  getMonthlyStats: async () => {
    return await apiCall('/ecostats/monthly');
  },

  // Get yearly stats
  getYearlyStats: async () => {
    return await apiCall('/ecostats/yearly');
  },

  // Get eco achievements
  getAchievements: async () => {
    return await apiCall('/ecostats/achievements');
  },

  // Get carbon footprint summary
  getCarbonFootprint: async () => {
    return await apiCall('/ecostats/carbon-footprint');
  },
};

// ============================================================================
// TRAFFIC API
// ============================================================================

export const trafficAPI = {
  // Get live traffic data
  getLiveTraffic: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/traffic?${queryString}` : '/traffic';
    return await apiCall(endpoint);
  },

  // Get traffic conditions for specific area
  getTrafficConditions: async (area) => {
    return await apiCall(`/traffic/conditions?area=${encodeURIComponent(area)}`);
  },

  // Get traffic alerts
  getTrafficAlerts: async () => {
    return await apiCall('/traffic/alerts');
  },

  // Get traffic predictions
  getTrafficPredictions: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    return await apiCall(`/traffic/predictions?${queryString}`);
  },
};

// ============================================================================
// NOTIFICATIONS API
// ============================================================================

export const notificationsAPI = {
  // Get user notifications
  getNotifications: async (params = {}) => {
    const queryString = new URLSearchParams(params).toString();
    const endpoint = queryString ? `/notifications?${queryString}` : '/notifications';
    return await apiCall(endpoint);
  },

  // Get notification by ID
  getNotification: async (notificationId) => {
    return await apiCall(`/notifications/${notificationId}`);
  },

  // Mark notification as read
  markAsRead: async (notificationId) => {
    return await apiCall(`/notifications/${notificationId}/read`, {
      method: 'PUT',
    });
  },

  // Mark all notifications as read
  markAllAsRead: async () => {
    return await apiCall('/notifications/read-all', {
      method: 'PUT',
    });
  },

  // Delete notification
  deleteNotification: async (notificationId) => {
    return await apiCall(`/notifications/${notificationId}`, {
      method: 'DELETE',
    });
  },

  // Get notification settings
  getSettings: async () => {
    return await apiCall('/notifications/settings');
  },

  // Update notification settings
  updateSettings: async (settings) => {
    return await apiCall('/notifications/settings', {
      method: 'PUT',
      body: JSON.stringify(settings),
    });
  },
};

// ============================================================================
// DEMO DATA API (for backward compatibility)
// ============================================================================

export const demoAPI = {
  // Get demo traffic data
  getTrafficData: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/demo/traffic`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch traffic data');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get demo route suggestions
  getRouteSuggestions: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/demo/routes`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch route suggestions');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// HEALTH & STATUS API
// ============================================================================

export const healthAPI = {
  // Get server health status
  getHealth: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/health`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Health check failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get server statistics
  getStats: async () => {
    try {
      const response = await fetch(`${API_CONFIG.BASE_URL}/api/stats`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch server stats');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};

// ============================================================================
// TOKEN MANAGEMENT
// ============================================================================

export const tokenManager = {
  // Store token and user data
  storeAuthData: async (token, userData) => {
    try {
      await AsyncStorage.setItem(STORAGE_KEYS.USER_TOKEN, token);
      await AsyncStorage.setItem(STORAGE_KEYS.USER_DATA, JSON.stringify(userData));
    } catch (error) {
      console.error('Error storing auth data:', error);
      throw error;
    }
  },

  // Get stored token
  getToken: async () => {
    return await getAuthToken();
  },

  // Get stored user data
  getUserData: async () => {
    try {
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return userData ? JSON.parse(userData) : null;
    } catch (error) {
      console.error('Error getting user data:', error);
      return null;
    }
  },

  // Clear stored auth data
  clearAuthData: async () => {
    try {
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_TOKEN);
      await AsyncStorage.removeItem(STORAGE_KEYS.USER_DATA);
    } catch (error) {
      console.error('Error clearing auth data:', error);
      throw error;
    }
  },

  // Check if user is logged in
  isLoggedIn: async () => {
    try {
      const token = await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
      const userData = await AsyncStorage.getItem(STORAGE_KEYS.USER_DATA);
      return !!(token && userData);
    } catch (error) {
      console.error('Error checking login status:', error);
      return false;
    }
  },
};

// ============================================================================
// AUTH FLOW HELPERS
// ============================================================================

export const authFlow = {
  // Complete login process
  login: async (credentials) => {
    try {
      const authData = await authAPI.login(credentials);
      await tokenManager.storeAuthData(authData.token, authData.user);
      return authData;
    } catch (error) {
      throw error;
    }
  },

  // Complete registration process
  register: async (userData) => {
    try {
      const authData = await authAPI.register(userData);
      await tokenManager.storeAuthData(authData.token, authData.user);
      return authData;
    } catch (error) {
      throw error;
    }
  },

  // Complete logout process
  logout: async () => {
    try {
      await authAPI.logout();
      await tokenManager.clearAuthData();
    } catch (error) {
      // Even if logout API fails, clear local data
      await tokenManager.clearAuthData();
      throw error;
    }
  },

  // Check and refresh session
  checkSession: async () => {
    try {
      const token = await tokenManager.getToken();
      if (!token) {
        return false;
      }

      const userData = await authAPI.verifyToken();
      return userData;
    } catch (error) {
      // Token is invalid, clear stored data
      await tokenManager.clearAuthData();
      return false;
    }
  },
};

// ============================================================================
// EXPORT ALL APIs
// ============================================================================

export default {
  // API modules
  authAPI,
  userAPI,
  tripsAPI,
  routesAPI,
  ecoStatsAPI,
  trafficAPI,
  notificationsAPI,
  demoAPI,
  healthAPI,
  
  // Utilities
  tokenManager,
  authFlow,
  
  // Configuration
  API_CONFIG,
};
