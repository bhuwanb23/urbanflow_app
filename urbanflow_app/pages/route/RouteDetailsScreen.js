import React, { useState } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, Dimensions, Animated } from 'react-native';

// Import Components
import {
  RouteHeader,
  RouteOverview,
  LiveAlert,
  JourneySteps,
  EnvironmentalImpact,
  AlternateRoutes,
  QuickActions
} from './components';

// Import constants and theme
import { routeTheme } from './styles/routeTheme';
import { MOCK_ROUTE_DATA } from './constants/routeConstants';

export default function RouteDetailsScreen({ route, navigation }) {
  // Use passed route data or fallback to mock data
  const routeData = route?.params?.route || MOCK_ROUTE_DATA;

  return (
    <SafeAreaView style={styles.container}>
      <RouteHeader 
        onBack={() => navigation.goBack()} 
        onMenu={() => console.log('Menu options')} 
      />

      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <RouteOverview routeData={routeData} />
        
        <LiveAlert />

        <JourneySteps />

        <EnvironmentalImpact />

        <AlternateRoutes />

        <QuickActions />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: routeTheme.colors.background,
  },
  scrollContent: {
    padding: 24,
    paddingBottom: 40,
  },
});
