import React, { useState, useCallback } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import Components
import {
  RouteLayout,
  TopAppBar,
  JourneyOverview,
  SegmentList,
  RouteErrorBoundary,
  RouteSkeleton,
} from './components';

// Import context and hooks
import { RouteProvider, useRoute } from './context/RouteContext';
import { useAccessibility } from './hooks/useAccessibility';
import { useLiveTracking } from './hooks/useLiveTracking';

// Import constants
import { MOCK_ROUTE_DATA } from './constants/routeConstants';
import { routeTheme } from './theme/routeTheme';

/**
 * Main Route Details Screen Content
 */
function RouteDetailsContent({ navigation, route }) {
  const { currentRoute, isLoading, error, updateRoute } = useRoute();
  const { triggerHapticFeedback } = useAccessibility();
  const { startTracking, stopTracking } = useLiveTracking();
  const insets = useSafeAreaInsets();

  // Use route data from params or mock data
  React.useEffect(() => {
    if (route?.params?.route) {
      updateRoute(route.params.route);
    }
  }, [route?.params?.route]);

  const handleBack = useCallback(() => {
    triggerHapticFeedback('impact-light');
    navigation.goBack();
  }, [navigation]);

  const handleStartJourney = useCallback(() => {
    triggerHapticFeedback('success');
    startTracking();
    console.log('Starting journey...');
  }, [startTracking]);

  if (isLoading) {
    return <RouteSkeleton segmentCount={4} />;
  }

  return (
    <RouteLayout>
      <TopAppBar 
        onBack={handleBack} 
        onStartJourney={handleStartJourney}
      />

      <ScrollView 
        contentContainerStyle={[
          styles.scrollContent,
          { paddingBottom: insets.bottom + 80 }
        ]}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <JourneyOverview routeData={currentRoute} />
        
        <SegmentList segments={currentRoute?.segments || []} />
      </ScrollView>
    </RouteLayout>
  );
}

/**
 * RouteDetailsScreen with Error Boundary and Context Provider
 */
export default function RouteDetailsScreen(props) {
  return (
    <RouteProvider>
      <RouteErrorBoundary
        onError={(error) => console.error('Route screen error:', error)}
        onRetry={() => console.log('Retrying route screen...')}
      >
        <RouteDetailsContent {...props} />
      </RouteErrorBoundary>
    </RouteProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: routeTheme.colors.background,
  },
  scrollContent: {
    paddingHorizontal: 24,
    paddingTop: routeTheme.spacing.xl,
  },
});
