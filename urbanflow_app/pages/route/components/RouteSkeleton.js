import React from 'react';
import { View, StyleSheet } from 'react-native';
import { routeTheme } from '../theme/routeTheme';

/**
 * RouteSkeleton Component
 * Loading skeleton for route details screen
 */
export default function RouteSkeleton({ segmentCount = 3 }) {
  return (
    <View style={styles.container}>
      {/* Header Skeleton */}
      <View style={styles.headerSkeleton}>
        <View style={[styles.skeletonBlock, { width: 150, height: 32 }]} />
        <View style={[styles.skeletonBlock, { width: 200, height: 20, marginTop: 8 }]} />
      </View>

      {/* Segment Skeletons */}
      {[...Array(segmentCount)].map((_, index) => (
        <View key={index} style={styles.segmentSkeleton}>
          <View style={[styles.skeletonIcon, { borderRadius: 24 }]} />
          <View style={styles.skeletonCard}>
            <View style={[styles.skeletonBlock, { width: '60%', height: 18 }]} />
            <View style={[styles.skeletonBlock, { width: '40%', height: 14, marginTop: 8 }]} />
            <View style={[styles.skeletonBlock, { width: '30%', height: 12, marginTop: 8 }]} />
          </View>
        </View>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: routeTheme.spacing.xl,
  },
  headerSkeleton: {
    marginBottom: routeTheme.spacing['2xl'],
  },
  segmentSkeleton: {
    flexDirection: 'row',
    gap: routeTheme.spacing.md,
    marginBottom: routeTheme.spacing.xl,
  },
  skeletonIcon: {
    width: 48,
    height: 48,
    backgroundColor: routeTheme.colors.surfaceContainerHigh,
  },
  skeletonCard: {
    flex: 1,
    backgroundColor: routeTheme.colors.surfaceContainerLowest,
    borderRadius: routeTheme.borderRadius['2xl'],
    padding: routeTheme.spacing.lg,
  },
  skeletonBlock: {
    backgroundColor: routeTheme.colors.surfaceContainerHigh,
    borderRadius: routeTheme.borderRadius.sm,
  },
});
