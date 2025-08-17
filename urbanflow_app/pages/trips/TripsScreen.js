import React, { useState, useEffect } from 'react';
import { ScrollView, ActivityIndicator, SafeAreaView, Text, StyleSheet } from 'react-native';

// Import components
import TripsHeader from './components/TripsHeader';
import FilterBar from './components/FilterBar';
import SavedRoutesSection from './components/SavedRoutesSection';
import RecentTripsSection from './components/RecentTripsSection';

// Import data
import { favoriteRoutes, tripHistory } from './data/tripsData';

export default function TripsScreen({ navigation }) {
  const [filterIdx, setFilterIdx] = useState(0);
  const [sortIdx, setSortIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 16, color: '#6366f1', fontFamily: 'Montserrat_400Regular', fontSize: 16 }}>Loading trips...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      <TripsHeader navigation={navigation} />
      <FilterBar 
        filterIdx={filterIdx} 
        setFilterIdx={setFilterIdx} 
        sortIdx={sortIdx} 
        setSortIdx={setSortIdx} 
      />
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        <SavedRoutesSection favoriteRoutes={favoriteRoutes} />
        <RecentTripsSection tripHistory={tripHistory} />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  scrollContent: {
    paddingBottom: 32,
  },
}); 