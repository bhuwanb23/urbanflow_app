import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions, SafeAreaView, ActivityIndicator } from 'react-native';
import { Appbar, Card, Chip, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const mapImg = 'https://images.unsplash.com/photo-1477959858617-67f85cf4f1df';

const trafficConditions = [
  { level: 'High Traffic', icon: 'trending-up', color: '#ef4444', place: 'Main Highway', change: '+28% than usual', delay: '45 min delay', delayColor: '#ef4444' },
  { level: 'Moderate', icon: 'trending-flat', color: '#facc15', place: 'City Center', change: 'Normal flow', delay: '15 min delay', delayColor: '#facc15' },
  { level: 'Light Traffic', icon: 'trending-down', color: '#22c55e', place: 'Residential Areas', change: '-10% than usual', delay: 'No delays', delayColor: '#22c55e' },
  { level: 'Road Work', icon: 'information', color: '#3b82f6', place: 'West Boulevard', change: 'Lane closed', delay: 'Avoid if possible', delayColor: '#3b82f6' },
];

const recentUpdates = [
  { icon: 'alert-circle', color: '#ef4444', bg: '#fee2e2', title: 'Accident Reported', desc: 'Major intersection at Park Road and Main Street', time: '2 minutes ago', impact: 'Severe impact', impactColor: '#ef4444', impactIcon: 'alert' },
  { icon: 'tools', color: '#facc15', bg: '#fef9c3', title: 'New Construction Zone', desc: 'Highway 101 southbound near exit 25', time: '15 minutes ago', impact: 'Moderate delay', impactColor: '#facc15', impactIcon: 'clock-outline' },
  { icon: 'check-circle', color: '#22c55e', bg: '#bbf7d0', title: 'Road Cleared', desc: 'Downtown expressway now open after earlier incident', time: '28 minutes ago', impact: 'Traffic normalizing', impactColor: '#22c55e', impactIcon: 'check-circle' },
];

const popularRoutes = [
  { from: 'Home', fromIcon: 'home', fromColor: '#6366f1', to: 'Work', toIcon: 'briefcase', toColor: '#10b981', time: '32 min', progress: 0.65, usual: '25 min', status: 'Moderate traffic', statusColor: '#facc15', barColor: '#facc15' },
  { from: 'Home', fromIcon: 'home', fromColor: '#6366f1', to: 'School', toIcon: 'school', toColor: '#10b981', time: '15 min', progress: 0.2, usual: '18 min', status: 'Light traffic', statusColor: '#22c55e', barColor: '#22c55e' },
  { from: 'Work', fromIcon: 'briefcase', fromColor: '#10b981', to: 'Restaurant', toIcon: 'silverware-fork-knife', toColor: '#f59e42', time: '48 min', progress: 0.85, usual: '30 min', status: 'Heavy traffic', statusColor: '#ef4444', barColor: '#ef4444' },
];

const transitStatus = [
  { icon: 'train', color: '#6366f1', bg: '#e0e7ff', title: 'Metro Line A', status: 'On time', statusColor: '#22c55e', statusBg: '#bbf7d0', desc: 'Next train in 4 minutes' },
  { icon: 'bus', color: '#10b981', bg: '#d1fae5', title: 'Bus Route 42', status: 'Slight delay', statusColor: '#facc15', statusBg: '#fef9c3', desc: 'Next bus in 8 minutes' },
  { icon: 'tram', color: '#ef4444', bg: '#fee2e2', title: 'Tram Line 3', status: 'Disrupted', statusColor: '#ef4444', statusBg: '#fee2e2', desc: 'Service suspended due to maintenance' },
];

export default function LiveScreen() {
    const [loading, setLoading] = useState(true);
    useEffect(() => {
        // Simulate network loading
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);
    if (loading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={{ marginTop: 16, color: '#6366f1', fontFamily: 'Poppins_400Regular', fontSize: 16 }}>Loading live data...</Text>
            </SafeAreaView>
        );
    }
  return (
    <SafeAreaView style={styles.container}>
      {/* Gradient Header */}
      <LinearGradient colors={["#6366f1", "#10b981"]} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <View>
            <Text style={styles.headerTitle}>Live Traffic</Text>
            <Text style={styles.headerSubtitle}>Real-time updates and conditions</Text>
          </View>
          <View style={styles.headerChipWrap}>
            <Chip style={styles.liveChip} textStyle={styles.liveChipText}>
              <View style={styles.liveDot} /> Live
            </Chip>
          </View>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Map Image */}
        <MotiView from={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 700 }}>
          <View style={styles.mapWrap}>
            <Image source={{ uri: mapImg }} style={styles.mapImg} />
            <View style={styles.mapOverlay} />
            <TouchableOpacity style={styles.mapBtn}>
              <Icon name="crosshairs-gps" size={22} color="#6366f1" />
            </TouchableOpacity>
            <View style={styles.mapUpdated}><Text style={styles.mapUpdatedText}>Updated 2 mins ago</Text></View>
          </View>
        </MotiView>
        {/* Traffic Conditions */}
        <View style={styles.sectionRow}>
          <Text style={styles.sectionTitle}>Traffic Conditions</Text>
          <TouchableOpacity style={styles.refreshBtn}>
            <Icon name="refresh" size={16} color="#6366f1" style={{ marginRight: 4 }} />
            <Text style={styles.refreshText}>Refresh</Text>
          </TouchableOpacity>
        </View>
        <View style={styles.trafficGrid}>
          {trafficConditions.map((t, i) => (
            <MotiView key={i} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: 200 + i * 80 }}>
              <View style={styles.trafficCard}>
                <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
                  <Icon name={t.icon} size={22} color={t.color} style={{ marginRight: 6 }} />
                  <Text style={styles.trafficLevel}>{t.level}</Text>
                </View>
                <Text style={styles.trafficPlace}>{t.place}</Text>
                <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginTop: 4 }}>
                  <Text style={styles.trafficChange}>{t.change}</Text>
                  <Text style={[styles.trafficDelay, { color: t.delayColor }]}>{t.delay}</Text>
                </View>
              </View>
            </MotiView>
          ))}
        </View>
        {/* Recent Updates */}
        <Text style={styles.sectionTitle}>Recent Updates</Text>
        {recentUpdates.map((u, i) => (
          <MotiView key={i} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: 400 + i * 100 }}>
            <View style={styles.updateCard}>
              <View style={{ flexDirection: 'row', alignItems: 'flex-start' }}>
                <View style={[styles.updateIconWrap, { backgroundColor: u.bg }]}> 
                  <Icon name={u.icon} size={22} color={u.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <Text style={styles.updateTitle}>{u.title}</Text>
                  <Text style={styles.updateDesc}>{u.desc}</Text>
                  <View style={styles.updateMetaRow}>
                    <Text style={styles.updateTime}>{u.time}</Text>
                    <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                      <Text style={[styles.updateImpact, { color: u.impactColor }]}>{u.impact}</Text>
                      <Icon name={u.impactIcon} size={16} color={u.impactColor} style={{ marginLeft: 2 }} />
                    </View>
                  </View>
                </View>
              </View>
            </View>
          </MotiView>
        ))}
        {/* Popular Routes */}
        <Text style={styles.sectionTitle}>Popular Routes</Text>
        {popularRoutes.map((r, i) => (
          <MotiView key={i} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: 600 + i * 100 }}>
            <View style={styles.popularCard}>
              <View style={styles.popularHeader}>
                <View style={styles.popularRouteRow}>
                  <Icon name={r.fromIcon} size={20} color={r.fromColor} />
                  <Text style={styles.popularRouteText}>{r.from}</Text>
                  <Text style={styles.popularArrow}>→</Text>
                  <Icon name={r.toIcon} size={20} color={r.toColor} />
                  <Text style={styles.popularRouteText}>{r.to}</Text>
                </View>
                <Text style={styles.popularTime}>{r.time}</Text>
              </View>
              <ProgressBar progress={r.progress} color={r.barColor} style={styles.popularBar} />
              <View style={styles.popularMetaRow}>
                <Text style={styles.popularUsual}>Usual: {r.usual}</Text>
                <Text style={[styles.popularStatus, { color: r.statusColor }]}>{r.status}</Text>
              </View>
            </View>
          </MotiView>
        ))}
        {/* Transit Status */}
        <Text style={styles.sectionTitle}>Transit Status</Text>
        {transitStatus.map((t, i) => (
          <MotiView key={i} from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', delay: 800 + i * 100 }}>
            <View style={styles.transitCard}>
              <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                <View style={[styles.transitIconWrap, { backgroundColor: t.bg }]}> 
                  <Icon name={t.icon} size={22} color={t.color} />
                </View>
                <View style={{ flex: 1 }}>
                  <View style={styles.transitHeaderRow}>
                    <Text style={styles.transitTitle}>{t.title}</Text>
                    <View style={[styles.transitStatus, { backgroundColor: t.statusBg }]}> 
                      <Text style={[styles.transitStatusText, { color: t.statusColor }]}>{t.status}</Text>
                    </View>
                  </View>
                  <Text style={styles.transitDesc}>{t.desc}</Text>
                </View>
              </View>
            </View>
          </MotiView>
        ))}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F9FAFB' },
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
  headerChipWrap: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  liveChip: { backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: 16, marginRight: 8, paddingHorizontal: 10, paddingVertical: 0, alignItems: 'center' },
  liveChipText: { color: '#fff', fontWeight: 'bold', fontFamily: 'Poppins_700Bold' },
  liveDot: { width: 8, height: 8, borderRadius: 4, backgroundColor: '#fff', marginRight: 6, marginTop: 2 },
  scrollContent: { padding: 20, paddingBottom: 80 },
  mapWrap: { width: '100%', height: 200, borderRadius: 22, overflow: 'hidden', marginBottom: 18, position: 'relative', backgroundColor: '#fff', shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 10, elevation: 3 },
  mapImg: { width: '100%', height: '100%' },
  mapOverlay: { ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.10)' },
  mapBtn: { position: 'absolute', bottom: 16, right: 16, backgroundColor: '#fff', borderRadius: 24, padding: 10, shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.12, shadowRadius: 8, elevation: 4 },
  mapUpdated: { position: 'absolute', top: 16, right: 16, backgroundColor: '#fff', borderRadius: 12, paddingHorizontal: 12, paddingVertical: 4, shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 6, elevation: 2 },
  mapUpdatedText: { color: '#6366f1', fontSize: 13, fontWeight: '700', fontFamily: 'Poppins_700Bold' },
  sectionRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginTop: 22, marginBottom: 12, color: '#6366f1', fontFamily: 'Poppins_700Bold', letterSpacing: 0.2 },
  refreshBtn: { flexDirection: 'row', alignItems: 'center', padding: 4 },
  refreshText: { color: '#6366f1', fontWeight: '700', fontFamily: 'Poppins_700Bold', fontSize: 14 },
  trafficGrid: { flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: 8 },
  trafficCard: { width: (width - 48) / 2, backgroundColor: '#fff', borderRadius: 18, padding: 12, elevation: 2, shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#E5E7EB' },
  trafficLevel: { fontSize: 16, fontWeight: 'bold', color: '#6366f1', fontFamily: 'Poppins_700Bold' },
  trafficPlace: { fontSize: 14, color: '#64748b', fontFamily: 'Urbanist_400Regular', marginBottom: 2 },
  trafficChange: { fontSize: 13, color: '#9ca3af', fontFamily: 'Urbanist_400Regular' },
  trafficDelay: { fontSize: 13, fontWeight: 'bold', fontFamily: 'Poppins_700Bold' },
  updateCard: { borderRadius: 18, backgroundColor: '#fff', elevation: 2, shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 10, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  updateIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  updateTitle: { fontSize: 16, fontWeight: 'bold', color: '#6366f1', fontFamily: 'Poppins_700Bold' },
  updateDesc: { fontSize: 14, color: '#64748b', fontFamily: 'Urbanist_400Regular', marginBottom: 2 },
  updateMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: 2 },
  updateTime: { fontSize: 13, color: '#9ca3af', fontFamily: 'Urbanist_400Regular' },
  updateImpact: { fontSize: 13, fontWeight: 'bold', fontFamily: 'Poppins_700Bold' },
  popularCard: { borderRadius: 18, backgroundColor: '#fff', elevation: 2, shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 10, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  popularHeader: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 },
  popularRouteRow: { flexDirection: 'row', alignItems: 'center' },
  popularRouteText: { fontSize: 15, color: '#6366f1', fontWeight: '700', fontFamily: 'Poppins_700Bold', marginHorizontal: 2 },
  popularArrow: { color: '#9ca3af', fontSize: 17, marginHorizontal: 2 },
  popularTime: { fontSize: 16, fontWeight: 'bold', color: '#6366f1', fontFamily: 'Poppins_700Bold' },
  popularBar: { height: 8, borderRadius: 4, marginVertical: 6, backgroundColor: '#f3f4f6' },
  popularMetaRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  popularUsual: { fontSize: 13, color: '#9ca3af', fontFamily: 'Urbanist_400Regular' },
  popularStatus: { fontSize: 13, fontWeight: 'bold', fontFamily: 'Poppins_700Bold' },
  transitCard: { borderRadius: 18, backgroundColor: '#fff', elevation: 2, shadowColor: '#0EA5E9', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.10, shadowRadius: 10, padding: 12, marginBottom: 14, borderWidth: 1, borderColor: '#E5E7EB' },
  transitIconWrap: { width: 40, height: 40, borderRadius: 20, justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  transitHeaderRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  transitTitle: { fontSize: 16, fontWeight: 'bold', color: '#6366f1', fontFamily: 'Poppins_700Bold' },
  transitStatus: { borderRadius: 10, paddingHorizontal: 8, paddingVertical: 2, marginLeft: 8 },
  transitStatusText: { fontSize: 13, fontWeight: 'bold', fontFamily: 'Poppins_700Bold' },
  transitDesc: { fontSize: 14, color: '#64748b', fontFamily: 'Urbanist_400Regular', marginTop: 2 },
}); 