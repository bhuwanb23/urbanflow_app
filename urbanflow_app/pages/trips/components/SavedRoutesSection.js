import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import FavoriteRouteCard from './FavoriteRouteCard';

const { width } = Dimensions.get('window');

export default function SavedRoutesSection({ favoriteRoutes }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Saved Routes</Text>
        <Icon name="heart" size={18} color="#f87171" />
      </View>
      {favoriteRoutes.map(route => (
        <FavoriteRouteCard key={route.id} route={route} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: width * 0.05,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
});
