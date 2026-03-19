import { StyleSheet } from 'react-native';
import { routeTheme } from '../theme/routeTheme';

/**
 * Component-Specific Styles
 * Dynamic style functions for reusable component styling
 */

/**
 * Get segment card styles based on transport mode
 */
export const getSegmentCardStyle = (transportMode) => {
  const modeColors = {
    walk: {
      bg: routeTheme.colors.primaryFixed,
      iconBg: routeTheme.colors.onPrimaryFixed,
    },
    bus: {
      bg: routeTheme.colors.secondaryFixed,
      iconBg: routeTheme.colors.onSecondaryFixed,
    },
    metro: {
      bg: routeTheme.colors.primaryContainer,
      iconBg: routeTheme.colors.onPrimary,
    },
    bike: {
      bg: routeTheme.colors.secondaryFixedDim,
      iconBg: routeTheme.colors.onSecondaryFixed,
    },
  };

  const colors = modeColors[transportMode] || modeColors.walk;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.bg,
    },
    icon: {
      backgroundColor: colors.iconBg,
    },
  });
};

/**
 * Get status badge styles based on status
 */
export const getStatusBadgeStyle = (status) => {
  const statusColors = {
    'on-time': {
      bg: routeTheme.colors.secondaryContainer,
      text: routeTheme.colors.onSecondaryContainer,
    },
    delayed: {
      bg: routeTheme.colors.errorContainer,
      text: routeTheme.colors.onErrorContainer,
    },
    cancelled: {
      bg: routeTheme.colors.error,
      text: routeTheme.colors.onError,
    },
    available: {
      bg: routeTheme.colors.secondaryContainer,
      text: routeTheme.colors.onSecondaryContainer,
    },
  };

  const colors = statusColors[status] || statusColors['on-time'];

  return StyleSheet.create({
    badge: {
      backgroundColor: colors.bg,
    },
    text: {
      color: colors.text,
    },
  });
};

/**
 * Get occupancy indicator styles
 */
export const getOccupancyStyle = (level) => {
  const occupancyColors = {
    low: {
      bg: routeTheme.colors.secondaryContainer,
      text: routeTheme.colors.onSecondaryContainer,
    },
    medium: {
      bg: routeTheme.colors.tertiaryContainer,
      text: routeTheme.colors.onTertiaryContainer,
    },
    high: {
      bg: routeTheme.colors.errorContainer,
      text: routeTheme.colors.onErrorContainer,
    },
  };

  const colors = occupancyColors[level] || occupancyColors.low;

  return StyleSheet.create({
    container: {
      backgroundColor: colors.bg,
    },
    text: {
      color: colors.text,
    },
  });
};

/**
 * Get map preview overlay gradient
 */
export const getMapOverlayStyle = () => {
  return StyleSheet.create({
    overlay: {
      backgroundColor: 'rgba(0, 0, 0, 0.1)',
    },
    badge: {
      backgroundColor: 'rgba(255, 255, 255, 0.95)',
      shadowColor: routeTheme.colors.shadow,
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.1,
      shadowRadius: 4,
      elevation: 2,
    },
  });
};

/**
 * Responsive spacing for different screen sizes
 */
export const getResponsiveSpacing = (screenWidth) => {
  const isSmall = screenWidth < 375;
  const isLarge = screenWidth > 414;

  return {
    paddingHorizontal: isSmall ? 16 : isLarge ? 32 : 24,
    paddingVertical: isSmall ? 12 : isLarge ? 20 : 16,
    marginBottom: isSmall ? 16 : isLarge ? 28 : 24,
  };
};

/**
 * Dark mode variant styles
 */
export const getDarkModeStyles = (isDark) => {
  if (!isDark) return {};

  return StyleSheet.create({
    container: {
      backgroundColor: routeTheme.colors.surfaceDim,
    },
    card: {
      backgroundColor: routeTheme.colors.surfaceContainer,
      borderColor: routeTheme.colors.outline,
    },
  });
};

/**
 * Accessibility-focused styles (higher contrast, larger touch targets)
 */
export const getAccessibilityStyles = () => {
  return StyleSheet.create({
    touchTarget: {
      minHeight: 44,
      minWidth: 44,
      borderRadius: routeTheme.borderRadius.full,
    },
    highContrastBorder: {
      borderWidth: 2,
      borderColor: routeTheme.colors.inversePrimary,
    },
    largeText: {
      fontSize: routeTheme.typography.fontSize.lg,
    },
  });
};

export default {
  getSegmentCardStyle,
  getStatusBadgeStyle,
  getOccupancyStyle,
  getMapOverlayStyle,
  getResponsiveSpacing,
  getDarkModeStyles,
  getAccessibilityStyles,
};
