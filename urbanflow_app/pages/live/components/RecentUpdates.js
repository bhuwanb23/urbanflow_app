import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const recentUpdates = [
  { 
    icon: 'alert-circle', 
    color: '#ef4444', 
    bg: '#fee2e2', 
    title: 'Accident Reported', 
    desc: 'Major intersection at Park Road and Main Street', 
    time: '2 minutes ago', 
    impact: 'Severe impact', 
    impactColor: '#ef4444', 
    impactIcon: 'alert' 
  },
  { 
    icon: 'tools', 
    color: '#facc15', 
    bg: '#fef9c3', 
    title: 'New Construction Zone', 
    desc: 'Highway 101 southbound near exit 25', 
    time: '15 minutes ago', 
    impact: 'Moderate delay', 
    impactColor: '#facc15', 
    impactIcon: 'clock-outline' 
  },
  { 
    icon: 'check-circle', 
    color: '#22c55e', 
    bg: '#bbf7d0', 
    title: 'Road Cleared', 
    desc: 'Downtown expressway now open after earlier incident', 
    time: '28 minutes ago', 
    impact: 'Traffic normalizing', 
    impactColor: '#22c55e', 
    impactIcon: 'check-circle' 
  },
];

export default function RecentUpdates() {
  const handleUpdatePress = (update) => {
    console.log('Update pressed:', update.title);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Updates</Text>
      {recentUpdates.map((u, i) => (
        <MotiView 
          key={i} 
          from={{ opacity: 0, translateY: 20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ type: 'timing', delay: 400 + i * 100 }}
        >
          <TouchableOpacity 
            style={styles.updateCard} 
            onPress={() => handleUpdatePress(u)}
            activeOpacity={0.7}
          >
            <View style={styles.updateContent}>
              <View style={[styles.updateIconWrap, { backgroundColor: u.bg }]}> 
                <Icon name={u.icon} size={22} color={u.color} />
              </View>
              <View style={styles.updateInfo}>
                <Text style={styles.updateTitle}>{u.title}</Text>
                <Text style={styles.updateDesc}>{u.desc}</Text>
                <View style={styles.updateMetaRow}>
                  <Text style={styles.updateTime}>{u.time}</Text>
                  <View style={styles.impactContainer}>
                    <Text style={[styles.updateImpact, { color: u.impactColor }]}>
                      {u.impact}
                    </Text>
                    <Icon 
                      name={u.impactIcon} 
                      size={16} 
                      color={u.impactColor} 
                      style={{ marginLeft: 4 }} 
                    />
                  </View>
                </View>
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
  updateCard: { 
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
  updateContent: {
    flexDirection: 'row', 
    alignItems: 'flex-start' 
  },
  updateIconWrap: { 
    width: 48, 
    height: 48, 
    borderRadius: 24, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 16 
  },
  updateInfo: {
    flex: 1 
  },
  updateTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#6366f1', 
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4 
  },
  updateDesc: { 
    fontSize: 14, 
    color: '#64748b', 
    fontFamily: 'Urbanist_400Regular', 
    marginBottom: 8,
    lineHeight: 20 
  },
  updateMetaRow: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    justifyContent: 'space-between' 
  },
  updateTime: { 
    fontSize: 13, 
    color: '#9ca3af', 
    fontFamily: 'Urbanist_400Regular' 
  },
  impactContainer: {
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  updateImpact: { 
    fontSize: 13, 
    fontWeight: 'bold', 
    fontFamily: 'Poppins_700Bold' 
  },
});
