import React, { _useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { routeTheme } from '../theme/routeTheme';

/**
 * JourneyOverview Component
 * Displays route duration, arrival time, and basic info
 * Updated for Phase 2 - displays carbon score, fare in INR, distance
 */
export default function JourneyOverview({ routeData }) {
  if (!routeData) return null;

  // Extract Phase 2 enriched data
  const { 
    duration, 
    arrivalTime, 
    from, 
    to, 
    distance,
    totalDistanceKm,
    ecoScore, 
    cost,
    fare,
    formattedFare,
    carbonSaved,
    formattedCarbonSaved,
    legs = []
  } = routeData;

  // Format values with fallbacks
  const displayDuration = duration || `${Math.round((routeData.durationMinutes || 0))} min`;
  const displayFare = formattedFare || `₹${fare || cost || 0}`;
  const displayEcoScore = ecoScore || 'N/A';
  const displayDistance = totalDistanceKm ? `${totalDistanceKm.toFixed(1)} km` : (distance || 'N/A');
  const displayCarbonSaved = formattedCarbonSaved || `${(carbonSaved || 0).toFixed(2)} kg CO₂`;

  // Get primary mode from first leg
  const _primaryMode = legs.length > 0 ? (legs[0].mode || 'TRANSIT') : 'TRANSIT';
  const isEcoFriendly = legs.every(leg => leg.isEcoFriendly !== false);

  return (
    <View style={styles.container} accessibilityRole="header">
      <Text 
        style={styles.title}
        accessibilityLabel={`Route from ${from || 'Start'} to ${to || 'End'}`}
      >
        UrbanFlow
      </Text>
      
      <View style={styles.infoRow}>
        <Icon name="clock-outline" size={16} color={routeTheme.colors.onSurfaceVariant} />
        <Text style={styles.infoText}>
          {displayDuration} • Arriving {arrivalTime || 'Soon'}
        </Text>
      </View>

      {/* Enhanced Route Stats - Phase 2 */}
      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: routeTheme.colors.primaryFixed }]}>            <Icon name="map-marker-distance" size={18} color={routeTheme.colors.onPrimaryFixed} />
          </View>
          <Text style={styles.statLabel}>Distance</Text>
          <Text style={styles.statValue}>{displayDistance}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: routeTheme.colors.secondaryFixed }]}>            <Icon name="currency-inr-circle" size={18} color={routeTheme.colors.onSecondaryFixed} />
          </View>
          <Text style={styles.statLabel}>Fare</Text>
          <Text style={styles.statValue}>{displayFare}</Text>
        </View>

        <View style={styles.statDivider} />

        <View style={styles.statItem}>
          <View style={[styles.statIcon, { backgroundColor: isEcoFriendly ? '#DCFCE7' : '#FEF3C7' }]}>
            <Icon 
              name={isEcoFriendly ? "leaf-circle" : "gauge"} 
              size={18} 
              color={isEcoFriendly ? "#10B981" : "#F59E0B"} 
            />
          </View>
          <Text style={styles.statLabel}>Eco Score</Text>
          <Text style={[styles.statValue, { color: isEcoFriendly ? '#10B981' : '#F59E0B' }]}>
            {typeof displayEcoScore === 'string' ? displayEcoScore : `${displayEcoScore}/10`}
          </Text>
        </View>
      </View>

      {/* Carbon Savings Display with Animation */}
      {carbonSaved > 0 && (
        <MotiView
          from={{ opacity: 0, scale: 0.8, translateY: 20 }}
          animate={{ opacity: 1, scale: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: 300 }}
          style={styles.carbonSavingsWrapper}
        >
          <View style={styles.carbonSavings}>
            <MotiView
              from={{ rotate: '0deg' }}
              animate={{ rotate: '360deg' }}
              transition={{ 
                type: 'timing', 
                duration: 2000, 
                loop: true,
                delay: 1000 
              }}
            >
              <Icon name="sprout" size={16} color="#10B981" />
            </MotiView>
            <Text style={styles.carbonSavingsText}>
              Saved {displayCarbonSaved}
            </Text>
          </View>
        </MotiView>
      )}
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
    backgroundColor: routeTheme.colors.surface,
    borderRadius: routeTheme.borderRadius.lg,
    padding: routeTheme.spacing.md,
    marginTop: routeTheme.spacing.md,
    borderWidth: 1,
    borderColor: routeTheme.colors.outlineVariant,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
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
  carbonSavingsWrapper: {
    marginTop: routeTheme.spacing.sm,
  },
  carbonSavings: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: routeTheme.spacing.xs,
    backgroundColor: '#DCFCE7',
    padding: routeTheme.spacing.sm,
    borderRadius: routeTheme.borderRadius.md,
  },
  carbonSavingsText: {
    fontSize: routeTheme.typography.fontSize.sm,
    color: '#059669',
    fontFamily: routeTheme.typography.fontFamily.label,
    fontWeight: routeTheme.typography.fontWeight.medium,
  },
});
