import { Dimensions } from 'react-native';

const { width, height } = Dimensions.get('window');

export const profileTheme = {
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
    
    // Text colors
    textPrimary: '#0F172A',
    textSecondary: '#64748B',
    textTertiary: '#94A3B8',
    textInverse: '#FFFFFF',
    
    // Background colors
    background: '#FFFFFF',
    surface: '#FFFFFF',
    surfaceVariant: '#F8FAFC',
    
    // Status colors
    success: '#10B981',
    warning: '#F59E0B',
    error: '#EF4444',
    info: '#3B82F6',
    
    // Border colors
    border: '#E2E8F0',
    borderLight: '#F1F5F9',
    
    // Shadow colors
    shadow: '#64748B',
    shadowPrimary: '#10B981',
  },
  
  typography: {
    fontFamily: {
      primary: 'Poppins_700Bold',
      secondary: 'Urbanist_400Regular',
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
  },
  
  spacing: {
    xs: 4,
    sm: 8,
    base: 12,
    md: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
  },
  
  borderRadius: {
    sm: 4,
    base: 8,
    md: 12,
    lg: 16,
    xl: 20,
    '2xl': 24,
    '3xl': 32,
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
    lg: {
      shadowColor: '#64748B',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.08,
      shadowRadius: 12,
      elevation: 4,
    },
    primary: {
      shadowColor: '#10B981',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
      elevation: 4,
    },
  },
  
  gradients: {
    primary: ['#10B981', '#059669'],
    secondary: ['#0F172A', '#1E293B'],
    accent: ['#F59E0B', '#FBBF24'],
    surface: ['#FFFFFF', '#F8FAFC'],
  },
  
  animation: {
    duration: {
      fast: 200,
      normal: 300,
      slow: 500,
      slower: 800,
    },
  },
};

export default profileTheme;