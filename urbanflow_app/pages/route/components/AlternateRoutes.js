import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function AlternateRoutes({ onViewAlternatives }) {
  return (
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 800 }}>
      <TouchableOpacity style={styles.alternateButton} onPress={onViewAlternatives}>
        <Text style={styles.alternateButtonText}>View 2 Alternate Routes</Text>
        <Icon name="chevron-right" size={20} color="#9ca3af" />
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  alternateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  alternateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
    fontFamily: 'Urbanist_400Regular',
  },
});
