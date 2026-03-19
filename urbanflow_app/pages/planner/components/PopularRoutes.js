import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { ROUTES } from '../constants/plannerConstants';

const { width } = Dimensions.get('window');

export default function PopularRoutes({ navigation }) {
  const handleRoutePress = (route) => {
    console.log('Route pressed:', route);
    
    // Generate detailed route data with segments based on modes
    const detailedRoute = {
      ...route,
      id: `detailed-${route.id}`,
      arrivalTime: '09:15 AM',
      ecoScore: parseFloat(route.eco),
      hasMapPreview: true,
      mapPreviewIndex: 1,
      segments: generateSegments(route),
    };
    
    console.log('Navigating to RouteDetailsScreen with route data', detailedRoute);
    navigation.navigate('RouteDetailsScreen', { route: detailedRoute });
  };

  const getIconName = (mode) => {
    if (mode === 'train') return 'train';
    else if (mode === 'bus') return 'bus';
    else if (mode === 'auto') return 'car';
    else if (mode === 'walk') return 'walk';
    else return 'car';
  };

  // Generate segments based on route modes
  const generateSegments = (route) => {
    const segments = [];
    let segmentId = 1;
    
    // Add walk segment at start
    segments.push({
      id: `seg-${segmentId++}`,
      type: 'walk',
      title: 'Walk to Station',
      duration: '5 mins',
      distance: '0.3 miles',
      status: 'on-time',
      features: ['On Time'],
    });
    
    // Add transport mode segments
    route.modes.forEach((mode, index) => {
      const transportType = mode === 'auto' ? 'bus' : mode;
      segments.push({
        id: `seg-${segmentId++}`,
        type: transportType,
        title: `${transportType.charAt(0).toUpperCase() + transportType.slice(1)} ${100 + index}`,
        duration: `${10 + index * 5} mins`,
        stops: 4 + index * 2,
        status: index === 0 ? 'on-time' : 'delayed',
        delayInfo: index === 0 ? null : '2m delay',
        liveTracking: index === 0,
        features: [index === 0 ? 'On Time' : '2m delay'],
      });
    });
    
    // Add bike/walk segment at end
    segments.push({
      id: `seg-${segmentId++}`,
      type: 'bike',
      title: 'FlowBike Rental',
      duration: '7 mins',
      distance: '0.8 miles',
      status: 'available',
      nearbyStation: true,
      features: ['Available'],
    });
    
    return segments;
  };

  return (
    <View style={styles.popularRoutes}>
      <Text style={styles.sectionTitle}>Popular Routes</Text>
      {ROUTES.map((route, index) => (
        <MotiView
          key={route.id}
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 600, delay: index * 100 }}
        >
          <TouchableOpacity 
            style={styles.routeCard}
            onPress={() => handleRoutePress(route)}
            activeOpacity={0.7}
          >
            <View style={styles.routeHeader}>
              <View style={styles.routeInfo}>
                <Text style={styles.routeFrom}>{route.from}</Text>
                <Icon name="arrow-down" size={16} color="#94A3B8" style={{ marginVertical: 4 }} />
                <Text style={styles.routeTo}>{route.to}</Text>
              </View>
              <View style={styles.routeStats}>
                <Text style={styles.routeTime}>{route.time}</Text>
                <Text style={styles.routeCost}>{route.cost}</Text>
              </View>
            </View>
            <View style={styles.routeFooter}>
              <View style={styles.routeModes}>
                {route.modes.map((mode, i) => (
                  <Icon 
                    key={i} 
                    name={getIconName(mode)} 
                    size={16} 
                    color="#64748B" 
                    style={{ marginRight: 8 }} 
                  />
                ))}
              </View>
              <View style={[styles.ecoBadge, { backgroundColor: route.ecoColor + '15' }]}>
                <Text style={[styles.ecoText, { color: route.ecoColor }]}>{route.eco} Eco</Text>
              </View>
            </View>
          </TouchableOpacity>
        </MotiView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  popularRoutes: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A', // Slate 900
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: -0.5,
  },
  routeCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9', // Slate 100
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeFrom: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A', // Slate 900
    fontFamily: 'Urbanist_700Bold',
  },
  routeTo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#0F172A', // Slate 900
    fontFamily: 'Urbanist_700Bold',
  },
  routeStats: {
    alignItems: 'flex-end',
  },
  routeTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#10B981', // Emerald 500
    fontFamily: 'Urbanist_700Bold',
  },
  routeCost: {
    fontSize: 12,
    color: '#64748B', // Slate 500
    fontFamily: 'Urbanist_400Regular',
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeModes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ecoBadge: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    borderRadius: 8,
  },
  ecoText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Urbanist_700Bold',
  },
});
