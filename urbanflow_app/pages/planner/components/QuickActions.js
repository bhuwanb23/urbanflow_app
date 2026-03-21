import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { ACTIONS } from '../constants/plannerConstants';

const { width } = Dimensions.get('window');

export default function QuickActions() {
  return (
    <View style={styles.quickActions}>
      <MotiView
        from={{ opacity: 0, translateX: -20 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'spring', damping: 12 }}
      >
        <Text style={styles.sectionTitle}>Quick Actions</Text>
      </MotiView>
      <View style={styles.actionGrid}>
        {ACTIONS.map((action, index) => (
          <MotiView
            key={index}
            from={{ opacity: 0, scale: 0.5, translateY: 20 }}
            animate={{ opacity: 1, scale: 1, translateY: 0 }}
            transition={{ 
              type: 'spring',
              damping: 12,
              delay: 200 + index * 100
            }}
          >
            <TouchableOpacity 
              key={index} 
              style={styles.actionCard}
              activeOpacity={0.6}
            >
              <MotiView
                from={{ scale: 0, rotate: '-180deg' }}
                animate={{ scale: 1, rotate: '0deg' }}
                transition={{ 
                  type: 'spring',
                  damping: 15,
                  delay: 300 + index * 100
                }}
              >
                <View style={styles.actionIcon}>
                  <Icon name={action.icon} size={24} color={action.color} />
                </View>
              </MotiView>
              <Text style={styles.actionText}>{action.name}</Text>
            </TouchableOpacity>
          </MotiView>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: (width - 60) / 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    fontFamily: 'Urbanist_400Regular',
  },
});
