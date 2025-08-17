import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, FlatList, Dimensions, ActivityIndicator } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

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
          <View style={styles.headerLeft}>
            <Text style={styles.headerTitle}>Hello, Bhuwan <Text style={{ fontSize: Math.max(18, width * 0.05) }}>👋</Text></Text>
            <Text style={styles.headerSubtitle}>Where do you want to go today?</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.settingsButton} onPress={() => navigation.navigate('NotificationsScreen')}>
              <Icon name="bell-outline" size={18} color="#fff" />
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
              onPress={() => setSelectedMode(mode.key)}
            >
              <Icon name={mode.icon} size={16} color={selectedMode === mode.key ? '#fff' : '#6366f1'} />
              <Text style={[styles.filterChipText, selectedMode === mode.key ? styles.filterChipTextActive : null]}>
                {mode.label}
              </Text>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Quick Actions */}
        <View style={styles.quickActions}>
          <Text style={styles.sectionTitle}>Quick Actions</Text>
          <View style={styles.actionGrid}>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Icon name="home" size={24} color="#6366f1" />
              </View>
              <Text style={styles.actionText}>Home</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Icon name="briefcase" size={24} color="#10b981" />
              </View>
              <Text style={styles.actionText}>Work</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Icon name="heart" size={24} color="#f59e0b" />
              </View>
              <Text style={styles.actionText}>Favorites</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.actionCard}>
              <View style={styles.actionIcon}>
                <Icon name="history" size={24} color="#8b5cf6" />
              </View>
              <Text style={styles.actionText}>Recent</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Popular Routes */}
        <View style={styles.popularRoutes}>
          <Text style={styles.sectionTitle}>Popular Routes</Text>
          {ROUTES.map((route, index) => (
            <MotiView
              key={index}
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 600, delay: index * 100 }}
            >
              <TouchableOpacity style={styles.routeCard}>
                <View style={styles.routeHeader}>
                  <View style={styles.routeInfo}>
                    <Text style={styles.routeFrom}>{route.from}</Text>
                    <Icon name="arrow-down" size={16} color="#9ca3af" style={{ marginVertical: 4 }} />
                    <Text style={styles.routeTo}>{route.to}</Text>
                  </View>
                  <View style={styles.routeStats}>
                    <Text style={styles.routeTime}>{route.time}</Text>
                    <Text style={styles.routeCost}>{route.cost}</Text>
                  </View>
                </View>
                <View style={styles.routeFooter}>
                  <View style={styles.routeModes}>
                    {route.modes.map((mode, i) => (
                      <Icon key={i} name={mode} size={16} color="#6366f1" style={{ marginRight: 8 }} />
                    ))}
                  </View>
                  <View style={[styles.ecoBadge, { backgroundColor: route.ecoColor + '20' }]}>
                    <Text style={[styles.ecoText, { color: route.ecoColor }]}>{route.eco} Eco</Text>
                  </View>
                </View>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: height * 0.04,
    paddingBottom: height * 0.02,
    paddingHorizontal: width * 0.06,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
    elevation: 4,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
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
    fontSize: Math.max(20, width * 0.06),
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 6,
  },
  headerSubtitle: {
    fontSize: Math.max(12, width * 0.035),
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Urbanist_400Regular',
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  scrollContent: {
    padding: width * 0.05,
    paddingBottom: 80,
  },
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
  quickActions: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 16,
    fontFamily: 'Poppins_700Bold',
  },
  actionGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionCard: {
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    width: (width - 60) / 4,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  actionIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 12,
    color: '#374151',
    fontWeight: '500',
    fontFamily: 'Urbanist_400Regular',
  },
  popularRoutes: {
    marginBottom: 24,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  routeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  routeInfo: {
    flex: 1,
  },
  routeFrom: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  routeTo: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  routeStats: {
    alignItems: 'flex-end',
  },
  routeTime: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6366f1',
    fontFamily: 'Montserrat_700Bold',
  },
  routeCost: {
    fontSize: 12,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
  },
  routeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  routeModes: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ecoBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  ecoText: {
    fontSize: 12,
    fontWeight: '600',
    fontFamily: 'Montserrat_700Bold',
  },
}); 