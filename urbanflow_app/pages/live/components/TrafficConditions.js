import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const trafficConditions = [
  { 
    level: 'High Traffic', 
    icon: 'trending-up', 
    color: '#ef4444', 
    place: 'Main Highway', 
    change: '+28% than usual', 
    delay: '45 min delay', 
    delayColor: '#ef4444',
    bg: '#fef2f2'
  },
  { 
    level: 'Moderate', 
    icon: 'trending-flat', 
    color: '#facc15', 
    place: 'City Center', 
    change: 'Normal flow', 
    delay: '15 min delay', 
    delayColor: '#facc15',
    bg: '#fffbeb'
  },
  { 
    level: 'Light Traffic', 
    icon: 'trending-down', 
    color: '#22c55e', 
    place: 'Residential Areas', 
    change: '-10% than usual', 
    delay: 'No delays', 
    delayColor: '#22c55e',
    bg: '#f0fdf4'
  },
  { 
    level: 'Road Work', 
    icon: 'information', 
    color: '#3b82f6', 
    place: 'West Boulevard', 
    change: 'Lane closed', 
    delay: 'Avoid if possible', 
    delayColor: '#3b82f6',
    bg: '#eff6ff'
  },
];

export default function TrafficConditions() {
  const handleRefresh = () => {
    console.log('Refresh traffic conditions');
  };

  return (
    <View style={styles.container}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Traffic Conditions</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh}>
          <Icon name="refresh" size={16} color="#6366f1" style={{ marginRight: 4 }} />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.trafficGrid}>
        {trafficConditions.map((t, i) => (
          <MotiView 
            key={i} 
            from={{ opacity: 0, translateY: 20 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            transition={{ type: 'timing', delay: 200 + i * 80 }}
          >
            <View style={[styles.trafficCard, { backgroundColor: t.bg }]}>
              <View style={styles.trafficHeader}>
                <Icon name={t.icon} size={22} color={t.color} style={{ marginRight: 6 }} />
                <Text style={[styles.trafficLevel, { color: t.color }]}>{t.level}</Text>
              </View>
              <Text style={styles.trafficPlace}>{t.place}</Text>
              <View style={styles.trafficMeta}>
                <Text style={styles.trafficChange}>{t.change}</Text>
                <Text style={[styles.trafficDelay, { color: t.delayColor }]}>{t.delay}</Text>
              </View>
            </View>
          </MotiView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    color: '#6366f1', 
    fontFamily: 'Poppins_700Bold', 
    letterSpacing: 0.2 
  },
  refreshBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: 8,
    backgroundColor: '#f8fafc',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  refreshText: { 
    color: '#6366f1', 
    fontWeight: '700', 
    fontFamily: 'Poppins_700Bold', 
    fontSize: 14 
  },
  trafficGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between' 
  },
  trafficCard: { 
    width: (width - 48) / 2, 
    borderRadius: 18, 
    padding: 16, 
    elevation: 2, 
    shadowColor: '#0EA5E9', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.10, 
    shadowRadius: 10, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  trafficHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8 
  },
  trafficLevel: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    fontFamily: 'Poppins_700Bold' 
  },
  trafficPlace: { 
    fontSize: 14, 
    color: '#64748b', 
    fontFamily: 'Urbanist_400Regular', 
    marginBottom: 8 
  },
  trafficMeta: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'center' 
  },
  trafficChange: { 
    fontSize: 13, 
    color: '#9ca3af', 
    fontFamily: 'Urbanist_400Regular' 
  },
  trafficDelay: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    fontFamily: 'Poppins_700Bold' 
  },
});
