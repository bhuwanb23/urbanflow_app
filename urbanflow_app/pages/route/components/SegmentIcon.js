import React from 'react';
import { View, StyleSheet } from 'react-native';
import { routeTheme } from '../theme/routeTheme';
import { TRANSPORT_MODES } from '../constants/routeConstants';

/**
 * SegmentIcon Component
 * Displays transport mode icon with themed background
 */
export default function SegmentIcon({ type, size = 48 }) {
  const modeConfig = TRANSPORT_MODES[type] || TRANSPORT_MODES.walk;
  const iconSize = size * 0.5;

  return (
    <View 
      style={[
        styles.iconContainer, 
        { 
          width: size, 
          height: size,
          backgroundColor: routeTheme.colors[modeConfig.iconBg] || routeTheme.colors.primaryFixed,
        }
      ]}
      accessibilityRole="image"
      accessibilityLabel={modeConfig.label}
    >
      <Icon 
        name={modeConfig.icon} 
        size={iconSize} 
        color={routeTheme.colors[modeConfig.iconColor] || routeTheme.colors.onPrimaryFixed} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    borderRadius: routeTheme.borderRadius.full,
    alignItems: 'center',
    justifyContent: 'center',
    ...routeTheme.shadows.sm,
  },
});

// Import Icon after component definition to avoid circular dependency
const Icon = require('react-native-vector-icons/MaterialCommunityIcons').default;
