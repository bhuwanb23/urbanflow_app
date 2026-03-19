import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { routeTheme } from '../styles/routeTheme';

export default function RouteOverview({ routeData }) {
  return (
    <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600 }}>
      <View style={styles.routeOverview}>
        <View style={styles.routePoints}>
          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: routeTheme.colors.success }]} />
            <View style={styles.routePointInfo}>
              <Text style={styles.routePointText}>{routeData.from}</Text>
              <Text style={styles.routePointTime}>8:30 AM</Text>
            </View>
          </View>
          
          <View style={styles.routeStats}>
            <View style={styles.routeLine} />
            <View style={styles.routeStatsCenter}>
              <Text style={styles.routeDuration}>{routeData.duration}</Text>
              <Text style={styles.routeDistance}>{routeData.distance}</Text>
            </View>
            <View style={styles.routeFeatures}>
              <View style={styles.routeFeature}>
                <Icon name="leaf" size={16} color={routeTheme.colors.success} />
                <Text style={styles.routeFeatureText}>Eco-friendly</Text>
              </View>
              <View style={styles.routeFeature}>
                <Icon name="star" size={14} color={routeTheme.colors.accent} />
                <Text style={styles.routeFeatureText}>4.2</Text>
                <Text style={styles.routeFeatureText}>Comfort</Text>
              </View>
            </View>
          </View>

          <View style={styles.routePoint}>
            <View style={[styles.routeDot, { backgroundColor: routeTheme.colors.error }]} />
            <View style={styles.routePointInfo}>
              <Text style={styles.routePointText}>{routeData.to}</Text>
              <Text style={styles.routePointTime}>9:02 AM</Text>
            </View>
          </View>
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  routeOverview: {
    backgroundColor: '#ECFDF5', // Emerald 50
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0', // Emerald 200
  },
  routePoints: {
    gap: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  routePointInfo: {
    flex: 1,
  },
  routePointText: {
    fontSize: 16,
    fontWeight: '600',
    color: routeTheme.colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  routePointTime: {
    fontSize: 12,
    color: routeTheme.colors.textSecondary,
    fontFamily: 'Urbanist_400Regular',
  },
  routeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  routeLine: {
    width: 2,
    height: 32,
    backgroundColor: routeTheme.colors.textTertiary,
    borderRadius: 1,
  },
  routeStatsCenter: {
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 16,
  },
  routeDuration: {
    fontSize: 24,
    fontWeight: 'bold',
    color: routeTheme.colors.primary,
    fontFamily: 'Poppins_700Bold',
  },
  routeDistance: {
    fontSize: 12,
    color: routeTheme.colors.textSecondary,
    fontFamily: 'Urbanist_400Regular',
  },
  routeFeatures: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  routeFeature: {
    alignItems: 'center',
  },
  routeFeatureText: {
    fontSize: 12,
    color: routeTheme.colors.textSecondary,
    fontFamily: 'Urbanist_400Regular',
    marginTop: 2,
  },
});
