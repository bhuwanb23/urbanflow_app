import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { routeTheme } from '../theme/routeTheme';
import SegmentIcon from './SegmentIcon';
import SegmentConnector from './SegmentConnector';
import LiveStatusBadge from './LiveStatusBadge';
import { useAccessibility } from '../hooks/useAccessibility';

/**
 * SegmentItem Component
 * Individual journey segment card with transport details
 */
export default function SegmentItem({ segment, isLast = false, onPress }) {
  const { triggerHapticFeedback } = useAccessibility();

  const handlePress = () => {
    triggerHapticFeedback('selection');
    onPress?.();
  };

  const renderFeatures = () => {
    if (!segment.features?.length) return null;

    return (
      <View style={styles.featuresContainer}>
        {segment.features.map((feature, index) => (
          <View key={index} style={styles.featureBadge}>
            <Text style={styles.featureText}>{feature}</Text>
          </View>
        ))}
      </View>
    );
  };

  const renderAdditionalInfo = () => {
    if (segment.liveTracking) {
      return (
        <View style={styles.liveTrackingContainer}>
          <Icon name="signal" size={12} color={routeTheme.colors.primary} />
          <Text style={styles.liveTrackingText}>LIVE TRACKING ACTIVE</Text>
        </View>
      );
    }

    if (segment.occupancy) {
      return (
        <View style={styles.occupancyContainer}>
          {[...Array(segment.occupancy === 'low' ? 1 : segment.occupancy === 'medium' ? 2 : 3)].map((_, i) => (
            <View key={i} style={styles.occupancyAvatar}>
              <Icon name="account" size={10} color={routeTheme.colors.onSurfaceVariant} />
            </View>
          ))}
          <Text style={styles.occupancyText}>
            {segment.occupancy === 'low' ? 'Low' : segment.occupancy === 'medium' ? 'Medium' : 'High'} occupancy
          </Text>
        </View>
      );
    }

    if (segment.nearbyStation) {
      return (
        <View style={styles.nearbyContainer}>
          <View style={[styles.pulseDot, { backgroundColor: routeTheme.colors.primaryFixed }]} />
          <Text style={styles.nearbyText}>STATION NEARBY</Text>
        </View>
      );
    }

    if (segment.accessibility) {
      return (
        <View style={styles.accessibilityContainer}>
          <Icon name="wheelchair-accessibility" size={14} color={routeTheme.colors.primary} />
          <Text style={styles.accessibilityText}>Accessible</Text>
        </View>
      );
    }

    return null;
  };

  return (
    <View style={styles.container}>
      {!isLast && <SegmentConnector />}
      
      <TouchableOpacity 
        style={styles.segmentWrapper}
        onPress={handlePress}
        accessibilityRole="button"
        accessibilityLabel={`${segment.type} segment: ${segment.title}`}
        accessibilityHint={`View details for ${segment.title}`}
      >
        <SegmentIcon type={segment.type} />
        
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <View style={styles.titleContainer}>
              <Text style={styles.title}>{segment.title}</Text>
              {segment.laneInfo && (
                <View style={styles.laneBadge}>
                  <Text style={styles.laneText}>{segment.laneInfo}</Text>
                </View>
              )}
            </View>
            
            <LiveStatusBadge status={segment.status} delayInfo={segment.delayInfo} />
          </View>
          
          <View style={styles.detailsRow}>
            {segment.distance && (
              <Text style={styles.detailText}>{segment.distance}</Text>
            )}
            {segment.stops && (
              <Text style={styles.detailText}>• {segment.stops} stops</Text>
            )}
            <Text style={styles.detailText}>• {segment.duration}</Text>
          </View>
          
          {renderAdditionalInfo()}
          {renderFeatures()}
        </View>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: routeTheme.spacing.xl,
  },
  segmentWrapper: {
    flexDirection: 'row',
    gap: routeTheme.spacing.md,
    alignItems: 'flex-start',
  },
  card: {
    flex: 1,
    backgroundColor: routeTheme.colors.surface,
    borderRadius: routeTheme.borderRadius.xl,
    padding: routeTheme.spacing.lg,
    borderWidth: 0.5,
    borderColor: routeTheme.colors.outlineVariant,
    shadowColor: 'transparent',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0,
    shadowRadius: 0,
    elevation: 0,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: routeTheme.spacing.xs,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: routeTheme.spacing.sm,
  },
  title: {
    fontSize: routeTheme.typography.fontSize.base,
    fontWeight: routeTheme.typography.fontWeight.bold,
    color: routeTheme.colors.onSurface,
    fontFamily: routeTheme.typography.fontFamily.headline,
  },
  laneBadge: {
    backgroundColor: routeTheme.colors.surfaceContainerHigh,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: routeTheme.borderRadius.sm,
  },
  laneText: {
    fontSize: 10,
    fontWeight: routeTheme.typography.fontWeight.bold,
    color: routeTheme.colors.onSurfaceVariant,
  },
  detailsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: routeTheme.spacing.xs,
  },
  detailText: {
    fontSize: routeTheme.typography.fontSize.xs,
    color: routeTheme.colors.onSurfaceVariant,
    fontFamily: routeTheme.typography.fontFamily.label,
    fontWeight: routeTheme.typography.fontWeight.medium,
  },
  featuresContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: routeTheme.spacing.xs,
    marginTop: routeTheme.spacing.sm,
  },
  featureBadge: {
    backgroundColor: routeTheme.colors.secondaryContainer,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: routeTheme.borderRadius.full,
  },
  featureText: {
    fontSize: routeTheme.typography.fontSize.xs,
    fontWeight: routeTheme.typography.fontWeight.semibold,
    color: routeTheme.colors.onSecondaryContainer,
    fontFamily: routeTheme.typography.fontFamily.label,
  },
  liveTrackingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: routeTheme.spacing.xs,
    marginTop: routeTheme.spacing.sm,
  },
  liveTrackingText: {
    fontSize: 10,
    fontWeight: routeTheme.typography.fontWeight.bold,
    color: routeTheme.colors.primary,
    fontFamily: routeTheme.typography.fontFamily.label,
  },
  occupancyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: routeTheme.spacing.xs,
    marginTop: routeTheme.spacing.sm,
  },
  occupancyAvatar: {
    width: 24,
    height: 24,
    borderRadius: routeTheme.borderRadius.full,
    backgroundColor: routeTheme.colors.surfaceVariant,
    borderWidth: 2,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  occupancyText: {
    fontSize: routeTheme.typography.fontSize.xs,
    color: routeTheme.colors.onSurfaceVariant,
    fontFamily: routeTheme.typography.fontFamily.label,
    fontWeight: routeTheme.typography.fontWeight.medium,
  },
  nearbyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: routeTheme.spacing.xs,
    marginTop: routeTheme.spacing.sm,
  },
  pulseDot: {
    width: 8,
    height: 8,
    borderRadius: routeTheme.borderRadius.full,
  },
  nearbyText: {
    fontSize: 10,
    fontWeight: routeTheme.typography.fontWeight.bold,
    color: routeTheme.colors.primary,
    fontFamily: routeTheme.typography.fontFamily.label,
  },
  accessibilityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: routeTheme.spacing.xs,
    marginTop: routeTheme.spacing.sm,
  },
  accessibilityText: {
    fontSize: routeTheme.typography.fontSize.xs,
    color: routeTheme.colors.primary,
    fontFamily: routeTheme.typography.fontFamily.label,
    fontWeight: routeTheme.typography.fontWeight.medium,
  },
});
