import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/FontAwesome5';

const FILTERS = ['All Trips', 'This Week', 'This Month', 'Eco-Friendly'];
const SORTS = ['Date', 'Mode', 'Eco-Impact'];

const favoriteRoutes = [
  {
    id: 'fav1',
    from: 'Home',
    to: 'Office',
    eco: 95,
    duration: '25 min',
    modes: [
      { name: 'bicycle', color: '#10b981' },
      { name: 'train', color: '#6366f1' },
    ],
    gradient: ['#ede9fe', '#dbeafe'],
    border: '#ede9fe',
  },
  {
    id: 'fav2',
    from: 'Mall',
    to: 'Home',
    eco: 88,
    duration: '18 min',
    modes: [
      { name: 'bus', color: '#3b82f6' },
      { name: 'walking', color: '#64748b' },
    ],
    gradient: ['#dcfce7', '#d1fae5'],
    border: '#dcfce7',
  },
];

const tripHistory = [
  {
    id: '1',
    from: 'Downtown',
    to: 'Airport',
    date: 'Today, 2:30 PM',
    eco: 72,
    duration: '45 min',
    modes: [
      { name: 'car', color: '#64748b' },
    ],
    cost: '$12.50',
    ecoColor: '#fb923c',
    ecoBg: '#fef3c7',
  },
  {
    id: '2',
    from: 'Home',
    to: 'Gym',
    date: 'Yesterday, 6:00 AM',
    eco: 95,
    duration: '15 min',
    modes: [
      { name: 'bicycle', color: '#10b981' },
    ],
    cost: 'Free',
    ecoColor: '#22c55e',
    ecoBg: '#dcfce7',
  },
  {
    id: '3',
    from: 'Office',
    to: 'Restaurant',
    date: 'Yesterday, 7:30 PM',
    eco: 85,
    duration: '22 min',
    modes: [
      { name: 'train', color: '#6366f1' },
      { name: 'walking', color: '#64748b' },
    ],
    cost: '$3.25',
    ecoColor: '#3b82f6',
    ecoBg: '#dbeafe',
  },
  {
    id: '4',
    from: 'Mall',
    to: 'Park',
    date: 'Dec 22, 3:15 PM',
    eco: 92,
    duration: '12 min',
    modes: [
      { name: 'bus', color: '#3b82f6' },
    ],
    cost: '$2.75',
    ecoColor: '#22c55e',
    ecoBg: '#dcfce7',
  },
];

export default function TripsScreen() {
  const [filterIdx, setFilterIdx] = useState(0);
  const [sortIdx, setSortIdx] = useState(0);

  const handleFilter = () => setFilterIdx((filterIdx + 1) % FILTERS.length);
  const handleSort = () => setSortIdx((sortIdx + 1) % SORTS.length);

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Your Trips <Text style={{fontSize: 20}}>🗺️</Text></Text>
        <TouchableOpacity style={styles.headerBtn}>
          <Icon name="ellipsis-v" size={18} color="#64748b" />
        </TouchableOpacity>
      </View>
      {/* Filter/Sort */}
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
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Favorites */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Routes</Text>
            <Icon name="heart" solid size={18} color="#f87171" />
          </View>
          {favoriteRoutes.map(route => (
            <View key={route.id} style={[styles.favoriteCard, {borderColor: route.border, backgroundColor: route.gradient[0]}]}>
              <View style={styles.favoriteTopRow}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <Text style={styles.favoriteTrip}>{route.from} → {route.to}</Text>
                  <Icon name="star" solid size={12} color="#facc15" style={{marginLeft: 4}} />
                </View>
                <View style={styles.ecoBadge}><Text style={styles.ecoBadgeText}>{route.eco} Eco</Text></View>
              </View>
              <View style={styles.favoriteBottomRow}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  {route.modes.map((m, i) => (
                    <Icon key={i} name={m.name} size={16} color={m.color} style={{marginRight: 6}} />
                  ))}
                  <Text style={styles.favoriteDuration}>{route.duration}</Text>
                </View>
                <TouchableOpacity><Text style={styles.useRouteBtn}>Use Route</Text></TouchableOpacity>
              </View>
            </View>
          ))}
        </View>
        {/* Trip History */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <Text style={styles.sectionSubtitle}>24 trips this month</Text>
          </View>
          <FlatList
            data={tripHistory}
            keyExtractor={item => item.id}
            renderItem={({item}) => (
              <View style={[styles.tripCard, {borderColor: '#f1f5f9', backgroundColor: '#fff'}]}>
                <View style={styles.tripCardTop}>
                  <View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: 2}}>
                      <Text style={styles.tripFrom}>{item.from}</Text>
                      <Icon name="arrow-right" size={12} color="#64748b" style={{marginHorizontal: 4}} />
                      <Text style={styles.tripTo}>{item.to}</Text>
                    </View>
                    <Text style={styles.tripDate}>{item.date}</Text>
                  </View>
                  <View style={[styles.ecoBadge, {backgroundColor: item.ecoBg}]}> <Text style={[styles.ecoBadgeText, {color: item.ecoColor}]}>{item.eco} Eco</Text></View>
                </View>
                <View style={styles.tripCardBottom}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    {item.modes.map((m, i) => (
                      <Icon key={i} name={m.name} size={15} color={m.color} style={{marginRight: 4}} />
                    ))}
                    <Text style={styles.tripDuration}>{item.duration}</Text>
                    <Text style={styles.dot}>•</Text>
                    <Text style={styles.tripCost}>{item.cost}</Text>
                  </View>
                  <TouchableOpacity>
                    <Icon name="ellipsis-h" size={16} color="#185a9d" />
                  </TouchableOpacity>
                </View>
              </View>
            )}
            scrollEnabled={false}
            ItemSeparatorComponent={() => <View style={{height: 12}} />}
          />
          <TouchableOpacity style={styles.loadMoreBtn}><Text style={styles.loadMoreText}>Load More Trips</Text></TouchableOpacity>
        </View>
      </ScrollView>
      {/* Bottom Nav is handled by app navigation */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
    paddingTop: 48,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 8,
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 2,
    elevation: 2,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  headerBtn: {
    padding: 8,
    borderRadius: 999,
    backgroundColor: '#f1f5f9',
  },
  filterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
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
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 8,
  },
  filterBtnText: {
    color: '#64748b',
    fontSize: 14,
    fontWeight: '500',
  },
  section: {
    marginTop: 12,
    marginBottom: 8,
    paddingHorizontal: 20,
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
    color: '#1e293b',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    fontWeight: '400',
  },
  favoriteCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    marginBottom: 10,
  },
  favoriteTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 6,
  },
  favoriteTrip: {
    fontSize: 15,
    fontWeight: '500',
    color: '#1e293b',
  },
  ecoBadge: {
    backgroundColor: '#10b981',
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ecoBadgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  favoriteBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  favoriteDuration: {
    fontSize: 13,
    color: '#64748b',
    marginLeft: 4,
  },
  useRouteBtn: {
    color: '#6366f1',
    fontWeight: '600',
    fontSize: 14,
  },
  tripCard: {
    borderWidth: 1,
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#fff',
  },
  tripCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  tripFrom: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  tripTo: {
    fontSize: 14,
    fontWeight: '500',
    color: '#1e293b',
  },
  tripDate: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  tripCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripDuration: {
    fontSize: 12,
    color: '#64748b',
    marginLeft: 2,
  },
  dot: {
    fontSize: 14,
    color: '#64748b',
    marginHorizontal: 4,
  },
  tripCost: {
    fontSize: 12,
    color: '#64748b',
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
  },
}); 