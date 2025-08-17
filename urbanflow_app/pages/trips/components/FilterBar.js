import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const FILTERS = ['All Trips', 'This Week', 'This Month', 'Eco-Friendly'];
const SORTS = ['Date', 'Mode', 'Eco-Impact'];

export default function FilterBar({ filterIdx, setFilterIdx, sortIdx, setSortIdx }) {
  const handleFilter = () => setFilterIdx((filterIdx + 1) % FILTERS.length);
  const handleSort = () => setSortIdx((sortIdx + 1) % SORTS.length);

  return (
    <View style={styles.filterRow}>
      <TouchableOpacity style={styles.filterActive} onPress={handleFilter}>
        <Text style={styles.filterActiveText}>{FILTERS[filterIdx]}</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterBtn} onPress={handleFilter}>
        <Icon name="filter" size={14} color="#64748b" style={{marginRight: 4}} />
        <Text style={styles.filterBtnText}>Filter</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.filterBtn} onPress={handleSort}>
        <Icon name="sort" size={14} color="#64748b" style={{marginRight: 4}} />
        <Text style={styles.filterBtnText}>Sort</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: width * 0.05,
    marginBottom: 8,
    marginTop: 8,
  },
  filterActive: {
    flex: 1,
    backgroundColor: '#6366f1',
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
    alignItems: 'center',
  },
  filterActiveText: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#E5E7EB',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  filterBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
    fontFamily: 'Urbanist_400Regular',
  },
});
