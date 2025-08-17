import AsyncStorage from '@react-native-async-storage/async-storage';

// API Base URL
const API_BASE_URL = 'http://192.168.31.67:3000/api';

// Storage Keys
const STORAGE_KEYS = {
  USER_TOKEN: 'userToken',
  USER_DATA: 'userData',
};

// Auth API calls
export const authAPI = {
  // Register new user
  register: async (userData) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(userData),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Registration failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Login user
  login: async (credentials) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Login failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Verify token
  verifyToken: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Token verification failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Logout
  logout: async (token) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/logout`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Logout failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },
};

// Token management
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
    try {
      return await AsyncStorage.getItem(STORAGE_KEYS.USER_TOKEN);
    } catch (error) {
      console.error('Error getting token:', error);
      return null;
    }
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

// Authenticated API calls
export const authenticatedAPI = {
  // Make authenticated API call
  call: async (endpoint, options = {}) => {
    try {
      const token = await tokenManager.getToken();
      
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        ...options,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
          ...options.headers,
        },
      });

      const data = await response.json();

      // Handle token expiration
      if (response.status === 401 || response.status === 403) {
        await tokenManager.clearAuthData();
        throw new Error('Session expired. Please login again.');
      }

      if (!response.ok) {
        throw new Error(data.message || 'API call failed');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get user profile
  getProfile: async () => {
    return await authenticatedAPI.call('/user/profile');
  },

  // Update user profile
  updateProfile: async (profileData) => {
    return await authenticatedAPI.call('/user/profile', {
      method: 'PUT',
      body: JSON.stringify(profileData),
    });
  },
};

// Demo data API calls
export const demoAPI = {
  // Get traffic data
  getTrafficData: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/traffic`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch traffic data');
      }

      return data;
    } catch (error) {
      throw error;
    }
  },

  // Get route suggestions
  getRouteSuggestions: async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/demo/routes`);
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

// Auth flow helpers
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
      const token = await tokenManager.getToken();
      if (token) {
        await authAPI.logout(token);
      }
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

      const userData = await authAPI.verifyToken(token);
      return userData;
    } catch (error) {
      // Token is invalid, clear stored data
      await tokenManager.clearAuthData();
      return false;
    }
  },
};

export default {
  authAPI,
  tokenManager,
  authenticatedAPI,
  demoAPI,
  authFlow,
}; 