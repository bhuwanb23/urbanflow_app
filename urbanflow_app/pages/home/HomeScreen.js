import React, { useState, useEffect } from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions, Platform, TouchableOpacity, Animated, ActivityIndicator } from 'react-native';
import { Appbar, Card, Avatar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { useAuth, useTrips, useRoutes, useEcoStats } from '../../utils/hooks/useAPI';

const { width, height } = Dimensions.get('window');

const quickModes = [
  { label: 'Train', icon: 'train', color: '#3b82f6' },
  { label: 'Bus', icon: 'bus', color: '#10b981' },
  { label: 'Auto', icon: 'car', color: '#f59e0b' },
  { label: 'Walk', icon: 'walk', color: '#8b5cf6' },
];

const suggestions = [
  { 
    title: 'Eco Route to Downtown', 
    ecoScore: 'A+', 
    cta: 'Try this route',
    icon: 'leaf',
    color: '#10b981',
    time: '25 min',
    savings: '2.3kg CO₂'
  },
  { 
    title: 'Fastest to City Park', 
    ecoScore: 'B', 
    cta: 'Try this route',
    icon: 'lightning-bolt',
    color: '#f59e0b',
    time: '18 min',
    savings: '1.8kg CO₂'
  },
];

const navTabs = [
  { label: 'Home', icon: 'home' },
  { label: 'Planner', icon: 'map' },
  { label: 'Stats', icon: 'chart-bar' },
  { label: 'Trips', icon: 'history' },
  { label: 'Profile', icon: 'account' },
];

export default function HomeScreen() {
  const [activeTab, setActiveTab] = useState('Home');
  const [search, setSearch] = useState('');
  const [pulseAnim] = useState(new Animated.Value(1));

  // API hooks
  const { user } = useAuth();
  const { trips, fetchTrips, loading: tripsLoading } = useTrips();
  const { routes, fetchRoutes, loading: routesLoading } = useRoutes();
  const { ecoStats, fetchEcoStats, loading: statsLoading } = useEcoStats();

  useEffect(() => {
    // Load home data
    loadHomeData();
    
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {
          toValue: 1.1,
          duration: 2000,
          useNativeDriver: true,
        }),
        Animated.timing(pulseAnim, {
          toValue: 1,
          duration: 2000,
          useNativeDriver: true,
        }),
      ])
    );
    pulse.start();
  }, []);

  const loadHomeData = async () => {
    try {
      await Promise.all([
        fetchTrips({ limit: 5, status: 'completed' }),
        fetchRoutes({ limit: 3, isFavorite: true }),
        fetchEcoStats({ period: 'week' })
      ]);
    } catch (error) {
      console.log('Error loading home data:', error);
    }
  };

  return (
    <LinearGradient colors={["#43cea2", "#185a9d", "#6a11cb", "#2575fc"]} style={styles.gradient}>
      {/* Enhanced floating glassy header */}
      <MotiView
        from={{ opacity: 0, translateY: -50, scale: 0.9 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: 'spring', duration: 1000, delay: 200 }}
        style={styles.headerWrap}
      >
        <BlurView intensity={70} tint="light" style={styles.headerBlur}>
          <Appbar.Header style={styles.header}>
            <MotiView
              from={{ scale: 0, rotate: '-180deg' }}
              animate={{ scale: 1, rotate: '0deg' }}
              transition={{ type: 'spring', delay: 400 }}
            >
              <Avatar.Image size={45} source={require('../../assets/icon.png')} />
            </MotiView>
            <View style={{ flex: 1, marginLeft: 15 }}>
              <MotiView
                from={{ opacity: 0, translateX: -20 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 800, delay: 600 }}
              >
                <Text style={styles.greeting}>Hello, Alex</Text>
                <Text style={styles.location}>📍 Mumbai, India</Text>
              </MotiView>
            </View>
            <MotiView
              from={{ scale: 0, rotate: '180deg' }}
              animate={{ scale: 1, rotate: '0deg' }}
              transition={{ type: 'spring', delay: 800 }}
            >
              <TouchableOpacity style={styles.notificationBtn}>
                <Icon name="bell-outline" size={28} color="#1976d2" />
                <View style={styles.notificationDot} />
              </TouchableOpacity>
            </MotiView>
          </Appbar.Header>
          <View style={styles.searchBarWrap}>
            <BlurView intensity={50} tint="light" style={styles.searchBarBlur}>
              <TouchableOpacity style={styles.searchBar} activeOpacity={0.8}>
                <Icon name="magnify" size={24} color="#1976d2" style={{ marginRight: 12 }} />
                <Text style={styles.searchText}>{search || 'Where do you want to go?'}</Text>
                <Icon name="microphone" size={20} color="#9ca3af" />
              </TouchableOpacity>
            </BlurView>
          </View>
        </BlurView>
      </MotiView>

      {/* Enhanced floating glassmorphic main card */}
      <MotiView
        from={{ opacity: 0, translateY: 60, scale: 0.95 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: 'spring', duration: 1200, delay: 400 }}
        style={styles.mainCardWrap}
      >
        <BlurView intensity={70} tint="light" style={styles.mainCardBlur}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            {/* Enhanced Quick Modes */}
            <View style={styles.quickModesSection}>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 800, delay: 600 }}
              >
                <Text style={styles.sectionTitle}>Quick Modes</Text>
              </MotiView>
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickModes}>
                {quickModes.map((mode, idx) => (
                  <MotiView
                    key={mode.label}
                    from={{ opacity: 0, scale: 0.5, translateY: 30 }}
                    animate={{ opacity: 1, scale: 1, translateY: 0 }}
                    transition={{ type: 'spring', delay: 800 + idx * 150 }}
                    style={styles.modeBtnWrap}
                  >
                    <TouchableOpacity style={styles.modeBtn} activeOpacity={0.85}>
                      <LinearGradient 
                        colors={[mode.color, `${mode.color}80`]} 
                        style={styles.modeIconWrap}
                      >
                        <Icon name={mode.icon} size={32} color="#fff" />
                      </LinearGradient>
                      <Text style={styles.modeLabel}>{mode.label}</Text>
                    </TouchableOpacity>
                  </MotiView>
                ))}
              </ScrollView>
            </View>

            {/* Enhanced Smart Suggestions */}
            <View style={styles.suggestionsSection}>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 800, delay: 1000 }}
              >
                <Text style={styles.sectionTitle}>Smart Suggestions</Text>
              </MotiView>
              {suggestions.map((s, i) => (
                <MotiView
                  key={i}
                  from={{ opacity: 0, translateY: 40, scale: 0.9 }}
                  animate={{ opacity: 1, translateY: 0, scale: 1 }}
                  transition={{ type: 'spring', duration: 800, delay: 1200 + i * 200 }}
                  style={styles.suggestionBlur}
                >
                  <BlurView intensity={50} tint="light" style={styles.suggestionBlurInner}>
                    <Card style={styles.suggestionCard}>
                      <Card.Content style={styles.suggestionContent}>
                        <View style={styles.suggestionHeader}>
                          <View style={styles.suggestionIconContainer}>
                            <Icon name={s.icon} size={24} color={s.color} />
                          </View>
                          <View style={styles.suggestionInfo}>
                            <Text style={styles.cardTitle}>{s.title}</Text>
                            <View style={styles.suggestionDetails}>
                              <View style={styles.detailItem}>
                                <Icon name="clock-outline" size={16} color="#6b7280" />
                                <Text style={styles.detailText}>{s.time}</Text>
                              </View>
                              <View style={styles.detailItem}>
                                <Icon name="leaf" size={16} color="#10b981" />
                                <Text style={styles.detailText}>{s.savings}</Text>
                              </View>
                            </View>
                          </View>
                          <View style={styles.ecoScoreContainer}>
                            <Text style={[styles.ecoScore, { color: s.color }]}>{s.ecoScore}</Text>
                          </View>
                        </View>
                        <TouchableOpacity style={styles.ctaButton} activeOpacity={0.8}>
                          <LinearGradient colors={[s.color, `${s.color}80`]} style={styles.ctaGradient}>
                            <Text style={styles.ctaBtnText}>{s.cta}</Text>
                            <Icon name="arrow-right" size={16} color="#fff" />
                          </LinearGradient>
                        </TouchableOpacity>
                      </Card.Content>
                    </Card>
                  </BlurView>
                </MotiView>
              ))}
            </View>

            {/* Enhanced Eco Stats */}
            <View style={styles.statsSection}>
              <MotiView
                from={{ opacity: 0, translateY: 20 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 800, delay: 1600 }}
              >
                <Text style={styles.sectionTitle}>Eco Stats</Text>
              </MotiView>
              <MotiView
                from={{ opacity: 0, translateY: 40, scale: 0.9 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 800, delay: 1800 }}
                style={styles.statsBlur}
              >
                <BlurView intensity={50} tint="light" style={styles.statsBlurInner}>
                  <Card style={styles.statsCard}>
                    <Card.Content style={styles.statsContent}>
                      <View style={styles.statsRow}>
                        <View style={styles.statItem}>
                          <Animated.View style={[styles.statIcon, { transform: [{ scale: pulseAnim }] }]}>
                            <Icon name="leaf" size={24} color="#10b981" />
                          </Animated.View>
                          <Text style={styles.statValue}>2.3kg</Text>
                          <Text style={styles.statLabel}>CO₂ Saved</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                          <Icon name="walk" size={24} color="#3b82f6" />
                          <Text style={styles.statValue}>8,200</Text>
                          <Text style={styles.statLabel}>Steps Walked</Text>
                        </View>
                        <View style={styles.statDivider} />
                        <View style={styles.statItem}>
                          <Icon name="star" size={24} color="#f59e0b" />
                          <Text style={styles.statValue}>Marine Drive</Text>
                          <Text style={styles.statLabel}>Best Trip</Text>
                        </View>
                      </View>
                    </Card.Content>
                  </Card>
                </BlurView>
              </MotiView>
            </View>
          </ScrollView>
        </BlurView>
      </MotiView>

      {/* Enhanced floating, pill-shaped bottom nav */}
      <MotiView
        from={{ opacity: 0, translateY: 60, scale: 0.9 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: 'spring', duration: 1000, delay: 800 }}
        style={styles.bottomBarWrap}
      >
        <BlurView intensity={60} tint="light" style={styles.bottomBarBlur}>
          <View style={styles.bottomBar}>
            {navTabs.map((tab, index) => (
              <MotiView
                key={tab.label}
                from={{ opacity: 0, scale: 0, translateY: 20 }}
                animate={{ opacity: 1, scale: 1, translateY: 0 }}
                transition={{ type: 'spring', delay: 1000 + index * 100 }}
              >
                <TouchableOpacity
                  style={styles.tabBtn}
                  onPress={() => setActiveTab(tab.label)}
                  activeOpacity={0.7}
                >
                  <LinearGradient
                    colors={activeTab === tab.label ? ["#43cea2", "#6a11cb"] : ["#e0eafc", "#cfdef3"]}
                    style={styles.tabIconWrap}
                  >
                    <Icon
                      name={tab.icon}
                      size={26}
                      color={activeTab === tab.label ? '#fff' : '#b0bec5'}
                      style={activeTab === tab.label ? styles.activeTabIcon : null}
                    />
                  </LinearGradient>
                  <Text style={[styles.tabLabel, activeTab === tab.label && styles.activeTabLabel]}>
                    {tab.label}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </BlurView>
      </MotiView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  headerWrap: { 
    position: 'absolute', 
    top: 0, 
    left: 0, 
    right: 0, 
    zIndex: 10, 
    paddingTop: Platform.OS === 'ios' ? 50 : 30 
  },
  headerBlur: { 
    marginHorizontal: 16, 
    borderRadius: 32, 
    overflow: 'hidden', 
    marginTop: 12, 
    shadowColor: '#000', 
    shadowOffset: { width: 0, height: 12 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 20, 
    elevation: 12 
  },
  header: { 
    backgroundColor: 'transparent', 
    elevation: 0, 
    shadowOpacity: 0, 
    alignItems: 'center',
    paddingHorizontal: 16
  },
  greeting: { 
    fontSize: 22, 
    fontWeight: '800', 
    color: '#185a9d', 
    fontFamily: 'Poppins_700Bold' 
  },
  location: { 
    fontSize: 15, 
    color: '#388e3c', 
    marginTop: 2, 
    fontFamily: 'Urbanist_400Regular' 
  },
  notificationBtn: {
    position: 'relative',
    padding: 8,
  },
  notificationDot: {
    position: 'absolute',
    top: 6,
    right: 6,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#ef4444',
  },
  searchBarWrap: { 
    alignItems: 'center', 
    marginTop: -20, 
    marginBottom: 12 
  },
  searchBarBlur: { 
    borderRadius: 28, 
    overflow: 'hidden' 
  },
  searchBar: { 
    flexDirection: 'row', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    borderRadius: 28, 
    paddingHorizontal: 20, 
    paddingVertical: 12, 
    width: width * 0.9 
  },
  searchText: { 
    color: '#b0bec5', 
    fontSize: 16, 
    fontFamily: 'Urbanist_400Regular',
    flex: 1,
    marginLeft: 8
  },
  mainCardWrap: { 
    flex: 1, 
    marginTop: 160, 
    marginHorizontal: 8, 
    borderRadius: 32, 
    overflow: 'visible', 
    zIndex: 2 
  },
  mainCardBlur: { 
    borderRadius: 32, 
    overflow: 'hidden', 
    paddingBottom: 120 
  },
  scrollContent: { 
    paddingBottom: 120, 
    paddingHorizontal: 12 
  },
  quickModesSection: {
    marginVertical: 20,
  },
  sectionTitle: { 
    fontSize: 20, 
    fontWeight: '800', 
    marginBottom: 16, 
    color: '#1976d2', 
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5
  },
  quickModes: { 
    flexDirection: 'row', 
    marginVertical: 8, 
    paddingLeft: 4 
  },
  modeBtnWrap: { 
    alignItems: 'center', 
    marginRight: 24 
  },
  modeBtn: { 
    alignItems: 'center' 
  },
  modeIconWrap: { 
    width: 64, 
    height: 64, 
    borderRadius: 32, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 8, 
    shadowColor: '#185a9d', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 12, 
    elevation: 8 
  },
  modeLabel: { 
    fontSize: 14, 
    color: '#185a9d', 
    fontWeight: '700', 
    fontFamily: 'Urbanist_700Bold' 
  },
  suggestionsSection: {
    marginVertical: 20,
  },
  suggestionBlur: { 
    borderRadius: 20, 
    marginBottom: 16, 
    overflow: 'visible' 
  },
  suggestionBlurInner: { 
    borderRadius: 20, 
    overflow: 'hidden' 
  },
  suggestionCard: { 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    elevation: 4, 
    shadowColor: '#185a9d', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.1, 
    shadowRadius: 12 
  },
  suggestionContent: {
    padding: 20,
  },
  suggestionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  suggestionIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  suggestionInfo: {
    flex: 1,
  },
  cardTitle: { 
    fontFamily: 'Urbanist_700Bold', 
    fontSize: 18, 
    color: '#185a9d',
    marginBottom: 8
  },
  suggestionDetails: {
    flexDirection: 'row',
    gap: 16,
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  detailText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
  },
  ecoScoreContainer: {
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    borderRadius: 16,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  ecoScore: {
    fontSize: 16,
    fontWeight: '800',
    fontFamily: 'Urbanist_700Bold',
  },
  ctaButton: {
    borderRadius: 16,
    overflow: 'hidden',
  },
  ctaGradient: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 20,
    gap: 8,
  },
  ctaBtnText: { 
    color: '#fff', 
    fontFamily: 'Urbanist_700Bold', 
    fontSize: 16,
    fontWeight: '700'
  },
  statsSection: {
    marginVertical: 20,
  },
  statsBlur: { 
    borderRadius: 20, 
    marginBottom: 16, 
    overflow: 'visible' 
  },
  statsBlurInner: { 
    borderRadius: 20, 
    overflow: 'hidden' 
  },
  statsCard: { 
    borderRadius: 20, 
    backgroundColor: 'rgba(255,255,255,0.8)', 
    elevation: 3 
  },
  statsContent: {
    padding: 20,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  statValue: { 
    fontSize: 18, 
    fontWeight: '800', 
    color: '#1976d2', 
    fontFamily: 'Montserrat_700Bold',
    marginBottom: 4
  },
  statLabel: { 
    fontSize: 14, 
    color: '#6b7280', 
    fontFamily: 'Urbanist_400Regular',
    textAlign: 'center'
  },
  statDivider: {
    width: 1,
    height: 40,
    backgroundColor: '#e5e7eb',
  },
  bottomBarWrap: { 
    position: 'absolute', 
    left: 0, 
    right: 0, 
    bottom: 24, 
    zIndex: 20 
  },
  bottomBarBlur: { 
    borderRadius: 32, 
    marginHorizontal: 32, 
    overflow: 'hidden', 
    shadowColor: '#185a9d', 
    shadowOffset: { width: 0, height: 6 }, 
    shadowOpacity: 0.15, 
    shadowRadius: 16, 
    elevation: 16 
  },
  bottomBar: { 
    flexDirection: 'row', 
    justifyContent: 'space-around', 
    alignItems: 'center', 
    backgroundColor: 'rgba(255,255,255,0.9)', 
    borderRadius: 32, 
    height: 72, 
    paddingHorizontal: 12 
  },
  tabBtn: { 
    alignItems: 'center', 
    flex: 1 
  },
  tabIconWrap: { 
    width: 44, 
    height: 44, 
    borderRadius: 22, 
    justifyContent: 'center', 
    alignItems: 'center', 
    marginBottom: 4 
  },
  tabLabel: { 
    fontSize: 12, 
    color: '#b0bec5', 
    marginTop: 2, 
    fontFamily: 'Urbanist_700Bold' 
  },
  activeTabLabel: { 
    color: '#185a9d', 
    fontWeight: '800' 
  },
  activeTabIcon: { 
    shadowColor: '#185a9d', 
    shadowOffset: { width: 0, height: 2 }, 
    shadowOpacity: 0.2, 
    shadowRadius: 8 
  },
}); 