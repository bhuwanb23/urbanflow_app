import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function QuickActions({ onStartRoute, onSaveRoute, onShareRoute }) {
  return (
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 1000 }}>
      <View style={styles.quickActions}>
        <TouchableOpacity style={styles.primaryAction} onPress={onStartRoute}>
          <Icon name="play" size={20} color="#fff" />
          <Text style={styles.primaryActionText}>Start</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryAction} onPress={onSaveRoute}>
          <Icon name="bookmark-outline" size={20} color="#64748b" />
          <Text style={styles.secondaryActionText}>Save</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryAction} onPress={onShareRoute}>
          <Icon name="share-variant-outline" size={20} color="#64748b" />
          <Text style={styles.secondaryActionText}>Share</Text>
        </TouchableOpacity>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  quickActions: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20, // Add bottom margin to prevent overlap
  },
  primaryAction: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    fontFamily: 'Urbanist_400Regular',
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
});
