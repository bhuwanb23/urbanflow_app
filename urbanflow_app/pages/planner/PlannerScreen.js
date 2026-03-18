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

// Mock Data
const MOCK_ROUTES = [
  {
    id: '1',
    from: 'Central Station',
    to: 'Tech Park',
    time: '45 min',
    cost: '$2.50',
    modes: ['train', 'bus'],
    eco: 'High',
  },
  {
    id: '2',
    from: 'Downtown',
    to: 'Airport',
    time: '30 min',
    cost: '$5.00',
    modes: ['auto'],
    eco: 'Low',
  },
  {
    id: '3',
    from: 'University',
    to: 'Library',
    time: '15 min',
    cost: 'Free',
    modes: ['walk'],
    eco: 'Best',
  },
];

const { width } = Dimensions.get('window');

export default function PlannerScreen({ navigation }) {
  const [selectedMode, setSelectedMode] = useState('train');
  const [searchQuery, setSearchQuery] = useState('');
  const [routes, setRoutes] = useState(MOCK_ROUTES);

  const handleSearch = (query) => {
    setSearchQuery(query);
    if (query.trim()) {
      const filtered = MOCK_ROUTES.filter(route => 
        route.from.toLowerCase().includes(query.toLowerCase()) || 
        route.to.toLowerCase().includes(query.toLowerCase())
      );
      setRoutes(filtered);
    } else {
      setRoutes(MOCK_ROUTES);
    }
  };

  const handleRoutePress = (route) => {
    navigation.navigate('RouteDetailsScreen', { route });
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
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
