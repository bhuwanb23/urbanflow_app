import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { ROUTES } from '../constants/plannerConstants';

const { width } = Dimensions.get('window');

export default function PopularRoutes({ navigation }) {
  const handleRoutePress = (route) => {
    console.log('Route pressed:', route);
    console.log('Navigating to RouteDetailsScreen with route data');
    navigation.navigate('RouteDetailsScreen', { route });
  };

  const getIconName = (mode) => {
    if (mode === 'train') return 'train';
    else if (mode === 'bus') return 'bus';
    else if (mode === 'auto') return 'car';
    else if (mode === 'walk') return 'walk';
    else return 'car';
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
                <Icon name="arrow-down" size={16} color="#9ca3af" style={{ marginVertical: 4 }} />
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
                    color="#6366f1" 
                    style={{ marginRight: 8 }} 
                  />
                ))}
              </View>
              <View style={[styles.ecoBadge, { backgroundColor: route.ecoColor + '20' }]}>
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
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
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
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  routeTo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  routeStats: {
    alignItems: 'flex-end',
  },
  routeTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    fontFamily: 'Montserrat_700Bold',
  },
  routeCost: {
    fontSize: 12,
    color: '#6b7280',
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
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ecoText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat_700Bold',
  },
});
