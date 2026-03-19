import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { routeTheme } from '../theme/routeTheme';

/**
 * JourneyOverview Component
 * Displays route duration, arrival time, and basic info
 */
export default function JourneyOverview({ routeData }) {
  if (!routeData) return null;

  const { duration, arrivalTime, from, to, distance, ecoScore, cost } = routeData;

  return (
    <View style={styles.container} accessibilityRole="header">
      <Text 
        style={styles.title}
        accessibilityLabel={`Route from ${from} to ${to}`}
      >
        UrbanFlow
      </Text>
      
      <View style={styles.infoRow}>
        <Icon name="clock-outline" size={16} color={routeTheme.colors.onSurfaceVariant} />
        <Text style={styles.infoText}>
          {duration} • Arriving {arrivalTime}
        </Text>
      </View>

      {/* Enhanced Route Stats */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: routeTheme.colors.primaryFixed }]}>
            <Icon name="map-marker-distance" size={18} color={routeTheme.colors.onPrimaryFixed} />
          </View>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{distance}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: routeTheme.colors.secondaryFixed }]}>
            <Icon name="cash-multiple" size={18} color={routeTheme.colors.onSecondaryFixed} />
          </View>
          <Text style={styles.statLabel}>Cost</Text>
          <Text style={styles.statValue}>{cost}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: '#DCFCE7' }]}>
            <Icon name="leaf-circle" size={18} color="#10B981" />
          </View>
          <Text style={styles.statLabel}>Eco Score</Text>
          <Text style={[styles.statValue, { color: '#10B981' }]}>{ecoScore}/10</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: routeTheme.spacing.xl,
  },
  title: {
    fontSize: routeTheme.typography.fontSize['3xl'],
    fontWeight: routeTheme.typography.fontWeight.extrabold,
    color: routeTheme.colors.primary,
    fontFamily: routeTheme.typography.fontFamily.headline,
    marginBottom: routeTheme.spacing.sm,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: routeTheme.spacing.sm,
  },
  infoText: {
    fontSize: routeTheme.typography.fontSize.base,
    color: routeTheme.colors.onSurfaceVariant,
    fontFamily: routeTheme.typography.fontFamily.label,
    fontWeight: routeTheme.typography.fontWeight.semibold,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: routeTheme.colors.surfaceContainerLow,
    borderRadius: routeTheme.borderRadius.lg,
    padding: routeTheme.spacing.md,
    marginTop: routeTheme.spacing.md,
    borderWidth: 1,
    borderColor: routeTheme.colors.outlineVariant,
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
    gap: routeTheme.spacing.xs,
  },
  statIcon: {
    width: 40,
    height: 40,
    borderRadius: routeTheme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statLabel: {
    fontSize: routeTheme.typography.fontSize.xs,
    color: routeTheme.colors.onSurfaceVariant,
    fontFamily: routeTheme.typography.fontFamily.label,
    fontWeight: routeTheme.typography.fontWeight.medium,
  },
  statValue: {
    fontSize: routeTheme.typography.fontSize.sm,
    color: routeTheme.colors.onSurface,
    fontFamily: routeTheme.typography.fontFamily.headline,
    fontWeight: routeTheme.typography.fontWeight.bold,
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: routeTheme.colors.outlineVariant,
    marginHorizontal: routeTheme.spacing.xs,
  },
});
