import React, { useState, useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, ScrollView, Text, StyleSheet, Dimensions, Alert } from 'react-native';

// Import components
import {
  PlannerHeader,
  SearchBar,
  ModeFilters,
  QuickActions,
  PopularRoutes
} from './components';

// Import styles
import { plannerStyles } from './styles/plannerStyles';

// Import API hooks
import { useRoutes } from '../../utils/hooks/useAPI';

const { width } = Dimensions.get('window');

export default function PlannerScreen({ navigation }) {
  const [selectedMode, setSelectedMode] = useState('train');
  const [searchQuery, setSearchQuery] = useState('');

  // API hooks
  const { routes, fetchRoutes, searchRoutes, getPopularRoutes, loading, error } = useRoutes();

  useEffect(() => {
    loadPlannerData();
  }, []);

  // Show error alert if there's an API error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'Retry', onPress: loadPlannerData },
        { text: 'OK' }
      ]);
    }
  }, [error]);

  const loadPlannerData = async () => {
    try {
      await Promise.all([
        fetchRoutes({ isActive: true }),
        getPopularRoutes()
      ]);
    } catch (error) {
      console.log('Error loading planner data:', error);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      try {
        await searchRoutes({ query, limit: 10 });
      } catch (error) {
        console.log('Error searching routes:', error);
      }
    }
  };

  const handleRoutePress = (route) => {
    navigation.navigate('RouteDetailsScreen', { route });
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 16, color: '#10B981', fontFamily: 'Poppins_400Regular', fontSize: 16 }}>Loading planner...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Header Component */}
      <PlannerHeader navigation={navigation} />
      
      {/* Main Content */}
      <ScrollView contentContainerStyle={plannerStyles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar Component */}
        <SearchBar onSearch={handleSearch} value={searchQuery} />
        
        {/* Mode Filters Component */}
        <ModeFilters 
          selectedMode={selectedMode} 
          setSelectedMode={setSelectedMode} 
        />

        {/* Quick Actions Component */}
        <QuickActions />

        {/* Popular Routes Component */}
        <PopularRoutes 
          navigation={navigation} 
          routes={routes}
          onRoutePress={handleRoutePress}
        />
      </ScrollView>
    </SafeAreaView>
  );
} 