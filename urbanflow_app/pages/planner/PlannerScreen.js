import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Appbar, Card, Chip, Button, Avatar } from 'react-native-paper';
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

export default function PlannerScreen() {
  return (
    <LinearGradient colors={["#e0eafc", "#cfdef3", "#43cea2"]} style={styles.gradient}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title={<Text style={styles.greeting}>Hello, Bhuwan <Text style={{ fontSize: 26 }}>👋</Text></Text>}
          subtitle={<Text style={styles.subtext}>Where do you want to go today?</Text>}
        />
        <Avatar.Icon size={44} icon="account" style={{ backgroundColor: '#e0f7fa' }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700 }}>
          <BlurView intensity={60} tint="light" style={styles.searchWrap}>
            <Icon name="magnify" size={22} color="#4fc3f7" style={styles.searchIcon} />
            <TextInput
              placeholder="Enter destination"
              style={styles.searchInput}
              placeholderTextColor="#b0bec5"
            />
          </BlurView>
        </MotiView>
        {/* Quick Mode */}
        <Text style={styles.sectionTitle}>Quick Mode</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickModes}>
          {quickModes.map((mode, i) => (
            <MotiView key={mode.label} from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'spring', delay: 200 + i * 60 }}>
              <TouchableOpacity style={styles.quickBtn} activeOpacity={0.85}>
                <LinearGradient colors={mode.color} style={styles.quickBtnGradient}>
                  <Text style={styles.quickEmoji}>{mode.emoji}</Text>
                  <Text style={styles.quickLabel}>{mode.label}</Text>
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>
          ))}
        </ScrollView>
        {/* Travel Gallery */}
        <Text style={styles.sectionTitle}>Travel Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
          {gallery.map((item, i) => (
            <MotiView key={i} from={{ opacity: 0, scale: 0.8 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', delay: 400 + i * 80 }}>
              <View style={styles.galleryCard}>
                <Image source={{ uri: item.src }} style={styles.galleryImg} />
                <View style={styles.galleryOverlay} />
                <Text style={styles.galleryLabel}>{item.label}</Text>
              </View>
            </MotiView>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View all photos</Text>
          <Icon name="arrow-right" size={16} color="#1976d2" />
        </TouchableOpacity>
        {/* Smart Route Suggestions */}
        <Text style={styles.sectionTitle}>Smart Route Suggestions</Text>
        {suggestions.map((s, i) => (
          <MotiView key={i} from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: 600 + i * 120 }}>
            <BlurView intensity={50} tint="light" style={styles.suggestionBlur}>
              <Card style={styles.suggestionCard}>
                <View style={styles.suggestionHeader}>
                  <LinearGradient colors={s.modeColor} style={styles.modeCircle}>
                    <Icon name={s.modeIcon} size={24} color="#fff" />
                  </LinearGradient>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.suggestionTitle}>{s.title}</Text>
                    <Text style={styles.suggestionSubtitle}>{s.subtitle}</Text>
                  </View>
                  <View style={{ alignItems: 'flex-end' }}>
                    <Text style={styles.suggestionTime}>{s.time}</Text>
                    <Text style={styles.suggestionCost}>{s.cost}</Text>
                  </View>
                </View>
                <View style={styles.suggestionMetaRow}>
                  <View style={styles.suggestionMetaGroup}>
                    <Icon name="leaf" size={16} color="#43cea2" />
                    <Text style={styles.suggestionMetaText}>Eco Score: {s.eco}</Text>
                  </View>
                  <View style={styles.suggestionMetaGroup}>
                    <Icon name="cloud" size={16} color="#b0bec5" />
                    <Text style={styles.suggestionMetaText}>{s.co2} saved</Text>
                  </View>
                  <Button mode="contained" style={styles.viewRouteBtn} labelStyle={styles.viewRouteLabel}>View Route</Button>
                </View>
              </Card>
            </BlurView>
          </MotiView>
        ))}
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  header: { backgroundColor: 'transparent', elevation: 0 },
  greeting: { fontSize: 26, fontWeight: '700', color: '#185a9d', fontFamily: 'Urbanist_700Bold', marginBottom: 2 },
  subtext: { fontSize: 17, color: '#388e3c', fontFamily: 'Urbanist_400Regular', marginBottom: 2 },
  scrollContent: { padding: 16, paddingBottom: 80 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 22, paddingHorizontal: 18, paddingVertical: 12, marginBottom: 18, shadowColor: '#185a9d', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 4 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 17, color: '#185a9d', fontFamily: 'Urbanist_400Regular', paddingVertical: Platform.OS === 'ios' ? 8 : 0 },
  sectionTitle: { fontSize: 20, fontWeight: 'bold', marginTop: 22, marginBottom: 10, color: '#1976d2', fontFamily: 'Urbanist_700Bold', letterSpacing: 0.2 },
  quickModes: { flexDirection: 'row', marginBottom: 8 },
  quickBtn: { marginRight: 12, borderRadius: 18, overflow: 'hidden', elevation: 2 },
  quickBtnGradient: { flexDirection: 'row', alignItems: 'center', paddingHorizontal: 18, paddingVertical: 12, borderRadius: 18 },
  quickEmoji: { fontSize: 20, marginRight: 8, color: '#fff', fontFamily: 'Urbanist_700Bold' },
  quickLabel: { fontSize: 15, fontWeight: '600', color: '#fff', fontFamily: 'Urbanist_700Bold' },
  galleryScroll: { flexDirection: 'row', marginBottom: 8 },
  galleryCard: { width: 130, height: 130, borderRadius: 20, marginRight: 14, overflow: 'hidden', backgroundColor: '#e0eafc', shadowColor: '#185a9d', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 3, position: 'relative' },
  galleryImg: { width: '100%', height: '100%' },
  galleryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  galleryLabel: { position: 'absolute', left: 0, right: 0, bottom: 10, color: '#fff', fontWeight: '700', fontSize: 15, textAlign: 'center', fontFamily: 'Urbanist_700Bold', textShadowColor: 'rgba(0,0,0,0.18)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: 8, marginTop: 2 },
  viewAllText: { color: '#1976d2', fontWeight: '700', fontFamily: 'Urbanist_700Bold', marginRight: 4, fontSize: 15 },
  suggestionBlur: { borderRadius: 22, marginBottom: 18, overflow: 'hidden' },
  suggestionCard: { borderRadius: 22, backgroundColor: 'rgba(255,255,255,0.8)', elevation: 3, shadowColor: '#185a9d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12, padding: 0 },
  suggestionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 12, paddingTop: 12 },
  modeCircle: { width: 44, height: 44, borderRadius: 22, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  suggestionTitle: { fontSize: 17, fontWeight: 'bold', color: '#185a9d', fontFamily: 'Urbanist_700Bold' },
  suggestionSubtitle: { fontSize: 14, color: '#388e3c', fontFamily: 'Urbanist_400Regular' },
  suggestionTime: { fontSize: 17, fontWeight: 'bold', color: '#185a9d', fontFamily: 'Urbanist_700Bold' },
  suggestionCost: { fontSize: 14, color: '#388e3c', fontFamily: 'Urbanist_400Regular' },
  suggestionMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 12, paddingBottom: 12 },
  suggestionMetaGroup: { flexDirection: 'row', alignItems: 'center', marginRight: 14 },
  suggestionMetaText: { fontSize: 14, color: '#388e3c', marginLeft: 4, fontFamily: 'Urbanist_400Regular' },
  viewRouteBtn: { backgroundColor: '#388e3c', borderRadius: 16, paddingHorizontal: 20, marginLeft: 'auto', elevation: 0, height: 38, justifyContent: 'center' },
  viewRouteLabel: { fontWeight: 'bold', fontFamily: 'Urbanist_700Bold', fontSize: 15 },
}); 