import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const transitStatus = [
  { 
    icon: 'train', 
    color: '#6366f1', 
    bg: '#e0e7ff', 
    title: 'Metro Line A', 
    status: 'On time', 
    statusColor: '#22c55e', 
    statusBg: '#bbf7d0', 
    desc: 'Next train in 4 minutes' 
  },
  { 
    icon: 'bus', 
    color: '#10b981', 
    bg: '#d1fae5', 
    title: 'Bus Route 42', 
    status: 'Slight delay', 
    statusColor: '#facc15', 
    statusBg: '#fef9c3', 
    desc: 'Next bus in 8 minutes' 
  },
  { 
    icon: 'tram', 
    color: '#ef4444', 
    bg: '#fee2e2', 
    title: 'Tram Line 3', 
    status: 'Disrupted', 
    statusColor: '#ef4444', 
    statusBg: '#fee2e2', 
    desc: 'Service suspended due to maintenance' 
  },
];

export default function TransitStatus() {
  const handleTransitPress = (transit) => {
    console.log('Transit pressed:', transit.title);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Transit Status</Text>
      {transitStatus.map((t, i) => (
        <MotiView 
          key={i} 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ type: 'timing', delay: 800 + i * 100 }}
        >
          <TouchableOpacity 
            style={styles.transitCard} 
            onPress={() => handleTransitPress(t)}
            activeOpacity={0.7}
          >
            <View style={styles.transitContent}>
              <View style={[styles.transitIconWrap, { backgroundColor: t.bg }]}> 
                <Icon name={t.icon} size={22} color={t.color} />
              </View>
              <View style={styles.transitInfo}>
                <View style={styles.transitHeaderRow}>
                  <Text style={styles.transitTitle}>{t.title}</Text>
                  <View style={[styles.transitStatus, { backgroundColor: t.statusBg }]}> 
                    <Text style={[styles.transitStatusText, { color: t.statusColor }]}>
                      {t.status}
                    </Text>
                  </View>
                </View>
                <Text style={styles.transitDesc}>{t.desc}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </MotiView>
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    color: '#6366f1', 
    fontFamily: 'Poppins_700Bold', 
    letterSpacing: 0.2 
  },
  transitCard: { 
    borderRadius: 18, 
    backgroundColor: '#fff', 
    elevation: 2, 
    shadowColor: '#0EA5E9', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.10, 
    shadowRadius: 10, 
    padding: 16, 
    marginBottom: 14, 
    borderWidth: 1, 
    borderColor: '#E5E7EB' 
  },
  transitContent: {
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  transitIconWrap: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  transitInfo: {
    flex: 1 
  },
  transitHeaderRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between',
    marginBottom: 4 
  },
  transitTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#6366f1', 
    fontFamily: 'Poppins_700Bold' 
  },
  transitStatus: { 
    borderRadius: 10, 
    paddingHorizontal: 8, 
    paddingVertical: 2, 
    marginLeft: 8 
  },
  transitStatusText: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    fontFamily: 'Poppins_700Bold' 
  },
  transitDesc: { 
    fontSize: 14, 
    color: '#64748b', 
    fontFamily: 'Urbanist_400Regular', 
    lineHeight: 20 
  },
});
