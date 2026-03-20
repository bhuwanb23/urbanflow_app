import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { routeTheme } from '../theme/routeTheme';
import { STATUS_CONFIG } from '../constants/routeConstants';

/**
 * LiveStatusBadge Component
 * Displays real-time status indicator using actual delay data
 * @param {string} status - Status key ('on-time', 'delayed', etc.)
 * @param {object} delayData - Real delay data from API (optional)
 * @param {number} delayMinutes - Actual delay in minutes (from API)
 */
export default function LiveStatusBadge({ status, delayInfo, delayData, delayMinutes }) {
  // Use real delay data if available
  let displayStatus = status;
  let displayText = '';
  let backgroundColor = '';
  let textColor = '';

  if (delayData) {
    // Use real API data
    displayStatus = delayData.prediction || status;
    const config = STATUS_CONFIG[displayStatus] || STATUS_CONFIG['on-time'];
    
    displayText = delayData.prediction === 'on-time' 
      ? 'On Time' 
      : `${Math.abs(delayData.delayMinutes || 0).toFixed(0)} min ${delayData.prediction}`;
    
    backgroundColor = routeTheme.colors[config.bgColor];
    textColor = routeTheme.colors[config.textColor];
  } else if (delayMinutes !== undefined) {
    // Use simple delay minutes
    if (Math.abs(delayMinutes) < 2) {
      displayStatus = 'on-time';
      displayText = 'On Time';
    } else if (delayMinutes > 5) {
      displayStatus = 'delayed';
      displayText = `${delayMinutes.toFixed(0)} min delayed`;
    } else if (delayMinutes < -5) {
      displayStatus = 'early';
      displayText = `${Math.abs(delayMinutes).toFixed(0)} min early`;
    } else {
      displayStatus = 'minor-delay';
      displayText = `${delayMinutes > 0 ? '+' : ''}${delayMinutes.toFixed(0)} min`;
    }
    
    const config = STATUS_CONFIG[displayStatus] || STATUS_CONFIG['on-time'];
    backgroundColor = routeTheme.colors[config.bgColor];
    textColor = routeTheme.colors[config.textColor];
  } else {
    // Fallback to original behavior
    const config = STATUS_CONFIG[status] || STATUS_CONFIG['on-time'];
    displayText = status === 'delayed' && delayInfo ? delayInfo : config.label;
    backgroundColor = routeTheme.colors[config.bgColor];
    textColor = routeTheme.colors[config.textColor];
  }

  return (
    <View 
      style={[
        styles.badge,
        { backgroundColor }
      ]}
      accessibilityRole="text"
      accessibilityLabel={`Status: ${displayText}`}
    >
      <Text 
        style={[
          styles.text,
          { color: textColor }
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
