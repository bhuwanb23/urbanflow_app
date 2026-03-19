import React from 'react';
import { View, SafeAreaView, StyleSheet } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { routeTheme } from '../theme/routeTheme';

/**
 * RouteLayout Component
 * Main container for the route details screen with safe area handling
 */
export default function RouteLayout({ children, testID = 'route-layout' }) {
  const insets = useSafeAreaInsets();

  return (
    <SafeAreaView 
      style={[styles.container, { paddingTop: insets.top }]}
      testID={testID}
      accessibilityLabel="Route details screen"
    >
      <View style={styles.content}>
        {children}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: routeTheme.colors.background,
  },
  content: {
    flex: 1,
  },
});
