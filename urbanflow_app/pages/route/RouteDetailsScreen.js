import React, { useState, useCallback, useMemo } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Linking, Alert } from 'react-native';
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

  // State for itinerary sorting
  const [sortBy, setSortBy] = useState('recommended');

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
