import React, { useState } from 'react';
import { View, ScrollView, StyleSheet, Text, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { Appbar, Card, Avatar, Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

const quickModes = [
  { label: 'Train', icon: 'train' },
  { label: 'Bus', icon: 'bus' },
  { label: 'Auto', icon: 'car' },
  { label: 'Walk', icon: 'walk' },
];

const suggestions = [
  { title: 'Eco Route to Downtown', ecoScore: 'A+', cta: 'Try this route' },
  { title: 'Fastest to City Park', ecoScore: 'B', cta: 'Try this route' },
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

  return (
    <LinearGradient colors={["#43cea2", "#185a9d", "#6a11cb", "#2575fc"]} style={styles.gradient}>
      {/* Floating glassy header */}
      <MotiView
        from={{ opacity: 0, translateY: -30 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 700 }}
        style={styles.headerWrap}
      >
        <BlurView intensity={60} tint="light" style={styles.headerBlur}>
          <Appbar.Header style={styles.header}>
            <Avatar.Image size={40} source={require('../../assets/icon.png')} />
            <View style={{ flex: 1, marginLeft: 12 }}>
              <Text style={styles.greeting}>Hello, Alex</Text>
              <Text style={styles.location}>📍 Mumbai, India</Text>
            </View>
            <TouchableOpacity>
              <Icon name="bell-outline" size={26} color="#1976d2" />
            </TouchableOpacity>
          </Appbar.Header>
          <View style={styles.searchBarWrap}>
            <BlurView intensity={40} tint="light" style={styles.searchBarBlur}>
              <View style={styles.searchBar}>
                <Icon name="magnify" size={22} color="#1976d2" style={{ marginRight: 8 }} />
                <Text style={styles.searchText}>{search || 'Where do you want to go?'}</Text>
              </View>
            </BlurView>
          </View>
        </BlurView>
      </MotiView>
      {/* Floating glassmorphic main card */}
      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 900, delay: 200 }}
        style={styles.mainCardWrap}
      >
        <BlurView intensity={60} tint="light" style={styles.mainCardBlur}>
          <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickModes}>
              {quickModes.map((mode, idx) => (
                <MotiView
                  key={mode.label}
                  from={{ opacity: 0, scale: 0.7 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ type: 'spring', delay: 300 + idx * 80 }}
                  style={styles.modeBtnWrap}
                >
                  <TouchableOpacity style={styles.modeBtn} activeOpacity={0.85}>
                    <LinearGradient colors={["#43cea2", "#6a11cb"]} style={styles.modeIconWrap}>
                      <Icon name={mode.icon} size={28} color="#fff" />
                    </LinearGradient>
                    <Text style={styles.modeLabel}>{mode.label}</Text>
                  </TouchableOpacity>
                </MotiView>
              ))}
            </ScrollView>
            <Text style={styles.sectionTitle}>Smart Suggestions</Text>
            {suggestions.map((s, i) => (
              <MotiView
                key={i}
                from={{ opacity: 0, translateY: 30 }}
                animate={{ opacity: 1, translateY: 0 }}
                transition={{ type: 'timing', duration: 700, delay: 500 + i * 120 }}
                style={styles.suggestionBlur}
              >
                <BlurView intensity={40} tint="light" style={styles.suggestionBlurInner}>
                  <Card style={styles.suggestionCard}>
                    <Card.Title
                      title={<Text style={styles.cardTitle}>{s.title}</Text>}
                      left={() => <Avatar.Text label={s.ecoScore} size={36} style={{ backgroundColor: '#a5d6a7' }} />}
                      right={() => <Button mode="contained" style={styles.ctaBtn}><Text style={styles.ctaBtnText}>{s.cta}</Text></Button>}
                    />
                  </Card>
                </BlurView>
              </MotiView>
            ))}
            <Text style={styles.sectionTitle}>Eco Stats</Text>
            <MotiView
              from={{ opacity: 0, translateY: 30 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', duration: 700, delay: 800 }}
              style={styles.statsBlur}
            >
              <BlurView intensity={40} tint="light" style={styles.statsBlurInner}>
                <Card style={styles.statsCard}>
                  <Card.Content>
                    <Text style={styles.statsText}>CO₂ Saved: <Text style={styles.statsValue}>2.3kg</Text></Text>
                    <Text style={styles.statsText}>Steps Walked: <Text style={styles.statsValue}>8,200</Text></Text>
                    <Text style={styles.statsText}>Best Trip: <Text style={styles.statsValue}>Marine Drive</Text></Text>
                  </Card.Content>
                </Card>
              </BlurView>
            </MotiView>
          </ScrollView>
        </BlurView>
      </MotiView>
      {/* Floating, pill-shaped bottom nav */}
      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 700, delay: 600 }}
        style={styles.bottomBarWrap}
      >
        <BlurView intensity={50} tint="light" style={styles.bottomBarBlur}>
          <View style={styles.bottomBar}>
            {navTabs.map((tab) => (
              <TouchableOpacity
                key={tab.label}
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
                    size={24}
                    color={activeTab === tab.label ? '#fff' : '#b0bec5'}
                    style={activeTab === tab.label ? styles.activeTabIcon : null}
                  />
                </LinearGradient>
                <Text style={[styles.tabLabel, activeTab === tab.label && styles.activeTabLabel]}>{tab.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </BlurView>
      </MotiView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  headerWrap: { position: 'absolute', top: 0, left: 0, right: 0, zIndex: 10, paddingTop: Platform.OS === 'ios' ? 40 : 20 },
  headerBlur: { marginHorizontal: 16, borderRadius: 32, overflow: 'hidden', marginTop: 12, shadowColor: '#000', shadowOffset: { width: 0, height: 8 }, shadowOpacity: 0.08, shadowRadius: 16, elevation: 8 },
  header: { backgroundColor: 'transparent', elevation: 0, shadowOpacity: 0, alignItems: 'center' },
  greeting: { fontSize: 20, fontWeight: '700', color: '#185a9d', fontFamily: 'Urbanist_700Bold' },
  location: { fontSize: 14, color: '#388e3c', marginTop: 2, fontFamily: 'Urbanist_400Regular' },
  searchBarWrap: { alignItems: 'center', marginTop: -18, marginBottom: 8 },
  searchBarBlur: { borderRadius: 24, overflow: 'hidden' },
  searchBar: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.7)', borderRadius: 24, paddingHorizontal: 18, paddingVertical: 10, width: width * 0.88 },
  searchText: { color: '#b0bec5', fontSize: 16, fontFamily: 'Urbanist_400Regular' },
  mainCardWrap: { flex: 1, marginTop: 140, marginHorizontal: 8, borderRadius: 32, overflow: 'visible', zIndex: 2 },
  mainCardBlur: { borderRadius: 32, overflow: 'hidden', paddingBottom: 100 },
  scrollContent: { paddingBottom: 120, paddingHorizontal: 8 },
  quickModes: { flexDirection: 'row', marginVertical: 18, paddingLeft: 8 },
  modeBtnWrap: { alignItems: 'center', marginRight: 22 },
  modeBtn: { alignItems: 'center' },
  modeIconWrap: { width: 56, height: 56, borderRadius: 28, justifyContent: 'center', alignItems: 'center', marginBottom: 6, shadowColor: '#185a9d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 10, elevation: 6 },
  modeLabel: { fontSize: 13, color: '#185a9d', fontWeight: '600', fontFamily: 'Urbanist_700Bold' },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 18, marginBottom: 8, color: '#1976d2', fontFamily: 'Urbanist_700Bold' },
  suggestionBlur: { borderRadius: 18, marginBottom: 12, overflow: 'visible' },
  suggestionBlurInner: { borderRadius: 18, overflow: 'hidden' },
  suggestionCard: { borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.7)', elevation: 3, shadowColor: '#185a9d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.08, shadowRadius: 10 },
  cardTitle: { fontFamily: 'Urbanist_700Bold', fontSize: 16, color: '#185a9d' },
  ctaBtn: { backgroundColor: '#388e3c', borderRadius: 20, marginRight: 8 },
  ctaBtnText: { color: '#fff', fontFamily: 'Urbanist_700Bold', fontSize: 14 },
  statsBlur: { borderRadius: 18, marginBottom: 16, overflow: 'visible' },
  statsBlurInner: { borderRadius: 18, overflow: 'hidden' },
  statsCard: { borderRadius: 18, backgroundColor: 'rgba(255,255,255,0.7)', elevation: 2 },
  statsText: { fontSize: 16, color: '#388e3c', marginBottom: 4, fontFamily: 'Urbanist_400Regular' },
  statsValue: { fontWeight: 'bold', color: '#1976d2', fontFamily: 'Urbanist_700Bold' },
  bottomBarWrap: { position: 'absolute', left: 0, right: 0, bottom: 24, zIndex: 20 },
  bottomBarBlur: { borderRadius: 32, marginHorizontal: 32, overflow: 'hidden', shadowColor: '#185a9d', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.10, shadowRadius: 12, elevation: 12 },
  bottomBar: { flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.85)', borderRadius: 32, height: 64, paddingHorizontal: 8 },
  tabBtn: { alignItems: 'center', flex: 1 },
  tabIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginBottom: 2 },
  tabLabel: { fontSize: 12, color: '#b0bec5', marginTop: 2, fontFamily: 'Urbanist_700Bold' },
  activeTabLabel: { color: '#185a9d', fontWeight: 'bold' },
  activeTabIcon: { shadowColor: '#185a9d', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 8 },
}); 