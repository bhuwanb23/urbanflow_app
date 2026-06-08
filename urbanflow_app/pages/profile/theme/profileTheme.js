import { Dimensions } from 'react-native';

const { width } = Dimensions.get('window');

const lightColors = {
  primary: '#10B981',
  primaryLight: '#34D399',
  primaryDark: '#059669',
  secondary: '#0F172A',
  secondaryLight: '#334155',
  secondaryDark: '#020617',
  accent: '#F59E0B',
  accentLight: '#FBBF24',
  accentDark: '#D97706',
  textPrimary: '#0F172A',
  textSecondary: '#64748B',
  textTertiary: '#94A3B8',
  textInverse: '#FFFFFF',
  background: '#FFFFFF',
  surface: '#FFFFFF',
  surfaceVariant: '#F8FAFC',
  success: '#10B981',
  warning: '#F59E0B',
  error: '#EF4444',
  info: '#3B82F6',
  border: '#E2E8F0',
  borderLight: '#F1F5F9',
  shadow: '#64748B',
  shadowPrimary: '#10B981',
};

const darkColors = {
  primary: '#34D399',
  primaryLight: '#6EE7B7',
  primaryDark: '#10B981',
  secondary: '#F1F5F9',
  secondaryLight: '#CBD5E1',
  secondaryDark: '#94A3B8',
  accent: '#FBBF24',
  accentLight: '#FCD34D',
  accentDark: '#F59E0B',
  textPrimary: '#F1F5F9',
  textSecondary: '#94A3B8',
  textTertiary: '#64748B',
  textInverse: '#0F172A',
  background: '#0F172A',
  surface: '#1E293B',
  surfaceVariant: '#1A2332',
  success: '#34D399',
  warning: '#FBBF24',
  error: '#F87171',
  info: '#60A5FA',
  border: '#334155',
  borderLight: '#1E293B',
  shadow: '#000000',
  shadowPrimary: '#34D399',
};

const shared = {
  typography: {
    fontFamily: { primary: 'Poppins_700Bold', secondary: 'Urbanist_400Regular', mono: 'System' },
    fontSize: {
      xs: Math.max(10, width * 0.025), sm: Math.max(12, width * 0.03),
      base: Math.max(14, width * 0.035), lg: Math.max(16, width * 0.04),
      xl: Math.max(18, width * 0.045), '2xl': Math.max(20, width * 0.05),
      '3xl': Math.max(24, width * 0.06), '4xl': Math.max(28, width * 0.07),
      '5xl': Math.max(32, width * 0.08),
    },
    fontWeight: { light: '300', normal: '400', medium: '500', semibold: '600', bold: '700', extrabold: '800' },
  },
  spacing: { xs: 4, sm: 8, base: 12, md: 16, lg: 20, xl: 24, '2xl': 32, '3xl': 40, '4xl': 48 },
  borderRadius: { sm: 4, base: 8, md: 12, lg: 16, xl: 20, '2xl': 24, '3xl': 32, full: 9999 },
  shadows: {
    sm: { shadowColor: '#000', shadowOffset: { width: 0, height: 1 }, shadowOpacity: 0.05, shadowRadius: 2, elevation: 1 },
    md: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.05, shadowRadius: 8, elevation: 2 },
    lg: { shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 12, elevation: 4 },
    primary: { shadowColor: '#10B981', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.2, shadowRadius: 8, elevation: 4 },
  },
  gradients: {
    primary: ['#10B981', '#059669'], secondary: ['#0F172A', '#1E293B'],
    accent: ['#F59E0B', '#FBBF24'], surface: ['#FFFFFF', '#F8FAFC'],
  },
  animation: { duration: { fast: 200, normal: 300, slow: 500, slower: 800 } },
};

export const profileTheme = { ...shared, colors: lightColors };

export function createProfileTheme(isDark) {
  return { ...shared, colors: isDark ? darkColors : lightColors };
}

export default profileTheme;
