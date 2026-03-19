import { StyleSheet } from 'react-native';
import { routeTheme } from '../theme/routeTheme';

/**
 * Global Route Styles
 * Reusable styles for all route components
 */

// Common card styles
export const cardStyles = StyleSheet.create({
  base: {
    backgroundColor: routeTheme.colors.surfaceContainerLowest,
    borderRadius: routeTheme.borderRadius['2xl'],
    padding: routeTheme.spacing.lg,
    borderWidth: 0.5,
    borderColor: routeTheme.colors.outlineVariant,
    ...routeTheme.shadows.sm,
  },
  interactive: {
    backgroundColor: routeTheme.colors.surfaceBright,
  },
  elevated: {
    ...routeTheme.shadows.md,
  },
});

// Icon container styles
export const iconStyles = StyleSheet.create({
  base: {
    width: 48,
    height: 48,
    borderRadius: routeTheme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...routeTheme.shadows.sm,
  },
  small: {
    width: 32,
    height: 32,
  },
  large: {
    width: 64,
    height: 64,
  },
});

// Badge styles
export const badgeStyles = StyleSheet.create({
  base: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: routeTheme.borderRadius.full,
  },
  status: {
    fontSize: routeTheme.typography.fontSize.xs,
    fontWeight: routeTheme.typography.fontWeight.semibold,
    fontFamily: routeTheme.typography.fontFamily.label,
  },
  success: {
    backgroundColor: routeTheme.colors.secondaryContainer,
    color: routeTheme.colors.onSecondaryContainer,
  },
  warning: {
    backgroundColor: routeTheme.colors.errorContainer,
    color: routeTheme.colors.onErrorContainer,
  },
  info: {
    backgroundColor: routeTheme.colors.primaryFixed,
    color: routeTheme.colors.onPrimaryFixed,
  },
});

// Typography styles
export const textStyles = StyleSheet.create({
  headline: {
    fontSize: routeTheme.typography.fontSize['3xl'],
    fontWeight: routeTheme.typography.fontWeight.extrabold,
    fontFamily: routeTheme.typography.fontFamily.headline,
    color: routeTheme.colors.onSurface,
  },
  title: {
    fontSize: routeTheme.typography.fontSize.xl,
    fontWeight: routeTheme.typography.fontWeight.bold,
    fontFamily: routeTheme.typography.fontFamily.headline,
    color: routeTheme.colors.onSurface,
  },
  body: {
    fontSize: routeTheme.typography.fontSize.base,
    fontWeight: routeTheme.typography.fontWeight.normal,
    fontFamily: routeTheme.typography.fontFamily.body,
    color: routeTheme.colors.onSurface,
  },
  label: {
    fontSize: routeTheme.typography.fontSize.sm,
    fontWeight: routeTheme.typography.fontWeight.medium,
    fontFamily: routeTheme.typography.fontFamily.label,
    color: routeTheme.colors.onSurfaceVariant,
  },
  caption: {
    fontSize: routeTheme.typography.fontSize.xs,
    fontWeight: routeTheme.typography.fontWeight.medium,
    fontFamily: routeTheme.typography.fontFamily.label,
    color: routeTheme.colors.onSurfaceVariant,
  },
});

// Layout spacing styles
export const spacingStyles = StyleSheet.create({
  section: {
    marginBottom: routeTheme.spacing['2xl'],
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  column: {
    flexDirection: 'column',
  },
  gapSM: {
    gap: routeTheme.spacing.sm,
  },
  gapMD: {
    gap: routeTheme.spacing.md,
  },
  gapLG: {
    gap: routeTheme.spacing.lg,
  },
});

// Animation helper styles
export const animationStyles = StyleSheet.create({
  fadeIn: {
    opacity: 0,
  },
  slideUp: {
    transform: [{ translateY: 20 }],
  },
  pulse: {
    transform: [{ scale: 1 }],
  },
});

export default {
  card: cardStyles,
  icon: iconStyles,
  badge: badgeStyles,
  text: textStyles,
  spacing: spacingStyles,
  animation: animationStyles,
};
