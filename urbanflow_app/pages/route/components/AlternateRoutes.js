import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { routeTheme } from '../styles/routeTheme';

export default function AlternateRoutes() {
  return (
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 800 }}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Alternative Routes</Text>
        <TouchableOpacity style={styles.altRoute}>
          <View style={styles.altRouteLeft}>
            <Text style={styles.altRouteTitle}>Via Red Line (Faster)</Text>
            <Text style={styles.altRouteDuration}>28 min</Text>
          </View>
          <View style={styles.altRouteRight}>
            <View style={styles.altRouteFeature}>
              <Icon name="leaf" size={14} color={routeTheme.colors.success} />
              <Text style={styles.altRouteFeatureText}>Low CO₂</Text>
            </View>
            <Icon name="chevron-right" size={20} color={routeTheme.colors.textSecondary} />
          </View>
        </TouchableOpacity>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: routeTheme.colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
  },
  altRoute: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: routeTheme.colors.surfaceVariant,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: routeTheme.colors.border,
  },
  altRouteLeft: {
    flex: 1,
  },
  altRouteTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: routeTheme.colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  altRouteDuration: {
    fontSize: 14,
    color: routeTheme.colors.textSecondary,
    fontFamily: 'Urbanist_400Regular',
  },
  altRouteRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  altRouteFeature: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  altRouteFeatureText: {
    fontSize: 12,
    color: routeTheme.colors.success,
    fontFamily: 'Urbanist_600SemiBold',
    marginLeft: 4,
  },
});
