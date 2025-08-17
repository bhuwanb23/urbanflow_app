import React from 'react';
import { View, TextInput, StyleSheet, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

export default function SearchBar() {
  return (
    <MotiView 
      from={{ opacity: 0, translateY: -20 }} 
      animate={{ opacity: 1, translateY: 0 }} 
      transition={{ type: 'timing', duration: 700 }}
    >
      <View style={styles.searchBar}>
        <Icon name="map-marker" size={20} color="#6366f1" style={{ marginRight: 8 }} />
        <TextInput
          placeholder="Search destinations..."
          style={styles.searchInput}
          placeholderTextColor="#9ca3af"
        />
        <Icon name="microphone" size={20} color="#9ca3af" style={{ marginLeft: 8 }} />
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
    fontFamily: 'Urbanist_400Regular',
  },
});
