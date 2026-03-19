/**
 * Route Theme Configuration
 * Based on the new route.html design with green primary colors
 */

export const routeTheme = {
  colors: {
    // Primary colors (Green Theme from HTML)
    primary: '#006b2c',
    onPrimary: '#ffffff',
    primaryContainer: '#00873a',
    onPrimaryContainer: '#f7fff2',
    primaryFixed: '#7ffc97',
    primaryFixedDim: '#62df7d',
    onPrimaryFixed: '#002109',
    onPrimaryFixedVariant: '#005320',
    
    // Secondary colors
    secondary: '#31694b',
    onSecondary: '#ffffff',
    secondaryContainer: '#b4f0c9',
    onSecondaryContainer: '#386f50',
    secondaryFixed: '#b4f0c9',
    secondaryFixedDim: '#99d4ae',
    onSecondaryFixed: '#002111',
    onSecondaryFixedVariant: '#175034',
    
    // Tertiary colors
    tertiary: '#a72d51',
    onTertiary: '#ffffff',
    tertiaryContainer: '#c74668',
    onTertiaryContainer: '#fffbff',
    tertiaryFixed: '#ffd9de',
    tertiaryFixedDim: '#ffb2bf',
    onTertiaryFixed: '#3f0016',
    onTertiaryFixedVariant: '#8a143c',
    
    // Error colors
    error: '#ba1a1a',
    onError: '#ffffff',
    errorContainer: '#ffdad6',
    onErrorContainer: '#93000a',
    
    // Background and Surface colors
    background: '#f8f9fa',
    onBackground: '#191c1d',
    surface: '#f8f9fa',
    onSurface: '#191c1d',
    surfaceContainer: '#edeeef',
    surfaceContainerLow: '#f3f4f5',
    surfaceContainerHigh: '#e7e8e9',
    surfaceContainerHighest: '#e1e3e4',
    surfaceDim: '#d9dadb',
    surfaceBright: '#f8f9fa',
    surfaceVariant: '#e1e3e4',
    onSurfaceVariant: '#3e4a3d',
    
    // Outline colors
    outline: '#6e7b6c',
    outlineVariant: '#bdcaba',
    
    // Inverse colors
    inversePrimary: '#62df7d',
    inverseSurface: '#2e3132',
    inverseOnSurface: '#f0f1f2',
    
    // Additional colors
    shadow: '#000000',
    scrim: 'rgba(0, 0, 0, 0.25)',
  },
  
  typography: {
    fontFamily: {
      headline: 'Manrope_800ExtraBold',
      body: 'Manrope_400Regular',
      label: 'Inter_400Regular',
    },
    fontSize: {
      xs: 10,
      sm: 12,
      base: 14,
      lg: 16,
      xl: 18,
      '2xl': 24,
      '3xl': 32,
    },
    fontWeight: {
      normal: 400,
      medium: 500,
      semibold: 600,
      bold: 700,
      extrabold: 800,
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
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 1 },
      shadowOpacity: 0.05,
      shadowRadius: 2,
      elevation: 1,
    },
    md: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.08,
      shadowRadius: 4,
      elevation: 2,
    },
    lg: {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.1,
      shadowRadius: 8,
      elevation: 4,
    },
  },
};
