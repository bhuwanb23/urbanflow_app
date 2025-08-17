import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function FavoriteRouteCard({ route }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: -20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ type: 'timing', duration: 500 }}
      style={[styles.favoriteCard, {borderColor: route.border, backgroundColor: route.gradient[0]}]}>
      <View style={styles.favoriteTopRow}>
        <View style={styles.routeInfo}>
          <Text style={styles.favoriteTrip}>{route.from} → {route.to}</Text>
          <Icon name="star" size={12} color="#facc15" style={{marginLeft: 4}} />
        </View>
        <View style={styles.ecoBadge}>
          <Text style={styles.ecoBadgeText}>{route.eco} Eco</Text>
        </View>
      </View>
      <View style={styles.favoriteBottomRow}>
        <View style={styles.modeInfo}>
          {route.modes.map((m, i) => (
            <Icon key={i} name={m.name} size={16} color={m.color} style={{marginRight: 6}} />
          ))}
          <Text style={styles.favoriteDuration}>{route.duration}</Text>
        </View>
        <TouchableOpacity>
          <Text style={styles.useRouteBtn}>Use Route</Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  favoriteCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
  },
  favoriteTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteTrip: {
    fontSize: 15,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  ecoBadge: {
    backgroundColor: '#10b981',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat_700Bold',
  },
  favoriteBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteDuration: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
    fontFamily: 'Urbanist_400Regular',
  },
  useRouteBtn: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
});
