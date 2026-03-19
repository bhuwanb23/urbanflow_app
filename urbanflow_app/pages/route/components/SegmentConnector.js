import React from 'react';
import { View, StyleSheet } from 'react-native';
import { routeTheme } from '../theme/routeTheme';

/**
 * SegmentConnector Component
 * Vertical dashed line connecting segments
 */
export default function SegmentConnector({ visible = true }) {
  if (!visible) return null;

  return (
    <View 
      style={styles.connector}
      accessibilityElementsHidden
      importantForAccessibility="no"
    >
      <View style={styles.dashedLine} />
    </View>
  );
}

const styles = StyleSheet.create({
  connector: {
    position: 'absolute',
    left: 28, // Aligned with segment icon center
    top: 48, // Below the icon
    bottom: -16,
    width: 2,
    zIndex: 0,
  },
  dashedLine: {
    flex: 1,
    width: 2,
    backgroundColor: 'transparent',
    backgroundImage: `linear-gradient(to bottom, ${routeTheme.colors.outlineVariant} 50%, transparent 50%)`,
    backgroundSize: '2px 8px',
    backgroundRepeat: 'repeat-y',
  },
});
