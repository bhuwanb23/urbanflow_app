import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const recentUpdates = [
  { 
    icon: 'alert-circle', 
    color: '#EF4444', 
    bg: '#FEF2F2', 
    title: 'Accident Reported', 
    desc: 'Major intersection at Park Road and Main Street', 
    time: '2 minutes ago', 
    impact: 'Severe impact', 
    impactColor: '#EF4444', 
    impactIcon: 'alert' 
  },
  { 
    icon: 'tools', 
    color: '#F59E0B', 
    bg: '#FFFBEB', 
    title: 'New Construction Zone', 
    desc: 'Highway 101 southbound near exit 25', 
    time: '15 minutes ago', 
    impact: 'Moderate delay', 
    impactColor: '#F59E0B', 
    impactIcon: 'clock-outline' 
  },
  { 
    icon: 'check-circle', 
    color: '#10B981', 
    bg: '#ECFDF5', 
    title: 'Road Cleared', 
    desc: 'Downtown expressway now open after earlier incident', 
    time: '28 minutes ago', 
    impact: 'Traffic normalizing', 
    impactColor: '#10B981', 
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
                      size={14} 
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
    fontSize: 18, 
    fontWeight: 'bold', 
    marginBottom: 16, 
    color: '#0F172A', // Slate 900
    fontFamily: 'Poppins_700Bold', 
    letterSpacing: -0.5 
  },
  updateCard: { 
    borderRadius: 16, 
    backgroundColor: '#FFFFFF', 
    padding: 16, 
    marginBottom: 12, 
    borderWidth: 1, 
    borderColor: '#F1F5F9', // Slate 100
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  updateContent: {
    flexDirection: 'row', 
    alignItems: 'flex-start' 
  },
  updateIconWrap: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginRight: 14 
  },
  updateInfo: {
    flex: 1 
  },
  updateTitle: { 
    fontSize: 16, 
    fontWeight: 'bold', 
    color: '#0F172A', // Slate 900
    fontFamily: 'Urbanist_700Bold',
    marginBottom: 4 
  },
  updateDesc: { 
    fontSize: 14, 
    color: '#64748B', // Slate 500
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
    fontSize: 12, 
    color: '#94A3B8', // Slate 400
    fontFamily: 'Urbanist_400Regular' 
  },
  impactContainer: {
    flexDirection: 'row', 
    alignItems: 'center' 
  },
  updateImpact: { 
    fontSize: 12, 
    fontWeight: 'bold', 
    fontFamily: 'Urbanist_700Bold' 
  },
});
