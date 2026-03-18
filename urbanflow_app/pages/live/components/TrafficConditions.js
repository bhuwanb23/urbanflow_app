import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

const trafficConditions = [
  { 
    level: 'High Traffic', 
    icon: 'trending-up', 
    color: '#EF4444', // Red 500
    place: 'Main Highway', 
    change: '+28% than usual', 
    delay: '45 min delay', 
    delayColor: '#EF4444',
    bg: '#FEF2F2', // Red 50
    borderColor: '#FECACA' // Red 200
  },
  { 
    level: 'Moderate', 
    icon: 'trending-flat', 
    color: '#F59E0B', // Amber 500
    place: 'City Center', 
    change: 'Normal flow', 
    delay: '15 min delay', 
    delayColor: '#F59E0B',
    bg: '#FFFBEB', // Amber 50
    borderColor: '#FDE68A' // Amber 200
  },
  { 
    level: 'Light Traffic', 
    icon: 'trending-down', 
    color: '#10B981', // Emerald 500
    place: 'Residential Areas', 
    change: '-10% than usual', 
    delay: 'No delays', 
    delayColor: '#10B981',
    bg: '#ECFDF5', // Emerald 50
    borderColor: '#A7F3D0' // Emerald 200
  },
  { 
    level: 'Road Work', 
    icon: 'information', 
    color: '#3B82F6', // Blue 500
    place: 'West Boulevard', 
    change: 'Lane closed', 
    delay: 'Avoid if possible', 
    delayColor: '#3B82F6',
    bg: '#EFF6FF', // Blue 50
    borderColor: '#BFDBFE' // Blue 200
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
           <Icon name="refresh" size={16} color="#10B981" style={{ marginRight: 4 }} />
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
            <View style={[styles.trafficCard, { backgroundColor: t.bg, borderColor: t.borderColor }]}>
               <View style={styles.trafficHeader}>
                 <Icon name={t.icon} size={20} color={t.color} style={{ marginRight: 6 }} />
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
    marginBottom: 24,
  },
  sectionRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between', 
    marginBottom: 16 
  },
  sectionTitle: { 
    fontSize: 18, 
    fontWeight: 'bold', 
    color: '#0F172A', // Slate 900
    fontFamily: 'Poppins_700Bold', 
    letterSpacing: -0.5 
  },
  refreshBtn: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ECFDF5', // Emerald 50
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5' // Emerald 100
  },
  refreshText: { 
    color: '#059669', // Emerald 600
    fontWeight: '700', 
    fontFamily: 'Urbanist_600SemiBold', 
    fontSize: 12 
  },
  trafficGrid: { 
    flexDirection: 'row', 
    flexWrap: 'wrap', 
    justifyContent: 'space-between',
    gap: 12,
  },
  trafficCard: { 
    width: (width - 48 - 12) / 2, // Width - padding - gap / 2
    borderRadius: 16, 
    padding: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    // Shadow removed for cleaner look, relying on color backgrounds
  },
  trafficHeader: {
    flexDirection: 'row', 
    alignItems: 'center', 
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  trafficLevel: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    fontFamily: 'Poppins_700Bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  trafficPlace: { 
    fontSize: 12, 
    color: '#64748B', // Slate 500
    fontFamily: 'Urbanist_600SemiBold', 
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  trafficMeta: { 
    flexDirection: 'column', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start',
    gap: 4,
  },
  trafficChange: { 
    fontSize: 10, 
    color: '#94A3B8', // Slate 400
    fontFamily: 'Urbanist_400Regular',
  },
  trafficDelay: { 
    fontSize: 10, 
    fontWeight: 'bold', 
    fontFamily: 'Urbanist_700Bold',
  },
});
