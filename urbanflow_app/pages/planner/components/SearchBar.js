import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { _width } = Dimensions.get('window');

export default function SearchBar() {
  return (
    <MotiView 
      from={{ opacity: 0, translateY: -20 }} 
      animate={{ opacity: 1, translateY: 0 }} 
      transition={{ type: 'timing', duration: 700 }}
    >
      <View style={styles.searchBar}>
        <Icon name="map-marker" size={20} color="#10B981" style={{ marginRight: 12 }} />
        <TextInput
          placeholder="Search destinations..."
          style={styles.searchInput}
          placeholderTextColor="#94A3B8"
        />
        <Icon name="microphone" size={20} color="#64748B" style={{ marginLeft: 12 }} />
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // Slate 50
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 14,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Slate 200
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#0F172A', // Slate 900
    fontFamily: 'Urbanist_400Regular',
  },
});
