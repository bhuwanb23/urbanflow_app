import React, { useState, useEffect } from 'react';
import { SafeAreaView, ActivityIndicator, ScrollView, Text, StyleSheet, Dimensions } from 'react-native';

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

const { width } = Dimensions.get('window');

export default function PlannerScreen({ navigation }) {
  const [selectedMode, setSelectedMode] = useState('train');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

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
        <SearchBar />
        
        {/* Mode Filters Component */}
        <ModeFilters 
          selectedMode={selectedMode} 
          setSelectedMode={setSelectedMode} 
        />

        {/* Quick Actions Component */}
        <QuickActions />

        {/* Popular Routes Component */}
        <PopularRoutes navigation={navigation} />
      </ScrollView>
    </SafeAreaView>
  );
} 