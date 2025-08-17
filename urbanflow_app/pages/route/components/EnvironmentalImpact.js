import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function EnvironmentalImpact() {
  return (
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 600 }}>
      <View style={styles.ecoStats}>
        <View style={styles.ecoHeader}>
          <Icon name="leaf" size={20} color="#16a34a" />
          <Text style={styles.ecoTitle}>Environmental Impact</Text>
        </View>
        <View style={styles.ecoGrid}>
          <View style={styles.ecoItem}>
            <Text style={styles.ecoValue}>2.3kg</Text>
            <Text style={styles.ecoLabel}>CO₂ saved vs car</Text>
          </View>
          <View style={styles.ecoItem}>
            <Text style={styles.ecoValue}>85%</Text>
            <Text style={styles.ecoLabel}>Public transport</Text>
          </View>
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  ecoStats: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  ecoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ecoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    fontFamily: 'Poppins_700Bold',
    marginLeft: 8,
  },
  ecoGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  ecoItem: {
    flex: 1,
    alignItems: 'center',
  },
  ecoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
    fontFamily: 'Poppins_700Bold',
  },
  ecoLabel: {
    fontSize: 12,
    color: '#15803d',
    fontFamily: 'Urbanist_400Regular',
  },
});
