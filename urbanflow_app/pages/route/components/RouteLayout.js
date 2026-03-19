import React from 'react';
import { View, StyleSheet } from 'react-native';
import { routeTheme } from '../theme/routeTheme';

/**
 * RouteLayout Component
 * Main container for the route details screen
 */
export default function RouteLayout({ children, testID = 'route-layout' }) {
  return (
    <View 
      style={styles.container}
      testID={testID}
      accessibilityLabel="Route details screen"
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: routeTheme.colors.background,
  },
});
