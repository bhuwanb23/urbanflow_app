import React, { useState, useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, ScrollView, Text, View, StatusBar } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

// Import components
import {
  RouteHeader,
  RouteOverview,
  LiveAlert,
  JourneySteps,
  EnvironmentalImpact,
  AlternateRoutes,
  QuickActions
} from './components';

// Import constants and styles
import { DEFAULT_ROUTE } from './constants/routeConstants';
import { routeStyles } from './styles/routeStyles';

export default function RouteDetailsScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);
  const [routeData, setRouteData] = useState(DEFAULT_ROUTE);
  const insets = useSafeAreaInsets();

  useEffect(() => {
    // Get route data from navigation params
    if (route?.params?.route) {
      console.log('Route data received:', route.params.route);
      setRouteData(route.params.route);
    } else {
      console.log('No route data received, using default');
    }
    
    // Simulate network loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, [route?.params?.route]);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleMenu = () => {
    console.log('Menu pressed');
  };

  const handleStartRoute = () => {
    console.log('Start route pressed');
  };

  const handleSaveRoute = () => {
    console.log('Save route pressed');
  };

  const handleShareRoute = () => {
    console.log('Share route pressed');
  };

  const handleViewAlternatives = () => {
    console.log('View alternatives pressed');
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }} edges={['top', 'left', 'right']}>
        <StatusBar barStyle="dark-content" backgroundColor="#F9FAFB" />
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 16, color: '#6366f1', fontFamily: 'Urbanist_400Regular', fontSize: 16 }}>Loading route details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['left', 'right']}>
      <StatusBar barStyle="light-content" backgroundColor="#6366f1" />
      
      {/* Header Component */}
      <RouteHeader onBack={handleBack} onMenu={handleMenu} />

      <ScrollView 
        contentContainerStyle={[
          routeStyles.scrollContent, 
          { 
            paddingBottom: Math.max(80 + insets.bottom, 100),
            paddingTop: 8
          }
        ]} 
        showsVerticalScrollIndicator={false}
        bounces={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Route Overview Component */}
        <RouteOverview routeData={routeData} />

        {/* Live Alert Component */}
        <LiveAlert />

        {/* Journey Steps Component */}
        <JourneySteps />

        {/* Environmental Impact Component */}
        <EnvironmentalImpact />

        {/* Alternate Routes Component */}
        <AlternateRoutes onViewAlternatives={handleViewAlternatives} />

        {/* Quick Actions Component */}
        <QuickActions 
          onStartRoute={handleStartRoute}
          onSaveRoute={handleSaveRoute}
          onShareRoute={handleShareRoute}
        />
      </ScrollView>
    </SafeAreaView>
  );
}
