import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const notificationTheme = {
  colors: {
    // Green theme - matching UrbanFlow brand
    primary: '#10B981', // Emerald 500
    primaryDark: '#047857', // Emerald 700
    primaryLight: '#34D399', // Emerald 400
    secondary: '#059669', // Emerald 600
    accent: '#6EE7B7', // Emerald 300
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Background colors
    background: '#F0FDF4', // Emerald 50
    surface: '#ffffff',
    surfaceVariant: '#ECFDF5', // Emerald 50
    
    // Text colors
    textPrimary: '#064e3b', // Emerald 900
    textSecondary: '#047857', // Emerald 700
    textTertiary: '#6B7280',
    textInverse: '#ffffff',
    
    // Status colors (green-themed)
    traffic: '#ef4444',
    route: '#10B981',
    transit: '#059669',
    bike: '#f59e0b',
    parking: '#047857',
    
    // Border colors
    border: '#A7F3D0', // Emerald 300
    borderLight: '#D1FAE5', // Emerald 100
    
    // Shadow colors
    shadowPrimary: '#10B981',
    shadowSecondary: '#000000',
  },
  
  typography: {
    fontFamily: {
      primary: 'Poppins_700Bold',
      secondary: 'Urbanist_400Regular',
      tertiary: 'Montserrat_700Bold',
    },
    
    fontSize: {
      xs: Math.max(10, width * 0.025),
      sm: Math.max(12, width * 0.03),
      base: Math.max(14, width * 0.035),
      lg: Math.max(16, width * 0.04),
      xl: Math.max(18, width * 0.045),
      '2xl': Math.max(20, width * 0.05),
      '3xl': Math.max(24, width * 0.06),
      '4xl': Math.max(28, width * 0.07),
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
    },
    
    fontWeight: {
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
    },
  },
  
  spacing: {
    xs: Math.max(4, height * 0.005),
    sm: Math.max(8, height * 0.01),
    md: Math.max(12, height * 0.015),
    lg: Math.max(16, height * 0.02),
    xl: Math.max(20, height * 0.025),
    '2xl': Math.max(24, height * 0.03),
    '3xl': Math.max(32, height * 0.04),
    '4xl': Math.max(48, height * 0.06),
    '5xl': Math.max(60, height * 0.08),
  },
  
  borderRadius: {
    none: 0,
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
    full: 999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 3,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 6 },
      shadowOpacity: 0.2,
      shadowRadius: 12,
      elevation: 8,
    },
    primary: {
      shadowColor: '#6366f1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  
  gradients: {
    primary: ['#10B981', '#059669', '#047857'], // Green gradient
    secondary: ['#34D399', '#10B981'], // Light green to emerald
    accent: ['#6EE7B7', '#34D399'], // Mint to green
  },
  
  animation: {
    duration: {
      fast: 300,
      normal: 500,
      slow: 700,
    },
    easing: {
      ease: 'ease',
      linear: 'linear',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  
  responsive: {
    width: (percentage) => Math.max(width * percentage, 20),
    height: (percentage) => Math.max(height * percentage, 20),
    fontSize: (base, percentage) => Math.max(base, width * percentage),
    spacing: (base, percentage) => Math.max(base, height * percentage),
  },
};

export default notificationTheme;
