import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, Dimensions, TextInput, TouchableOpacity, Platform } from 'react-native';
import { Appbar, Card, Chip, Button, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width } = Dimensions.get('window');

const quickModes = [
  { label: 'Train', icon: 'train', emoji: '🚉' },
  { label: 'Bus', icon: 'bus', emoji: '🚌' },
  { label: 'Auto', icon: 'car', emoji: '🚖' },
  { label: 'Walk', icon: 'walk', emoji: '🚶' },
  { label: 'All', icon: 'car-multiple', emoji: '🚗' },
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
    modeColor: '#43cea2',
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
    modeColor: '#1976d2',
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
    modeColor: '#fbc02d',
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
    <View style={styles.container}>
      <Appbar.Header style={styles.header}>
        <Appbar.Content
          title={<Text style={styles.greeting}>Hello, Bhuwan <Text style={{ fontSize: 22 }}>👋</Text></Text>}
          subtitle={<Text style={styles.subtext}>Where do you want to go today?</Text>}
        />
        <Avatar.Icon size={40} icon="account" style={{ backgroundColor: '#e0f7fa' }} />
      </Appbar.Header>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Search Bar */}
        <View style={styles.searchWrap}>
          <Icon name="magnify" size={22} color="#4fc3f7" style={styles.searchIcon} />
          <TextInput
            placeholder="Enter destination"
            style={styles.searchInput}
            placeholderTextColor="#b0bec5"
          />
        </View>
        {/* Quick Mode */}
        <Text style={styles.sectionTitle}>Quick Mode</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickModes}>
          {quickModes.map((mode, i) => (
            <TouchableOpacity key={mode.label} style={[styles.quickBtn, i === 0 && styles.quickBtnActive]}>
              <Text style={[styles.quickEmoji, i === 0 && styles.quickEmojiActive]}>{mode.emoji}</Text>
              <Text style={[styles.quickLabel, i === 0 && styles.quickLabelActive]}>{mode.label}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
        {/* Travel Gallery */}
        <Text style={styles.sectionTitle}>Travel Gallery</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.galleryScroll}>
          {gallery.map((item, i) => (
            <View key={i} style={styles.galleryCard}>
              <Image source={{ uri: item.src }} style={styles.galleryImg} />
              <View style={styles.galleryOverlay} />
              <Text style={styles.galleryLabel}>{item.label}</Text>
            </View>
          ))}
        </ScrollView>
        <TouchableOpacity style={styles.viewAllBtn}>
          <Text style={styles.viewAllText}>View all photos</Text>
          <Icon name="arrow-right" size={16} color="#1976d2" />
        </TouchableOpacity>
        {/* Smart Route Suggestions */}
        <Text style={styles.sectionTitle}>Smart Route Suggestions</Text>
        {suggestions.map((s, i) => (
          <Card key={i} style={styles.suggestionCard}>
            <View style={styles.suggestionHeader}>
              <View style={[styles.modeCircle, { backgroundColor: s.modeColor + '22' }]}> {/* 22 for light bg */}
                <Icon name={s.modeIcon} size={24} color={s.modeColor} />
              </View>
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
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f7fafc' },
  header: { backgroundColor: '#4fc3f7', elevation: 0 },
  greeting: { fontSize: 22, fontWeight: '700', color: '#185a9d', fontFamily: 'Urbanist_700Bold' },
  subtext: { fontSize: 15, color: '#388e3c', fontFamily: 'Urbanist_400Regular' },
  scrollContent: { padding: 16, paddingBottom: 80 },
  searchWrap: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#fff', borderRadius: 18, paddingHorizontal: 16, paddingVertical: 10, marginBottom: 16, shadowColor: '#185a9d', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.06, shadowRadius: 8, elevation: 2 },
  searchIcon: { marginRight: 8 },
  searchInput: { flex: 1, fontSize: 16, color: '#185a9d', fontFamily: 'Urbanist_400Regular', paddingVertical: Platform.OS === 'ios' ? 8 : 0 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 18, marginBottom: 8, color: '#1976d2', fontFamily: 'Urbanist_700Bold' },
  quickModes: { flexDirection: 'row', marginBottom: 8 },
  quickBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: '#e0f2f1', borderRadius: 16, paddingHorizontal: 16, paddingVertical: 10, marginRight: 10 },
  quickBtnActive: { backgroundColor: '#43cea2' },
  quickEmoji: { fontSize: 18, marginRight: 6 },
  quickEmojiActive: { color: '#fff' },
  quickLabel: { fontSize: 14, fontWeight: '600', color: '#185a9d', fontFamily: 'Urbanist_700Bold' },
  quickLabelActive: { color: '#fff' },
  galleryScroll: { flexDirection: 'row', marginBottom: 8 },
  galleryCard: { width: 120, height: 120, borderRadius: 18, marginRight: 12, overflow: 'hidden', backgroundColor: '#e0eafc', shadowColor: '#185a9d', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.08, shadowRadius: 8, elevation: 2, position: 'relative' },
  galleryImg: { width: '100%', height: '100%' },
  galleryOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.18)' },
  galleryLabel: { position: 'absolute', left: 0, right: 0, bottom: 8, color: '#fff', fontWeight: '600', fontSize: 13, textAlign: 'center', fontFamily: 'Urbanist_700Bold', textShadowColor: 'rgba(0,0,0,0.18)', textShadowOffset: { width: 0, height: 1 }, textShadowRadius: 4 },
  viewAllBtn: { flexDirection: 'row', alignItems: 'center', alignSelf: 'center', marginBottom: 8, marginTop: 2 },
  viewAllText: { color: '#1976d2', fontWeight: '600', fontFamily: 'Urbanist_700Bold', marginRight: 4 },
  suggestionCard: { marginBottom: 16, borderRadius: 18, backgroundColor: '#fff', elevation: 3, shadowColor: '#185a9d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10, padding: 0 },
  suggestionHeader: { flexDirection: 'row', alignItems: 'center', marginBottom: 8, paddingHorizontal: 8, paddingTop: 8 },
  modeCircle: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  suggestionTitle: { fontSize: 16, fontWeight: 'bold', color: '#185a9d', fontFamily: 'Urbanist_700Bold' },
  suggestionSubtitle: { fontSize: 13, color: '#388e3c', fontFamily: 'Urbanist_400Regular' },
  suggestionTime: { fontSize: 16, fontWeight: 'bold', color: '#185a9d', fontFamily: 'Urbanist_700Bold' },
  suggestionCost: { fontSize: 13, color: '#388e3c', fontFamily: 'Urbanist_400Regular' },
  suggestionMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 8, paddingBottom: 8 },
  suggestionMetaGroup: { flexDirection: 'row', alignItems: 'center', marginRight: 12 },
  suggestionMetaText: { fontSize: 13, color: '#388e3c', marginLeft: 4, fontFamily: 'Urbanist_400Regular' },
  viewRouteBtn: { backgroundColor: '#388e3c', borderRadius: 16, paddingHorizontal: 18, marginLeft: 'auto', elevation: 0, height: 36, justifyContent: 'center' },
  viewRouteLabel: { fontWeight: 'bold', fontFamily: 'Urbanist_700Bold', fontSize: 14 },
}); 