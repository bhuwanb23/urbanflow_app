import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Dimensions } from 'react-native';
import TripHistoryCard from './TripHistoryCard';

const { width } = Dimensions.get('window');

export default function RecentTripsSection({ tripHistory }) {
  return (
    <View style={styles.section}>
      <View style={styles.sectionHeader}>
        <Text style={styles.sectionTitle}>Recent Trips</Text>
        <Text style={styles.sectionSubtitle}>24 trips this month</Text>
      </View>
      <FlatList
        data={tripHistory}
        keyExtractor={item => item.id}
        renderItem={({item}) => <TripHistoryCard item={item} />}
        scrollEnabled={false}
        ItemSeparatorComponent={() => <View style={{height: 12}} />}
      />
      <TouchableOpacity style={styles.loadMoreBtn}>
        <Text style={styles.loadMoreText}>Load More Trips</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  section: {
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: width * 0.05,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#6B7280',
    fontWeight: '400',
    fontFamily: 'Urbanist_400Regular',
  },
  loadMoreBtn: {
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 16,
  },
  loadMoreText: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
});
