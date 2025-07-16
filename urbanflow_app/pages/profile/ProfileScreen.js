import React from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import { Appbar, Card, Button, Avatar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';

const { width } = Dimensions.get('window');

const profile = {
  name: 'Bhuwan B',
  email: 'bhuwan.b@urbanflow.com',
  avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
};

const settings = [
  { label: 'Language & Region', icon: 'web', color: ['#3b82f6', '#1e40af'], bg: '#e0eaff' },
  { label: 'Preferred Transport', icon: 'bus', color: ['#22c55e', '#4ade80'], bg: '#d1fae5' },
  { label: 'Notifications', icon: 'bell', color: ['#facc15', '#fbbf24'], bg: '#fef9c3' },
  { label: 'Mobility Goals', icon: 'target', color: ['#a78bfa', '#f472b6'], bg: '#ede9fe' },
  { label: 'Privacy', icon: 'shield-lock', color: ['#ef4444', '#f87171'], bg: '#fee2e2' },
];

const sustainability = [
  { label: 'CO₂ Saved', value: '24.5 kg', icon: 'leaf', color: ['#4ade80', '#16a34a'], percent: '+12%', percentColor: '#16a34a', bg: '#f0fdf4' },
  { label: 'Distance Walked', value: '142 km', icon: 'walk', color: ['#3b82f6', '#1e40af'], percent: '+8%', percentColor: '#2563eb', bg: '#eff6ff' },
  { label: 'Public Transport', value: '28 trips', icon: 'subway-variant', color: ['#a78bfa', '#f472b6'], percent: '+15%', percentColor: '#a21caf', bg: '#f5f3ff' },
];

export default function ProfileScreen() {
  return (
    <LinearGradient colors={["#667eea", "#764ba2"]} style={styles.gradient}>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <BlurView intensity={60} tint="light" style={styles.headerBlur}>
          <View style={styles.headerRow}>
            <TouchableOpacity style={styles.headerBtn}>
              <Icon name="arrow-left" size={22} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Profile</Text>
            <TouchableOpacity style={styles.headerBtn}>
              <Icon name="dots-vertical" size={22} color="#fff" />
            </TouchableOpacity>
          </View>
          <View style={styles.profileInfo}>
            <View style={styles.avatarWrap}>
              <Image source={{ uri: profile.avatar }} style={styles.avatarImg} />
              <TouchableOpacity style={styles.avatarEditBtn}>
                <Icon name="camera" size={16} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
            <TouchableOpacity style={styles.editProfileBtn}>
              <Icon name="pencil" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </View>
        </BlurView>
        {/* Settings */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Settings</Text>
          <BlurView intensity={40} tint="light" style={styles.settingsBlur}>
            {settings.map((s, i) => (
              <TouchableOpacity key={s.label} style={[styles.settingItem, i !== settings.length - 1 && styles.settingItemBorder]}>
                <View style={styles.settingLeft}>
                  <LinearGradient colors={s.color} style={styles.settingIconWrap}>
                    <Icon name={s.icon} size={22} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.settingLabel}>{s.label}</Text>
                </View>
                <Icon name="chevron-right" size={22} color="#b0bec5" />
              </TouchableOpacity>
            ))}
          </BlurView>
        </View>
        {/* Sustainability Impact */}
        <View style={styles.sectionWrap}>
          <Text style={styles.sectionTitle}>Sustainability Impact</Text>
          <BlurView intensity={40} tint="light" style={styles.sustainBlur}>
            {sustainability.map((s, i) => (
              <View key={s.label} style={styles.sustainItem}>
                <LinearGradient colors={s.color} style={styles.sustainIconWrap}>
                  <Icon name={s.icon} size={24} color="#fff" />
                </LinearGradient>
                <View style={{ flex: 1 }}>
                  <Text style={styles.sustainLabel}>{s.label}</Text>
                  <Text style={styles.sustainValue}>{s.value}</Text>
                </View>
                <View style={{ alignItems: 'flex-end' }}>
                  <Text style={[styles.sustainPercent, { color: s.percentColor }]}>{s.percent}</Text>
                  <Text style={styles.sustainMonth}>This month</Text>
                </View>
              </View>
            ))}
          </BlurView>
        </View>
        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutBtn}>
          <Icon name="logout" size={20} color="#fff" style={{ marginRight: 8 }} />
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>
      </ScrollView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  gradient: { flex: 1 },
  scrollContent: { paddingBottom: 40 },
  headerBlur: { marginBottom: 18, borderBottomLeftRadius: 32, borderBottomRightRadius: 32, overflow: 'hidden', paddingBottom: 24 },
  headerRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingHorizontal: 18, paddingTop: 48, marginBottom: 8 },
  headerBtn: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 20, padding: 8 },
  headerTitle: { color: '#fff', fontSize: 22, fontWeight: '700', fontFamily: 'Urbanist_700Bold' },
  profileInfo: { alignItems: 'center', marginTop: 2 },
  avatarWrap: { position: 'relative', marginBottom: 10 },
  avatarImg: { width: 96, height: 96, borderRadius: 48, borderWidth: 4, borderColor: '#fff', backgroundColor: '#e0eafc', shadowColor: '#000', shadowOffset: { width: 0, height: 4 }, shadowOpacity: 0.12, shadowRadius: 12, elevation: 6 },
  avatarEditBtn: { position: 'absolute', bottom: 0, right: 0, width: 32, height: 32, borderRadius: 16, backgroundColor: '#22c55e', borderWidth: 3, borderColor: '#fff', alignItems: 'center', justifyContent: 'center', shadowColor: '#22c55e', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.18, shadowRadius: 8, elevation: 4 },
  profileName: { color: '#fff', fontSize: 24, fontWeight: '700', fontFamily: 'Urbanist_700Bold', marginBottom: 2 },
  profileEmail: { color: 'rgba(255,255,255,0.8)', fontSize: 15, fontFamily: 'Urbanist_400Regular', marginBottom: 10 },
  editProfileBtn: { flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 22, paddingHorizontal: 22, paddingVertical: 8, marginBottom: 2 },
  editProfileText: { color: '#fff', fontWeight: '600', fontFamily: 'Urbanist_700Bold', fontSize: 15 },
  sectionWrap: { marginTop: 18, paddingHorizontal: 18 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', color: '#1976d2', fontFamily: 'Urbanist_700Bold', marginBottom: 10 },
  settingsBlur: { borderRadius: 22, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.7)' },
  settingItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 10, backgroundColor: 'transparent' },
  settingItemBorder: { borderBottomWidth: 1, borderBottomColor: '#e0eafc' },
  settingLeft: { flexDirection: 'row', alignItems: 'center' },
  settingIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  settingLabel: { fontSize: 15, color: '#22223b', fontWeight: '600', fontFamily: 'Urbanist_700Bold' },
  sustainBlur: { borderRadius: 22, overflow: 'hidden', backgroundColor: 'rgba(255,255,255,0.7)', marginBottom: 8 },
  sustainItem: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: 18, paddingHorizontal: 10, backgroundColor: 'transparent' },
  sustainIconWrap: { width: 48, height: 48, borderRadius: 24, justifyContent: 'center', alignItems: 'center', marginRight: 14 },
  sustainLabel: { fontSize: 15, color: '#22223b', fontWeight: '600', fontFamily: 'Urbanist_700Bold' },
  sustainValue: { fontSize: 20, color: '#185a9d', fontWeight: '700', fontFamily: 'Urbanist_700Bold' },
  sustainPercent: { fontSize: 15, fontWeight: '700', fontFamily: 'Urbanist_700Bold' },
  sustainMonth: { fontSize: 12, color: '#b0bec5', fontFamily: 'Urbanist_400Regular' },
  logoutBtn: { flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ef4444', borderRadius: 22, paddingVertical: 16, marginHorizontal: 18, marginTop: 24, marginBottom: 18, elevation: 2 },
  logoutText: { color: '#fff', fontWeight: '700', fontFamily: 'Urbanist_700Bold', fontSize: 16 },
}); 