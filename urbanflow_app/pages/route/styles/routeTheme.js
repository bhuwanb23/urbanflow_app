import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const routeTheme = {
  colors: {
    // Primary colors (Emerald Green Theme)
    primary: '#10B981',
    primaryLight: '#34D399',
    primaryDark: '#059669',
    
    // Secondary colors (Slate for modern contrast)
    secondary: '#0F172A',
    secondaryLight: '#334155',
    secondaryDark: '#020617',
    
    // Accent colors
    accent: '#F59E0B',
    accentLight: '#FBBF24',
    accentDark: '#D97706',
    
    // Semantic colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',

    // Text colors
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    
    // Background colors
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F8FAFC',
    
    // Border colors
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
  },
  
  typography: {
    fontFamily: {
      primary: 'Poppins_700Bold',
      secondary: 'Urbanist_400Regular',
      mono: 'System',
    },
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    base: 12,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
  },
  
  borderRadius: {
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    full: 9999,
  },
  
  shadows: {
    sm: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.05,
      shadowRadius: 8,
      elevation: 2,
    },
  }
};
