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

  const { duration, arrivalTime, from, to } = routeData;

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
});
