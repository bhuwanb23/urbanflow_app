import React, { useState, useEffect } from 'react';
import { SafeAreaView, ScrollView, Dimensions, Alert, RefreshControl, View } from 'react-native';
import { useTranslation } from 'react-i18next';

// Import components
import {
  PlannerHeader,
  SearchBar,
  ModeFilters,
  QuickActions,
  PopularRoutes,
  RecommendationsCard
} from './components';
import FeedSkeleton from '../live/components/FeedSkeleton';
import MapSkeleton from '../live/components/MapSkeleton';
import ErrorState from '../../components/ErrorState';
import RouteMap from './components/RouteMap';

// Import styles
import { plannerStyles } from './styles/plannerStyles';

// Import API
import api from '../../utils/api';

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

const { _width } = Dimensions.get('window');

export default function PlannerScreen({ navigation }) {
  const { t } = useTranslation();
  const [selectedMode, setSelectedMode] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Load popular routes on mount
  useEffect(() => {
    loadPopularRoutes();
  }, []);

  const loadPopularRoutes = async () => {
    try {
      setLoading(true);
      setError(null);

      // Try to fetch from backend
      const response = await api.routesAPI.getPopularRoutes();
      if (response.success && response.data) {
        setRoutes(response.data);
      } else if (__DEV__) {
        // Dev-only fallback: empty / mock data so the screen stays usable
        setRoutes(MOCK_ROUTES);
      } else {
        setRoutes([]);
        setError('No popular routes available right now.');
      }
    } catch (err) {
      console.error('Error loading popular routes:', err);
      if (__DEV__) {
        setRoutes(MOCK_ROUTES);
      } else {
        setRoutes([]);
        setError('Couldn’t reach the routing service.');
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const handleSearch = async (query) => {
    setSearchQuery(query);
    
    if (query.trim()) {
      try {
        setLoading(true);
        // Parse search query for from/to locations
        const parts = query.split(' to ');
        const searchParams = {};
        
        if (parts.length === 2) {
          searchParams.fromPlace = parts[0].trim();
          searchParams.toPlace = parts[1].trim();
          
          // Call journey planning API
          const response = await api.journeyAPI.planJourney(searchParams);
          
          if (response.success && response.data?.itineraries) {
            setRoutes(response.data.itineraries);
          }
        } else {
          // Simple search - filter existing routes
          const filtered = routes.filter(route => 
            route.from?.toLowerCase().includes(query.toLowerCase()) || 
            route.to?.toLowerCase().includes(query.toLowerCase())
          );
          setRoutes(filtered);
        }
      } catch (err) {
        console.error('Search error:', err);
        Alert.alert(t('planner.searchErrorTitle'), t('planner.searchErrorMessage'));
      } finally {
        setLoading(false);
      }
    } else {
      // Reset to popular routes
      loadPopularRoutes();
    }
  };

  const handleRoutePress = (route) => {
    setSelectedRoute(route);
    navigation.navigate('RouteDetailsScreen', { route });
  };

  const onRefresh = () => {
    setRefreshing(true);
    loadPopularRoutes();
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Header Component */}
      <PlannerHeader navigation={navigation} />
      
      {/* Main Content */}
      <ScrollView 
        contentContainerStyle={plannerStyles.scrollContent} 
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      >
        {loading && routes.length === 0 ? (
          <View>
            <MapSkeleton />
            <FeedSkeleton itemCount={4} />
          </View>
        ) : error ? (
          <ErrorState message={error} onRetry={onRefresh} />
        ) : (
          <>
            {/* Search Bar Component */}
            <SearchBar onSearch={handleSearch} value={searchQuery} />
            
            {/* Mode Filters Component */}
            <ModeFilters 
              selectedMode={selectedMode} 
              setSelectedMode={setSelectedMode} 
            />

            {/* Quick Actions Component */}
            <QuickActions />

            {/* Selected Route Map (polyline) */}
            {selectedRoute && (
              <View style={{ marginBottom: 16 }}>
                <RouteMap
                  shapeId={selectedRoute.shapeId}
                  title={
                    selectedRoute.from && selectedRoute.to
                      ? `${selectedRoute.from} → ${selectedRoute.to}`
                      : 'Selected route'
                  }
                />
              </View>
            )}

            {/* AI Recommendations (experimental) */}
            <RecommendationsCard />

            {/* Popular Routes Component */}
            <PopularRoutes 
              navigation={navigation} 
              routes={routes}
              onRoutePress={handleRoutePress}
            />
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
}
