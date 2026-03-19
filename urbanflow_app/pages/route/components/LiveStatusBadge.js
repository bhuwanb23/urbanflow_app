import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { routeTheme } from '../theme/routeTheme';
import { STATUS_CONFIG } from '../constants/routeConstants';

/**
 * LiveStatusBadge Component
 * Displays status indicator (On Time, Delayed, etc.)
 */
export default function LiveStatusBadge({ status, delayInfo }) {
  const config = STATUS_CONFIG[status] || STATUS_CONFIG['on-time'];
  
  const displayText = status === 'delayed' && delayInfo ? delayInfo : config.label;

  return (
    <View 
      style={[
        styles.badge,
        { 
          backgroundColor: routeTheme.colors[config.bgColor],
        }
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${displayText}`}
    >
      <Text 
        style={[
          styles.text,
          { 
            color: routeTheme.colors[config.textColor],
          }
        ]}
      >
        {displayText}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: routeTheme.borderRadius.full,
  },
  text: {
    fontSize: routeTheme.typography.fontSize.xs,
    fontWeight: routeTheme.typography.fontWeight.semibold,
    fontFamily: routeTheme.typography.fontFamily.label,
  },
});
