import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

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
           <Icon name="refresh" size={Math.max(14, width * 0.035)} color="#6366f1" style={{ marginRight: Math.max(3, width * 0.008) }} />
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
                 <Icon name={t.icon} size={Math.max(18, width * 0.045)} color={t.color} style={{ marginRight: Math.max(4, width * 0.01) }} />
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
    marginBottom: Math.max(16, height * 0.02),
  },
  sectionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: Math.max(12, height * 0.015) 
  },
  sectionTitle: { 
    fontSize: Math.max(18, width * 0.045), 
    fontWeight: 'bold', 
    color: '#6366f1', 
    fontFamily: 'Poppins_700Bold', 
    letterSpacing: 0.2 
  },
  refreshBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    padding: Math.max(6, width * 0.015),
    backgroundColor: '#f8fafc',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0'
  },
  refreshText: { 
    color: '#6366f1', 
    fontWeight: '700', 
    fontFamily: 'Poppins_700Bold', 
    fontSize: Math.max(12, width * 0.03) 
  },
  trafficGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    gap: Math.max(8, width * 0.02),
  },
  trafficCard: { 
    width: (width - Math.max(60, width * 0.15)) / 2, 
    borderRadius: 16, 
    padding: Math.max(12, width * 0.03), 
    elevation: 2, 
    shadowColor: '#6366f1', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.08, 
    shadowRadius: 8, 
    marginBottom: Math.max(10, height * 0.012), 
    borderWidth: 1, 
    borderColor: '#E5E7EB',
    minHeight: Math.max(120, height * 0.15),
  },
  trafficHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: Math.max(8, height * 0.01),
    flexWrap: 'wrap',
  },
  trafficLevel: { 
    fontSize: Math.max(13, width * 0.032), 
    fontWeight: 'bold', 
    fontFamily: 'Poppins_700Bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  trafficPlace: { 
    fontSize: Math.max(11, width * 0.028), 
    color: '#64748b', 
    fontFamily: 'Urbanist_400Regular', 
    marginBottom: Math.max(8, height * 0.01),
    flexWrap: 'wrap',
  },
  trafficMeta: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    flexWrap: 'wrap',
    gap: Math.max(4, width * 0.01),
  },
  trafficChange: { 
    fontSize: Math.max(10, width * 0.025), 
    color: '#9ca3af', 
    fontFamily: 'Urbanist_400Regular',
    flex: 1,
    flexWrap: 'wrap',
  },
  trafficDelay: { 
    fontSize: Math.max(10, width * 0.025), 
    fontWeight: 'bold', 
    fontFamily: 'Poppins_700Bold',
    flexWrap: 'wrap',
    textAlign: 'right',
  },
});
