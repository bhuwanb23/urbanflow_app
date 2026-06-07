import React, { useState, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ScrollView, Linking, Alert, TouchableOpacity } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import Components
import {
  RouteLayout,
  TopAppBar,
  JourneyOverview,
  SegmentList,
  RouteErrorBoundary,
  RouteSkeleton,
  ItineraryTabs,
} from './components';

// Import context and hooks
import { RouteProvider, useRoute } from './context/RouteContext';
import { useAccessibility } from './hooks/useAccessibility';
import { useLiveTracking } from './hooks/useLiveTracking';

// Import constants

import { routeTheme } from './theme/routeTheme';

/**
 * Main Route Details Screen Content
 */
function RouteDetailsContent({ navigation, route }) {
  const { currentRoute, isLoading, error, refetch } = useRoute();
  const { triggerHapticFeedback } = useAccessibility();
  const { startTracking, _stopTracking } = useLiveTracking();
  const insets = useSafeAreaInsets();

  // State for itinerary sorting
  const [sortBy, setSortBy] = useState('recommended');

  // Resolve the params: routeId takes precedence (drives a real
  // network fetch inside the provider), but a fully formed
  // `route` object in params is used as `initialRoute` for
  // offline / preview flows.
  const incomingRoute = route?.params?.route;
  const incomingRouteId = route?.params?.routeId || (incomingRoute && incomingRoute.id) || null;
  const hasRealRouteId = Boolean(route?.params?.routeId);

  const handleBack = useCallback(() => {
    triggerHapticFeedback('impact-light');
    navigation.goBack();
  }, [navigation]);

  const handleStartJourney = useCallback(() => {
    triggerHapticFeedback('success');
    startTracking();
    
    // Open Google Maps with the route destination
    if (currentRoute && currentRoute.legs && currentRoute.legs.length > 0) {
      const lastLeg = currentRoute.legs[currentRoute.legs.length - 1];
      const { to } = lastLeg;
      
      if (to && to.lat && to.lon) {
        const url = `https://www.google.com/maps/dir/?api=1&destination=${to.lat},${to.lon}`;
        
        Linking.canOpenURL(url)
          .then((supported) => {
            if (supported) {
              return Linking.openURL(url);
            } else {
              Alert.alert(
                'Unable to Open Maps',
                'Google Maps is not available on your device.',
                [{ text: 'OK' }]
              );
            }
          })
          .catch((err) => {
            console.error('Error opening Google Maps:', err);
            Alert.alert(
              'Error',
              'Failed to open Google Maps. Please try again.',
              [{ text: 'OK' }]
            );
          });
      } else {
        Alert.alert(
          'No Destination',
          'Destination coordinates not available for this route.',
          [{ text: 'OK' }]
        );
      }
    } else {
      Alert.alert(
        'Starting Navigation',
        'Get ready for your journey!',
        [{ text: 'OK' }]
      );
    }
  }, [startTracking, currentRoute]);

  // Sort itineraries based on selected criteria
  const sortedItineraries = useMemo(() => {
    if (!currentRoute) return [];
    
    // For now, we just have one route, but this prepares for multiple
    const itineraries = [currentRoute];
    
    if (sortBy === 'cheapest') {
      return itineraries.sort((a, b) => (a.fare || 0) - (b.fare || 0));
    } else if (sortBy === 'fastest') {
      return itineraries.sort((a, b) => (a.durationMinutes || 0) - (b.durationMinutes || 0));
    }
    // recommended - keep original order
    return itineraries;
  }, [currentRoute, sortBy]);

  if (isLoading) {
    return <RouteSkeleton segmentCount={4} />;
  }

  if (error && !currentRoute) {
    return (
      <RouteLayout>
        <TopAppBar onBack={() => navigation.goBack()} onStartJourney={() => {}} />
        <View style={styles.errorState}>
          <Text style={styles.errorTitle}>Couldn’t load this route</Text>
          <Text style={styles.errorBody}>{error}</Text>
          <TouchableOpacity
            accessibilityRole="button"
            accessibilityLabel="Retry loading route"
            onPress={() => refetch && refetch()}
            style={styles.retryButton}
          >
            <Text style={styles.retryText}>Try again</Text>
          </TouchableOpacity>
        </View>
      </RouteLayout>
    );
  }

  if (!currentRoute) {
    return null;
  }

  return (
    <RouteLayout>
      {/* Itinerary Tabs */}
      <ItineraryTabs 
        sortBy={sortBy}
        onSortChange={setSortBy}
        itineraryCount={sortedItineraries.length}
      />
      
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
        {sortedItineraries.map((itinerary, index) => (
          <View key={index}>
            <JourneyOverview routeData={itinerary} />
            <SegmentList segments={itinerary?.segments || []} />
          </View>
        ))}
      </ScrollView>
    </RouteLayout>
  );
}

/**
 * RouteDetailsScreen with Error Boundary and Context Provider
 */
export default function RouteDetailsScreen(props) {
  const { route } = props;
  const incomingRoute = route?.params?.route;
  const incomingRouteId = route?.params?.routeId || (incomingRoute && incomingRoute.id) || null;

  return (
    <RouteProvider
      routeId={_incomingRouteId}
      initialRoute={incomingRoute || undefined}
    >
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
  errorState: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 32,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: routeTheme.colors.text,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorBody: {
    fontSize: 14,
    color: routeTheme.colors.textMuted || '#64748b',
    textAlign: 'center',
    marginBottom: 24,
  },
  retryButton: {
    backgroundColor: routeTheme.colors.primary,
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
  },
  retryText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
});
