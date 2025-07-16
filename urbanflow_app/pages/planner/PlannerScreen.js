import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TextInput, TouchableOpacity, Platform, SafeAreaView } from 'react-native';
import { Appbar, Card, Chip, Button, Avatar, FAB } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const quickModes = [
  { label: 'Train', icon: 'train', emoji: '🚉', color: ['#43cea2', '#185a9d'] },
  { label: 'Bus', icon: 'bus', emoji: '🚌', color: ['#4fc3f7', '#1976d2'] },
  { label: 'Auto', icon: 'car', emoji: '🚖', color: ['#fbc02d', '#f59e42'] },
  { label: 'Walk', icon: 'walk', emoji: '🚶', color: ['#a8edea', '#43cea2'] },
  { label: 'All', icon: 'car-multiple', emoji: '🚗', color: ['#6a11cb', '#2575fc'] },
];

const gallery = [
  { src: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c', label: 'Metro Station' },
  { src: 'https://images.unsplash.com/photo-1596432150438-3ef028cca147', label: 'Scenic Bus Route' },
  { src: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHxhdXRvfGVufDB8fHx8MTc1MjYzODAyOHww&ixlib=rb-4.1.0&q=80&w=1080', label: 'Auto Ride' },
  { src: 'https://images.unsplash.com/photo-1487956382158-bb926046304a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3MzkyNDZ8MHwxfHNlYXJjaHwxfHx3YWxraW5nfGVufDB8fHx8MTc1MjYzODAyOXww&ixlib=rb-4.1.0&q=80&w=1080', label: 'Walking Path' },
];

const suggestions = [
  {
    mode: 'train',
    modeColor: ['#43cea2', '#185a9d'],
    modeIcon: 'train',
    title: 'Metro + Walk',
    subtitle: 'Fastest route',
    time: '28 min',
    cost: '₹45',
    eco: 92,
    co2: '2.1 kg',
  },
  {
    mode: 'bus',
    modeColor: ['#4fc3f7', '#1976d2'],
    modeIcon: 'bus',
    title: 'Bus Direct',
    subtitle: 'Most comfortable',
    time: '42 min',
    cost: '₹25',
    eco: 88,
    co2: '1.8 kg',
  },
  {
    mode: 'car',
    modeColor: ['#fbc02d', '#f59e42'],
    modeIcon: 'car',
    title: 'Auto Rickshaw',
    subtitle: 'Budget friendly',
    time: '35 min',
    cost: '₹80',
    eco: 65,
    co2: '0.8 kg',
  },
];

// Add mock data for recent locations and favorites
const recentLocations = [
  { label: 'Home', icon: 'home', address: '123 Main St' },
  { label: 'Work', icon: 'briefcase', address: '456 Office Park' },
  { label: 'Cafe', icon: 'coffee', address: 'Sunset Blvd' },
];
const favoriteLocations = [
  { label: 'Gym', icon: 'dumbbell', address: 'Fit Club' },
  { label: 'Park', icon: 'tree', address: 'Central Park' },
];

// Add quick actions
const quickActions = [
  { label: 'Set Goal', icon: 'target' },
  { label: 'Smart Routing', icon: 'compass' },
  { label: 'Pin Location', icon: 'map-marker' },
  { label: 'Schedule Trip', icon: 'calendar' },
];

export default function PlannerScreen() {
  const [selectedMode, setSelectedMode] = useState('All');
  const [showMap, setShowMap] = useState(false);
  const [selectedRoute, setSelectedRoute] = useState(null);

  // Filter suggestions by selected mode
  const filteredSuggestions = selectedMode === 'All'
    ? suggestions
    : suggestions.filter(s => s.mode.toLowerCase() === selectedMode.toLowerCase());

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#f7f8fa' }}>
      {/* Gradient Header with Avatar */}
      <LinearGradient colors={["#43cea2", "#185a9d", "#6a11cb"]} style={styles.headerGradient}>
        <View style={styles.headerContent}>
          <Avatar.Image size={56} source={require('../../assets/icon.png')} style={styles.headerAvatar} />
          <View style={{ flex: 1, marginLeft: 16 }}>
            <Text style={styles.headerGreeting}>Hello, Bhuwan <Text style={{ fontSize: 26 }}>👋</Text></Text>
            <Text style={styles.headerSubtext}>Where do you want to go today?</Text>
          </View>
          <TouchableOpacity style={styles.headerBellBtn}>
            <Icon name="bell-outline" size={28} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Glassmorphic Search Bar */}
        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700 }}>
          <BlurView intensity={60} tint="light" style={styles.searchWrap}>
            <TouchableOpacity style={styles.locationBtn}>
              <Icon name="crosshairs-gps" size={22} color="#43cea2" />
            </TouchableOpacity>
            <Icon name="magnify" size={22} color="#4fc3f7" style={styles.searchIcon} />
            <TextInput
              placeholder="Enter your destination"
              style={styles.searchInput}
              placeholderTextColor="#b0bec5"
            />
            <TouchableOpacity style={styles.voiceBtn}>
              <Icon name="microphone" size={22} color="#1976d2" />
            </TouchableOpacity>
          </BlurView>
        </MotiView>
        {/* Recent Locations & Favorites */}
        <Text style={styles.sectionTitle}>Recent Locations</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.recentScroll}>
          {recentLocations.map((loc, i) => (
            <View key={i} style={styles.recentCard}>
              <Icon name={loc.icon} size={22} color="#43cea2" style={{ marginBottom: 4 }} />
              <Text style={styles.recentLabel}>{loc.label}</Text>
              <Text style={styles.recentAddress}>{loc.address}</Text>
            </View>
          ))}
          {favoriteLocations.map((loc, i) => (
            <View key={i + 100} style={[styles.recentCard, { borderColor: '#1976d2' }] }>
              <Icon name={loc.icon} size={22} color="#1976d2" style={{ marginBottom: 4 }} />
              <Text style={styles.recentLabel}>{loc.label}</Text>
              <Text style={styles.recentAddress}>{loc.address}</Text>
            </View>
          ))}
        </ScrollView>
        {/* Quick Actions */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickActionScroll}>
          {quickActions.map((action, i) => (
            <TouchableOpacity key={action.label} style={styles.quickActionBtn}>
              <Icon name={action.icon} size={22} color="#fff" />
              <Text style={styles.quickActionLabel}>{action.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Quick Modes with filter logic */}
        <Text style={styles.sectionTitle}>Quick Mode</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickModes}>
          {['All', ...quickModes.map(m => m.label)].map((mode, i) => (
            <TouchableOpacity
              key={mode}
              style={[styles.quickBtn, selectedMode === mode && styles.quickBtnActive]}
              activeOpacity={0.85}
              onPress={() => setSelectedMode(mode)}
            >
              <LinearGradient colors={mode === 'All' ? ['#e0eafc', '#cfdef3'] : quickModes.find(m => m.label === mode)?.color || ['#e0eafc', '#cfdef3']} style={styles.quickBtnGradient}>
                <Text style={[styles.quickLabel, selectedMode === mode && { color: '#185a9d' }]}>{mode}</Text>
              </LinearGradient>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Smart Route Suggestions with transport mix and map preview */}
        <Text style={styles.sectionTitle}>Smart Route Suggestions</Text>
        {filteredSuggestions.map((s, i) => (
          <MotiView key={i} from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: 600 + i * 120 }}>
            <View style={styles.routeCardWrap}>
              <Card style={styles.routeCard}>
                <TouchableOpacity onPress={() => { setSelectedRoute(s); setShowMap(!showMap); }} activeOpacity={0.9}>
                  <View style={styles.routeCardRow}>
                    <View style={styles.routeIconCol}>
                      <LinearGradient colors={s.modeColor} style={styles.routeIconCircle}>
                        <Icon name={s.modeIcon} size={28} color="#fff" />
                      </LinearGradient>
                    </View>
                    <View style={styles.routeInfoCol}>
                      <Text style={styles.routeTitle}>{s.title}</Text>
                      <Text style={styles.routeSubtitle}>{s.subtitle}</Text>
                      <View style={styles.routeMixRow}>
                        <Icon name="walk" size={16} color="#43cea2" />
                        <Text style={styles.transportMixText}>Walk</Text>
                        <Text style={{ marginHorizontal: 4, color: '#b0bec5' }}>+</Text>
                        <Icon name={s.modeIcon} size={16} color={s.modeColor ? s.modeColor[1] : '#1976d2'} />
                        <Text style={styles.transportMixText}>{s.mode.charAt(0).toUpperCase() + s.mode.slice(1)}</Text>
                      </View>
                      <View style={styles.routeEcoRow}>
                        <Icon name="leaf" size={16} color="#43cea2" />
                        <Text style={styles.routeEcoText}>Eco Score: {s.eco}</Text>
                        <Icon name="cloud" size={16} color="#b0bec5" style={{ marginLeft: 12 }} />
                        <Text style={styles.routeEcoText}>{s.co2} saved</Text>
                      </View>
                    </View>
                    <View style={styles.routeMetaCol}>
                      <Text style={styles.routeTime}>{s.time}</Text>
                      <Text style={styles.routeCost}>{s.cost}</Text>
                      <TouchableOpacity style={styles.routeBtn}>
                        <Text style={styles.routeBtnText}>View Route</Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </TouchableOpacity>
                {/* Map Preview (expandable) */}
                {showMap && selectedRoute === s && (
                  <View style={styles.mapPreview}>
                    <Image source={{ uri: 'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=600&q=80' }} style={styles.mapImgPreview} />
                    <TouchableOpacity style={styles.mapCloseBtn} onPress={() => setShowMap(false)}>
                      <Icon name="close" size={18} color="#fff" />
                    </TouchableOpacity>
                  </View>
                )}
              </Card>
            </View>
          </MotiView>
        ))}
      </ScrollView>
      {/* Floating Action Button */}
      <FAB
        style={styles.fab}
        icon="plus"
        color="#fff"
        onPress={() => {}}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 48,
    paddingBottom: 32,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 6,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerAvatar: {
    backgroundColor: '#fff',
    borderWidth: 2,
    borderColor: '#43cea2',
  },
  headerGreeting: {
    fontSize: 26,
    fontWeight: '700',
    color: '#fff',
    fontFamily: 'Inter_700Bold',
    marginBottom: 2,
  },
  headerSubtext: {
    fontSize: 17,
    color: '#e0eafc',
    fontFamily: 'Inter_400Regular',
    marginBottom: 2,
  },
  headerBellBtn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 20,
    padding: 10,
    marginLeft: 12,
  },
  scrollContent: { padding: 16, paddingBottom: 100 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 18, shadowColor: '#185a9d', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 4 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 17, color: '#185a9d', fontFamily: 'Inter_400Regular', paddingVertical: Platform.OS === 'ios' ? 8 : 0 },
  sectionTitle: { fontSize: 22, fontWeight: 'bold', marginTop: 28, marginBottom: 14, color: '#185a9d', fontFamily: 'Inter_700Bold', letterSpacing: 0.2 },
  quickModes: { flexDirection: 'row', marginBottom: 8 },
  quickBtn: { marginRight: 12, borderRadius: 18, overflow: 'hidden', elevation: 2 },
  quickBtnGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 18 },
  quickEmoji: { fontSize: 20, marginRight: 8, color: '#fff', fontFamily: 'Inter_700Bold' },
  quickLabel: { fontSize: 15, fontWeight: '600', color: '#fff', fontFamily: 'Inter_700Bold' },
  galleryScroll: { flexDirection: 'row', marginBottom: 8 },
  galleryCard: { width: 130, height: 130, borderRadius: 24, marginRight: 16, overflow: 'hidden', backgroundColor: '#e0eafc', shadowColor: '#185a9d', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 3, position: 'relative' },
  galleryImg: { width: '100%', height: '100%' },
  galleryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  galleryLabel: { position: 'absolute', left: 0, right: 0, bottom: 10, color: '#fff', fontWeight: '700', fontSize: 15, textAlign: 'center', fontFamily: 'Inter_700Bold', textShadowColor: 'rgba(0,0,0,0.18)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: 8, marginTop: 2 },
  viewAllText: { color: '#1976d2', fontWeight: '700', fontFamily: 'Inter_700Bold', marginRight: 4, fontSize: 15 },
  suggestionBlur: { borderRadius: 28, marginBottom: 22, overflow: 'hidden' },
  suggestionCard: { borderRadius: 28, backgroundColor: 'rgba(255,255,255,0.85)', elevation: 3, shadowColor: '#185a9d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12, padding: 0 },
  suggestionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 16, paddingTop: 16 },
  modeCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 16 },
  suggestionTitle: { fontSize: 18, fontWeight: 'bold', color: '#185a9d', fontFamily: 'Inter_700Bold' },
  suggestionSubtitle: { fontSize: 15, color: '#388e3c', fontFamily: 'Inter_400Regular' },
  suggestionTime: { fontSize: 18, fontWeight: 'bold', color: '#185a9d', fontFamily: 'Inter_700Bold' },
  suggestionCost: { fontSize: 15, color: '#388e3c', fontFamily: 'Inter_400Regular' },
  suggestionMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 16, paddingBottom: 16 },
  suggestionMetaGroup: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  suggestionMetaText: { fontSize: 15, color: '#388e3c', marginLeft: 4, fontFamily: 'Inter_400Regular' },
  viewRouteBtn: { backgroundColor: '#388e3c', borderRadius: 16, paddingHorizontal: 20, marginLeft: 'auto', elevation: 0, height: 38, justifyContent: 'center' },
  viewRouteLabel: { fontWeight: 'bold', fontFamily: 'Inter_700Bold', fontSize: 15 },
  fab: {
    position: 'absolute',
    right: 24,
    bottom: 32,
    backgroundColor: '#185a9d',
    elevation: 6,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.18,
    shadowRadius: 12,
  },
  locationBtn: {
    marginRight: 8,
    backgroundColor: 'rgba(67,206,162,0.08)',
    borderRadius: 16,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  voiceBtn: {
    marginLeft: 8,
    backgroundColor: 'rgba(25,118,210,0.08)',
    borderRadius: 16,
    padding: 6,
    alignItems: 'center',
    justifyContent: 'center',
  },
  recentScroll: { flexDirection: 'row', marginBottom: 8, marginTop: 8 },
  recentCard: { backgroundColor: '#fff', borderRadius: 16, padding: 12, marginRight: 12, borderWidth: 1, borderColor: '#e0eafc', minWidth: 90, alignItems: 'center', elevation: 2 },
  recentLabel: { fontFamily: 'Inter_700Bold', color: '#185a9d', fontSize: 14, marginBottom: 2 },
  recentAddress: { fontFamily: 'Inter_400Regular', color: '#6b7280', fontSize: 12 },
  quickActionScroll: { flexDirection: 'row', marginBottom: 8, marginTop: 8 },
  quickActionBtn: { backgroundColor: '#43cea2', borderRadius: 16, padding: 10, marginRight: 12, alignItems: 'center', minWidth: 90 },
  quickActionLabel: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 13, marginTop: 4 },
  quickBtnActive: { borderWidth: 2, borderColor: '#185a9d' },
  transportMixText: { fontFamily: 'Inter_400Regular', color: '#185a9d', fontSize: 13, marginLeft: 2 },
  mapPreview: { marginTop: 12, borderRadius: 18, overflow: 'hidden', position: 'relative', alignItems: 'center' },
  mapImgPreview: { width: '100%', height: 120, borderRadius: 18 },
  mapCloseBtn: { position: 'absolute', top: 8, right: 8, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: 16, padding: 4 },
  routeCardWrap: { marginBottom: 22, borderRadius: 28, shadowColor: '#185a9d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12, elevation: 4 },
  routeCard: { borderRadius: 28, backgroundColor: '#fff', padding: 0, overflow: 'hidden' },
  routeCardRow: { flexDirection: 'row', alignItems: 'center', padding: 18 },
  routeIconCol: { marginRight: 14 },
  routeIconCircle: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center' },
  routeInfoCol: { flex: 1, minWidth: 0 },
  routeTitle: { fontFamily: 'Inter_700Bold', fontSize: 18, color: '#185a9d', marginBottom: 2 },
  routeSubtitle: { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#388e3c', marginBottom: 4 },
  routeMixRow: { flexDirection: 'row', alignItems: 'center', marginBottom: 2 },
  routeEcoRow: { flexDirection: 'row', alignItems: 'center', marginTop: 2 },
  routeEcoText: { fontFamily: 'Inter_400Regular', color: '#388e3c', fontSize: 13, marginLeft: 2 },
  routeMetaCol: { alignItems: 'flex-end', marginLeft: 12, minWidth: 80 },
  routeTime: { fontFamily: 'Inter_700Bold', fontSize: 20, color: '#185a9d', marginBottom: 2 },
  routeCost: { fontFamily: 'Inter_400Regular', fontSize: 15, color: '#388e3c', marginBottom: 8 },
  routeBtn: { backgroundColor: '#22c55e', borderRadius: 18, paddingVertical: 8, paddingHorizontal: 18, marginTop: 2 },
  routeBtnText: { color: '#fff', fontFamily: 'Inter_700Bold', fontSize: 15 },
}); 