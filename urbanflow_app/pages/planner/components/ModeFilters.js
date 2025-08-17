import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MODES } from '../constants/plannerConstants';

const { width } = Dimensions.get('window');

export default function ModeFilters({ selectedMode, setSelectedMode }) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.modeScroll} 
      contentContainerStyle={{ paddingVertical: 8 }}
    >
      {MODES.map((mode) => (
        <TouchableOpacity
          key={mode.key}
          style={[styles.filterChip, selectedMode === mode.key ? styles.filterChipActive : null]}
          onPress={() => setSelectedMode(mode.key)}
        >
          <Icon name={mode.icon} size={16} color={selectedMode === mode.key ? '#fff' : '#6366f1'} />
          <Text style={[styles.filterChipText, selectedMode === mode.key ? styles.filterChipTextActive : null]}>
            {mode.label}
          </Text>
        </TouchableOpacity>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  modeScroll: {
    marginBottom: 24,
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  filterChipActive: {
    backgroundColor: '#6366f1',
  },
  filterChipText: {
    marginLeft: 6,
    fontSize: 14,
    color: '#6366f1',
    fontWeight: '500',
    fontFamily: 'Urbanist_400Regular',
  },
  filterChipTextActive: {
    color: '#fff',
  },
});
