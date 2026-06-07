import React from 'react';
import { Text, StyleSheet, TouchableOpacity, ScrollView, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MODES } from '../constants/plannerConstants';

const { _width } = Dimensions.get('window');

export default function ModeFilters({ selectedMode, setSelectedMode }) {
  return (
    <ScrollView 
      horizontal 
      showsHorizontalScrollIndicator={false} 
      style={styles.modeScroll} 
      contentContainerStyle={{ paddingVertical: 4 }}
    >
      {MODES.map((mode) => (
        <TouchableOpacity
          key={mode.key}
          style={[styles.filterChip, selectedMode === mode.key ? styles.filterChipActive : null]}
          onPress={() => setSelectedMode(mode.key)}
        >
          <Icon name={mode.icon} size={18} color={selectedMode === mode.key ? '#FFFFFF' : '#64748B'} />
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
    backgroundColor: '#F8FAFC', // Slate 50
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 9999,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Slate 200
  },
  filterChipActive: {
    backgroundColor: '#10B981', // Emerald 500
    borderColor: '#10B981',
  },
  filterChipText: {
    marginLeft: 8,
    fontSize: 14,
    color: '#64748B', // Slate 500
    fontFamily: 'Urbanist_600SemiBold',
  },
  filterChipTextActive: {
    color: '#FFFFFF',
  },
});
