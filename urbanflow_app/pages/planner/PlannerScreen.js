import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const MODES = [
  { key: 'train', label: 'Train', icon: 'train' },
  { key: 'bus', label: 'Bus', icon: 'bus' },
  { key: 'auto', label: 'Auto', icon: 'car' },
  { key: 'walk', label: 'Walk', icon: 'walk' },
  { key: 'all', label: 'All', icon: 'grip' },
];

const ROUTES = [
  {
    from: 'Connaught Place',
    to: 'India Gate',
    modes: ['train', 'bus'],
    time: '25 min',
    cost: '₹35',
    eco: '8.5',
    ecoColor: '#10B981',
  },
  {
    from: 'Rajiv Chowk',
    to: 'Karol Bagh',
    modes: ['train'],
    time: '15 min',
    cost: '₹20',
    eco: '9.2',
    ecoColor: '#10B981',
  },
  {
    from: 'Khan Market',
    to: 'Lajpat Nagar',
    modes: ['bus', 'auto'],
    time: '18 min',
    cost: '₹45',
    eco: '7.8',
    ecoColor: '#10B981',
  },
];

export default function PlannerScreen({ navigation }) {
  const [selectedMode, setSelectedMode] = useState('train');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#10B981" />
        <Text style={{ marginTop: 16, color: '#10B981', fontFamily: 'Poppins_400Regular', fontSize: 16 }}>Loading planner...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Gradient Header */}
      <LinearGradient colors={["#6366f1", "#10b981"]} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Hello, Bhuwan <Text style={{ fontSize: 22 }}>👋</Text></Text>
            <Text style={styles.headerSubtitle}>Where do you want to go today?</Text>
          </View>
          <View style={styles.headerBellWrap}>
            <TouchableOpacity onPress={() => navigation.navigate('NotificationsScreen')}>
              <Icon name="bell-outline" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700 }}>
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
        {/* Mode Filters */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modeScroll} contentContainerStyle={{ paddingVertical: 8 }}>
          {MODES.map((mode, i) => (
            <TouchableOpacity
              key={mode.key}
              style={[styles.filterChip, selectedMode === mode.key ? styles.filterChipActive : null]}
              activeOpacity={0.85}
              onPress={() => setSelectedMode(mode.key)}
            >
              <Icon name={mode.icon} size={16} color={selectedMode === mode.key ? '#fff' : '#64748b'} style={{ marginRight: 6 }} />
              <Text style={[styles.filterChipText, selectedMode === mode.key ? { color: '#fff' } : null]}>{mode.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Route Suggestions */}
        <Text style={styles.sectionTitle}>Smart Route Suggestions</Text>
        <View style={{ marginBottom: 24 }}>
          {ROUTES.map((route, i) => (
            <MotiView key={i} from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: 400 + i * 120 }}>
              <View style={styles.routeCard}>
                <View style={styles.routeCardTop}>
                  <View style={{ flex: 1 }}>
                    <View style={styles.routePointRow}>
                      <View style={[styles.routeDot, { backgroundColor: '#10B981' }]} />
                      <Text style={styles.routePointText}>{route.from}</Text>
                    </View>
                    <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 18, marginVertical: 4 }}>
                      <View style={styles.routeLine} />
                    </View>
                    <View style={styles.routePointRow}>
                      <View style={[styles.routeDot, { backgroundColor: '#ef4444' }]} />
                      <Text style={styles.routePointText}>{route.to}</Text>
                    </View>
                  </View>
                  <View style={{ flexDirection: 'row', alignItems: 'center', marginLeft: 12 }}>
                    {route.modes.map((m, idx) => (
                      <Icon key={idx} name={m} size={22} color={m === 'train' ? '#6366f1' : m === 'bus' ? '#10b981' : m === 'auto' ? '#f59e42' : '#10B981'} style={{ marginRight: 8 }} />
                    ))}
                  </View>
                </View>
                <View style={styles.routeCardStats}>
                  <View style={styles.routeStatCol}>
                    <Text style={styles.routeStatLabel}>Time</Text>
                    <Text style={styles.routeStatValue}>{route.time}</Text>
                  </View>
                  <View style={styles.routeStatCol}>
                    <Text style={styles.routeStatLabel}>Cost</Text>
                    <Text style={styles.routeStatValue}>{route.cost}</Text>
                  </View>
                  <View style={styles.routeStatCol}>
                    <Text style={styles.routeStatLabel}>Eco Score</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'center' }}>
                      <Icon name="leaf" size={15} color={route.ecoColor} style={{ marginRight: 4 }} />
                      <Text style={[styles.routeStatValue, { color: route.ecoColor }]}>{route.eco}</Text>
                    </View>
                  </View>
                </View>
                <TouchableOpacity style={styles.routeBtn} activeOpacity={0.85} onPress={() => navigation.navigate('RouteDetailsScreen')}>
                  <Text style={styles.routeBtnText}>View Route</Text>
                </TouchableOpacity>
              </View>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 6,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 2,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#dbeafe',
    fontFamily: 'Urbanist_400Regular',
  },
  headerBellWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: { padding: 20, paddingBottom: 80 },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 18,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#6366f1',
    fontFamily: 'Urbanist_400Regular',
  },
  modeScroll: { marginBottom: 18 },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: 18,
    paddingVertical: 8,
    marginRight: 10,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.06,
    shadowRadius: 4,
    elevation: 1,
  },
  filterChipActive: {
    backgroundColor: '#6366f1',
    borderColor: '#6366f1',
    shadowOpacity: 0.12,
  },
  filterChipText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#64748b',
    fontFamily: 'Poppins_700Bold',
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6366f1',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 12,
    marginTop: 8,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 22,
    padding: 18,
    marginBottom: 18,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 3,
  },
  routeCardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  routePointRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 2,
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 8,
  },
  routePointText: {
    fontSize: 15,
    color: '#64748b',
    fontFamily: 'Urbanist_700Bold',
  },
  routeLine: {
    width: 2,
    height: 24,
    backgroundColor: '#d1d5db',
    borderRadius: 1,
  },
  routeCardStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  routeStatCol: {
    alignItems: 'center',
    flex: 1,
  },
  routeStatLabel: {
    fontSize: 13,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
    marginBottom: 2,
  },
  routeStatValue: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    fontFamily: 'Poppins_700Bold',
  },
  routeBtn: {
    backgroundColor: '#6366f1',
    borderRadius: 14,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 2,
  },
  routeBtnText: {
    color: '#fff',
    fontSize: 15,
    fontWeight: '600',
    fontFamily: 'Urbanist_700Bold',
  },
}); 