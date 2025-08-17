import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const profileTheme = {
  colors: {
    // Primary colors
    primary: '#6366f1',
    primaryLight: '#8b5cf6',
    primaryDark: '#4f46e5',
    
    // Secondary colors
    secondary: '#10b981',
    secondaryLight: '#34d399',
    secondaryDark: '#059669',
    
    // Accent colors
    accent: '#f59e0b',
    accentLight: '#fbbf24',
    accentDark: '#d97706',
    
    // Text colors
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    textTertiary: '#9ca3af',
    textInverse: '#ffffff',
    
    // Background colors
    background: '#f8fafc',
    surface: '#ffffff',
    surfaceVariant: '#f1f5f9',
    
    // Status colors
    success: '#22c55e',
    warning: '#f59e0b',
    error: '#ef4444',
    info: '#3b82f6',
    
    // Border colors
    border: '#e2e8f0',
    borderLight: '#f1f5f9',
    
    // Shadow colors
    shadow: '#000000',
    shadowPrimary: '#6366f1',
  },
  
  typography: {
    fontFamily: {
      // Primary font for headings and important text
      primary: 'System',
      // Secondary font for body text and descriptions
      secondary: 'System',
      // Monospace font for technical information
      mono: 'System',
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
      '5xl': Math.max(32, width * 0.08),
    },
    
    fontWeight: {
      light: '300',
      normal: '400',
      medium: '500',
      semibold: '600',
      bold: '700',
      extrabold: '800',
    },
    
    lineHeight: {
      tight: 1.2,
      normal: 1.4,
      relaxed: 1.6,
      loose: 1.8,
    },
  },
  
  spacing: {
    xs: Math.max(4, height * 0.005),
    sm: Math.max(8, height * 0.01),
    base: Math.max(12, height * 0.015),
    md: Math.max(16, height * 0.02),
    lg: Math.max(20, height * 0.025),
    xl: Math.max(24, height * 0.03),
    '2xl': Math.max(32, height * 0.04),
    '3xl': Math.max(40, height * 0.05),
    '4xl': Math.max(48, height * 0.06),
  },
  
  borderRadius: {
    sm: Math.max(4, width * 0.01),
    base: Math.max(8, width * 0.02),
    md: Math.max(12, width * 0.03),
    lg: Math.max(16, width * 0.04),
    xl: Math.max(20, width * 0.05),
    '2xl': Math.max(24, width * 0.06),
    '3xl': Math.max(32, width * 0.08),
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.15,
      shadowRadius: 8,
      elevation: 4,
    },
    xl: {
      shadowColor: '#000000',
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.2,
      shadowRadius: 16,
      elevation: 8,
    },
    primary: {
      shadowColor: '#6366f1',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.25,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  
  gradients: {
    primary: ['#6366f1', '#8b5cf6'],
    secondary: ['#10b981', '#34d399'],
    accent: ['#f59e0b', '#fbbf24'],
    surface: ['#ffffff', '#f8fafc'],
  },
  
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
      slower: 800,
    },
    easing: {
      ease: 'ease',
      easeIn: 'ease-in',
      easeOut: 'ease-out',
      easeInOut: 'ease-in-out',
    },
  },
  
  responsive: {
    width,
    height,
    isSmallDevice: width < 375,
    isMediumDevice: width >= 375 && width < 414,
    isLargeDevice: width >= 414,
  },
};

export default profileTheme;
