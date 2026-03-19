import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Dimensions, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView, AnimatePresence } from 'moti';

const { width, height } = Dimensions.get('window');

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
      { name: 'bike', color: '#10B981' }, // Emerald 500
      { name: 'train', color: '#0F172A' }, // Slate 900
    ],
    bg: '#ECFDF5', // Emerald 50
    border: '#A7F3D0', // Emerald 200
  },
  {
    id: 'fav2',
    from: 'Mall',
    to: 'Home',
    eco: 88,
    duration: '18 min',
    modes: [
      { name: 'bus', color: '#3B82F6' }, // Blue 500
      { name: 'walk', color: '#64748B' }, // Slate 500
    ],
    bg: '#F8FAFC', // Slate 50
    border: '#E2E8F0', // Slate 200
  },
];

const MOCK_TRIPS = [
  {
    id: 't1',
    from: 'Home',
    to: 'City Center',
    date: 'Today, 10:30 AM',
    duration: '45 min',
    cost: '$2.50',
    eco: 12,
    ecoBg: '#DEF7EC', // Green 100
    ecoColor: '#059669', // Emerald 600
    modes: [{ name: 'bus', color: '#3B82F6' }, { name: 'walk', color: '#64748B' }],
  },
  {
    id: 't2',
    from: 'Office',
    to: 'Gym',
    date: 'Yesterday, 6:00 PM',
    duration: '15 min',
    cost: 'Free',
    eco: 5,
    ecoBg: '#DEF7EC',
    ecoColor: '#059669',
    modes: [{ name: 'bike', color: '#10B981' }],
  },
  {
    id: 't3',
    from: 'Gym',
    to: 'Home',
    date: 'Yesterday, 7:30 PM',
    duration: '20 min',
    cost: '$1.20',
    eco: 8,
    ecoBg: '#F1F5F9', // Slate 100
    ecoColor: '#475569', // Slate 600
    modes: [{ name: 'train', color: '#0F172A' }],
  },
];

export default function TripsScreen({ navigation }) {
  const [selectedFilter, setSelectedFilter] = useState('All Trips');
  const [selectedSort, setSelectedSort] = useState('Date');
  const [filterIdx, setFilterIdx] = useState(0);
  const [sortIdx, setSortIdx] = useState(0);
  const [tripHistory, setTripHistory] = useState(MOCK_TRIPS);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleFilter = () => setFilterIdx((filterIdx + 1) % FILTERS.length);
  const handleSort = () => setSortIdx((sortIdx + 1) % SORTS.length);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
      {/* Clean Header */}
      <View style={styles.headerContainer}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>
              Your Trips <Text style={{ fontSize: 24 }}>🗺️</Text>
            </Text>
            <Text style={styles.headerSubtitle}>Track your journey history</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('NotificationsScreen')}>
              <Icon name="bell-outline" size={20} color="#0F172A" />
              <View style={styles.notificationDot} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
      
      {/* Filter/Sort Bar */}
      <View style={styles.filterContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.filterScroll}>
          <TouchableOpacity style={styles.filterActive} onPress={handleFilter}>
            <Text style={styles.filterActiveText}>{FILTERS[filterIdx]}</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={handleFilter}>
            <Icon name="filter-variant" size={16} color="#64748B" style={{marginRight: 6}} />
            <Text style={styles.filterBtnText}>Filter</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.filterBtn} onPress={handleSort}>
            <Icon name="sort" size={16} color="#64748B" style={{marginRight: 6}} />
            <Text style={styles.filterBtnText}>{SORTS[sortIdx]}</Text>
          </TouchableOpacity>
        </ScrollView>
      </View>
      
      <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
        {/* Saved Routes Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Saved Routes</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See All</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.favoritesGrid}>
            {favoriteRoutes.map((route, index) => (
              <MotiView
                key={route.id}
                from={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', delay: index * 100 }}
                style={[styles.favoriteCard, {borderColor: route.border, backgroundColor: route.bg}]}
              >
                <View style={styles.favoriteTopRow}>
                  <View style={styles.routeInfo}>
                    <Text style={styles.favoriteTrip} numberOfLines={1}>{route.from}</Text>
                    <Icon name="arrow-right" size={14} color="#64748B" style={{marginHorizontal: 4}} />
                    <Text style={styles.favoriteTrip} numberOfLines={1}>{route.to}</Text>
                  </View>
                  <Icon name="heart" size={16} color="#EF4444" />
                </View>
                <View style={styles.favoriteBottomRow}>
                  <View style={styles.modeInfo}>
                    {route.modes.map((m, i) => (
                      <Icon key={i} name={m.name} size={18} color={m.color} style={{marginRight: 8}} />
                    ))}
                    <Text style={styles.favoriteDuration}>{route.duration}</Text>
                  </View>
                  <TouchableOpacity style={styles.goBtn}>
                    <Text style={styles.goBtnText}>GO</Text>
                  </TouchableOpacity>
                </View>
              </MotiView>
            ))}
          </View>
        </View>
        
        {/* Trip History Section */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Recent Trips</Text>
            <Text style={styles.sectionSubtitle}>24 trips this month</Text>
          </View>
          <View style={styles.timelineContainer}>
            {tripHistory.map((item, index) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 400, delay: index * 150 }}
                style={styles.timelineItem}
              >
                {/* Timeline Dot & Line */}
                <View style={styles.timelineGraphic}>
                  <View style={styles.timelineDot} />
                  {index < tripHistory.length - 1 && <View style={styles.timelineLine} />}
                </View>

                {/* Trip Card */}
                <View style={styles.tripCard}>
                  <View style={styles.tripCardTop}>
                    <View style={styles.tripInfo}>
                      <View style={styles.routeDisplay}>
                        <Text style={styles.tripFrom}>{item.from}</Text>
                        <Icon name="arrow-right" size={14} color="#94A3B8" style={{marginHorizontal: 6}} />
                        <Text style={styles.tripTo}>{item.to}</Text>
                      </View>
                      <Text style={styles.tripDate}>{item.date}</Text>
                    </View>
                    <View style={[styles.ecoBadge, {backgroundColor: item.ecoBg}]}>
                      <Icon name="leaf" size={12} color={item.ecoColor} style={{marginRight: 4}} />
                      <Text style={[styles.ecoBadgeText, {color: item.ecoColor}]}>{item.eco}</Text>
                    </View>
                  </View>
                  
                  <View style={styles.tripDivider} />
                  
                  <View style={styles.tripCardBottom}>
                    <View style={styles.tripDetails}>
                      <View style={styles.modesContainer}>
                        {item.modes.map((m, i) => (
                          <View key={i} style={styles.modeIconWrapper}>
                            <Icon name={m.name} size={14} color={m.color} />
                          </View>
                        ))}
                      </View>
                      <Text style={styles.tripDuration}>{item.duration}</Text>
                      <Text style={styles.dot}>•</Text>
                      <Text style={styles.tripCost}>{item.cost}</Text>
                    </View>
                    <TouchableOpacity style={styles.moreBtn}>
                      <Icon name="chevron-right" size={20} color="#94A3B8" />
                    </TouchableOpacity>
                  </View>
                </View>
              </MotiView>
            ))}
          </View>
          
          <TouchableOpacity style={styles.loadMoreBtn}>
            <Text style={styles.loadMoreText}>View All History</Text>
            <Icon name="arrow-down" size={16} color="#10B981" style={{marginLeft: 4}} />
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 20 : 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
  },
  headerRight: {
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A',
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Urbanist_400Regular',
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  notificationDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#EF4444',
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  filterContainer: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  filterScroll: {
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  filterActive: {
    backgroundColor: '#10B981',
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 999,
    marginRight: 12,
    alignItems: 'center',
  },
  filterActiveText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14,
    fontFamily: 'Urbanist_700Bold',
  },
  filterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 999,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  filterBtnText: {
    color: '#64748B',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Urbanist_600SemiBold',
  },
  scrollContent: {
    paddingBottom: 40,
    paddingTop: 16,
  },
  section: {
    marginBottom: 24,
    paddingHorizontal: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: -0.5,
  },
  sectionSubtitle: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Urbanist_400Regular',
  },
  seeAllText: {
    fontSize: 14,
    color: '#10B981',
    fontFamily: 'Urbanist_700Bold',
  },
  favoritesGrid: {
    flexDirection: 'column',
    gap: 12,
  },
  favoriteCard: {
    borderWidth: 1,
    borderRadius: 16,
    padding: 16,
  },
  favoriteTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  routeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    paddingRight: 12,
  },
  favoriteTrip: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'Urbanist_700Bold',
    flexShrink: 1,
  },
  favoriteBottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  modeInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  favoriteDuration: {
    fontSize: 14,
    color: '#475569',
    marginLeft: 4,
    fontFamily: 'Urbanist_600SemiBold',
  },
  goBtn: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 999,
    borderWidth: 1,
    borderColor: '#D1FAE5', // Emerald 100
  },
  goBtnText: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 12,
    fontFamily: 'Poppins_700Bold',
  },
  timelineContainer: {
    marginTop: 8,
  },
  timelineItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  timelineGraphic: {
    width: 24,
    alignItems: 'center',
    marginRight: 12,
  },
  timelineDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
    borderWidth: 3,
    borderColor: '#ECFDF5',
    marginTop: 24,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: '#E2E8F0',
    marginTop: 4,
    marginBottom: -24, // Connect to next dot
  },
  tripCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    borderRadius: 16,
    padding: 16,
    backgroundColor: '#FFFFFF',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  tripCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  tripInfo: {
    flex: 1,
  },
  routeDisplay: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  tripFrom: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'Urbanist_700Bold',
  },
  tripTo: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'Urbanist_700Bold',
  },
  tripDate: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: 'Urbanist_400Regular',
  },
  ecoBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  ecoBadgeText: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_700Bold',
  },
  tripDivider: {
    height: 1,
    backgroundColor: '#F1F5F9',
    marginVertical: 12,
  },
  tripCardBottom: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  modesContainer: {
    flexDirection: 'row',
    marginRight: 8,
  },
  modeIconWrapper: {
    backgroundColor: '#F8FAFC',
    width: 24,
    height: 24,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: -4, // Overlap slightly
    borderWidth: 1,
    borderColor: '#FFFFFF',
  },
  tripDuration: {
    fontSize: 13,
    color: '#0F172A',
    fontWeight: '600',
    fontFamily: 'Urbanist_600SemiBold',
  },
  dot: {
    fontSize: 14,
    color: '#94A3B8',
    marginHorizontal: 6,
  },
  tripCost: {
    fontSize: 13,
    color: '#64748B',
    fontFamily: 'Urbanist_600SemiBold',
  },
  moreBtn: {
    padding: 4,
  },
  loadMoreBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: 8,
    paddingVertical: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  loadMoreText: {
    color: '#10B981',
    fontWeight: 'bold',
    fontSize: 14,
    fontFamily: 'Urbanist_700Bold',
  },
});
