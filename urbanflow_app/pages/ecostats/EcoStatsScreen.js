import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart, Grid, XAxis, YAxis } from 'react-native-svg-charts';
import * as scale from 'd3-scale';

const ecoData = [2.1, 1.8, 2.5, 1.9, 2.3, 2.8, 1.8];
const ecoLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const screenWidth = Dimensions.get('window').width;

export default function EcoStatsScreen() {
  return (
    <ScrollView style={{ flex: 1, backgroundColor: '#F9FAFB' }} showsVerticalScrollIndicator={false}>
      {/* Header */}
      <LinearGradient
        colors={["#10B981", "#059669"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.header}
      >
        <View style={styles.headerRow}>
          <Icon name="arrow-left" size={24} color="#fff" />
          <Icon name="bell" size={24} color="#fff" />
        </View>
        <Text style={styles.headerTitle}>Your Sustainability Stats</Text>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <Text style={{ fontSize: 22, marginRight: 8 }}>🌱</Text>
          <Text style={styles.headerSubtitle}>Keep up the great work!</Text>
        </View>
      </LinearGradient>

      {/* Stat Cards */}
      <View style={styles.cardsContainer}>
        <View style={{ flexDirection: 'row', gap: 16 }}>
          {/* CO2 Saved */}
          <Card style={styles.statCard}>
            <View style={styles.cardIconRow}>
              <View style={[styles.iconBg, { backgroundColor: '#D1FAE5' }]}> 
                <Icon name="leaf" size={22} color="#10B981" />
              </View>
            </View>
            <Text style={styles.cardLabel}>CO₂ Saved</Text>
            <Text style={styles.cardValue}>14.2 kg</Text>
            <View style={styles.cardChangeRow}>
              <Icon name="arrow-up" size={14} color="#10B981" style={{ marginRight: 2 }} />
              <Text style={styles.cardChangeText}>+2.1kg</Text>
            </View>
          </Card>
          {/* Distance Walked */}
          <Card style={styles.statCard}>
            <View style={styles.cardIconRow}>
              <View style={[styles.iconBg, { backgroundColor: '#EFF6FF' }]}> 
                <Icon name="walk" size={22} color="#3B82F6" />
              </View>
            </View>
            <Text style={styles.cardLabel}>Distance Walked</Text>
            <Text style={styles.cardValue}>12.8 km</Text>
            <View style={styles.cardChangeRow}>
              <Icon name="arrow-up" size={14} color="#10B981" style={{ marginRight: 2 }} />
              <Text style={styles.cardChangeText}>+3.2km</Text>
            </View>
          </Card>
        </View>
        {/* Public Transport Trips */}
        <Card style={[styles.statCard, { marginTop: 16, width: '100%' }]}> 
          <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
              <View style={[styles.iconBg, { backgroundColor: '#FFF7ED', padding: 12, marginRight: 12 }]}> 
                <Icon name="bus" size={26} color="#F97316" />
              </View>
              <View>
                <Text style={[styles.cardLabel, { fontSize: 15 }]}>Public Transport Trips</Text>
                <Text style={styles.transportValue}>17</Text>
              </View>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: '#10B981', fontWeight: '600', fontSize: 14 }}>+5 trips</Text>
              <Text style={{ color: '#6B7280', fontSize: 12 }}>this week</Text>
            </View>
          </View>
        </Card>
      </View>

      {/* Weekly Eco Impact Chart */}
      <View style={styles.sectionContainer}>
        <Card style={styles.chartCard}>
          <Text style={styles.sectionTitle}>Weekly Eco Impact</Text>
          <View style={{ flexDirection: 'row', height: 180, paddingVertical: 8 }}>
            <YAxis
              data={[0, 1, 2, 3]}
              contentInset={{ top: 10, bottom: 10 }}
              svg={{ fontSize: 12, fill: '#6B7280' }}
              numberOfTicks={4}
              min={0}
              max={3}
              style={{ marginRight: 8 }}
              formatLabel={value => `${value}`}
            />
            <BarChart
              style={{ flex: 1 }}
              data={ecoData}
              svg={{ fill: '#10B981', rx: 8 }}
              spacingInner={0.4}
              contentInset={{ top: 10, bottom: 10 }}
              gridMin={0}
              gridMax={3}
            >
              <Grid direction={Grid.Direction.HORIZONTAL} svg={{ stroke: '#F3F4F6' }} />
            </BarChart>
          </View>
          <XAxis
            style={{ marginHorizontal: -10, marginTop: 4 }}
            data={ecoData}
            formatLabel={(value, index) => ecoLabels[index]}
            contentInset={{ left: 30, right: 10 }}
            svg={{ fontSize: 12, fill: '#6B7280' }}
            scale={scale.scaleBand}
          />
        </Card>
      </View>

      {/* Achievements/Badges */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Your Achievements</Text>
        {/* Green Commuter */}
        <LinearGradient colors={["#10B981", "#059669"]} style={styles.badgeCard}>
          <View style={styles.badgeRow}>
            <View style={styles.badgeIconBg}>
              <Icon name="medal" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeTitle}>Green Commuter</Text>
              <Text style={styles.badgeSubtitle}>15 eco-friendly trips</Text>
            </View>
            <View style={styles.badgeCheckBg}>
              <Icon name="check" size={18} color="#fff" />
            </View>
          </View>
        </LinearGradient>
        {/* Step Master */}
        <LinearGradient colors={["#3B82F6", "#2563EB"]} style={styles.badgeCard}>
          <View style={styles.badgeRow}>
            <View style={styles.badgeIconBg}>
              <Icon name="trophy" size={22} color="#fff" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={styles.badgeTitle}>Step Master</Text>
              <Text style={styles.badgeSubtitle}>10,000+ steps daily</Text>
            </View>
            <View style={styles.badgeCheckBg}>
              <Icon name="check" size={18} color="#fff" />
            </View>
          </View>
        </LinearGradient>
        {/* Eco Warrior Progress */}
        <Card style={[styles.badgeCard, { backgroundColor: '#F3F4F6', borderWidth: 2, borderStyle: 'dashed', borderColor: '#D1D5DB' }]}> 
          <View style={styles.badgeRow}>
            <View style={[styles.badgeIconBg, { backgroundColor: '#E5E7EB' }]}> 
              <Icon name="star" size={22} color="#9CA3AF" />
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.badgeTitle, { color: '#4B5563' }]}>Eco Warrior</Text>
              <Text style={[styles.badgeSubtitle, { color: '#6B7280' }]}>25/30 eco actions</Text>
            </View>
            <View style={{ alignItems: 'flex-end' }}>
              <Text style={{ color: '#4B5563', fontWeight: '600', fontSize: 14 }}>83%</Text>
              <View style={styles.progressBarBg}>
                <View style={styles.progressBarFill} />
              </View>
            </View>
          </View>
        </Card>
      </View>

      {/* Weekly Goals */}
      <View style={styles.sectionContainer}>
        <Text style={styles.sectionTitle}>Weekly Goals</Text>
        {/* Walking Goal */}
        <Card style={styles.goalCard}>
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Walking Goal</Text>
            <Text style={styles.goalValue}>85%</Text>
          </View>
          <ProgressBar progress={0.85} color="#10B981" style={styles.goalProgress} />
          <Text style={styles.goalSubLabel}>12.8km / 15km</Text>
        </Card>
        {/* Public Transport Goal */}
        <Card style={styles.goalCard}>
          <View style={styles.goalRow}>
            <Text style={styles.goalLabel}>Public Transport</Text>
            <Text style={styles.goalValue}>100%</Text>
          </View>
          <ProgressBar progress={1} color="#10B981" style={styles.goalProgress} />
          <Text style={styles.goalSubLabel}>17 / 15 trips</Text>
        </Card>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingTop: 48,
    paddingBottom: 28,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerTitle: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 4,
    fontFamily: 'Urbanist_700Bold',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.9)',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
  cardsContainer: {
    paddingHorizontal: 24,
    marginTop: -32,
    marginBottom: 24,
  },
  statCard: {
    flex: 1,
    borderRadius: 20,
    padding: 16,
    marginRight: 0,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  cardIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  iconBg: {
    padding: 8,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardLabel: {
    color: '#6B7280',
    fontSize: 12,
    marginBottom: 2,
    fontFamily: 'Urbanist_400Regular',
  },
  cardValue: {
    color: '#111827',
    fontSize: 22,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_700Bold',
  },
  cardChangeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  cardChangeText: {
    color: '#10B981',
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
  },
  transportValue: {
    color: '#111827',
    fontSize: 28,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_700Bold',
  },
  sectionContainer: {
    paddingHorizontal: 24,
    marginBottom: 24,
  },
  chartCard: {
    borderRadius: 20,
    padding: 16,
    backgroundColor: '#fff',
    elevation: 3,
    shadowColor: '#000',
    shadowOpacity: 0.06,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 2 },
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#111827',
    marginBottom: 12,
    fontFamily: 'Urbanist_700Bold',
  },
  badgeCard: {
    borderRadius: 20,
    padding: 16,
    marginBottom: 14,
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  badgeIconBg: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    padding: 10,
    borderRadius: 16,
    marginRight: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeTitle: {
    color: '#fff',
    fontWeight: '600',
    fontSize: 15,
    fontFamily: 'Urbanist_700Bold',
  },
  badgeSubtitle: {
    color: 'rgba(255,255,255,0.8)',
    fontSize: 13,
    fontFamily: 'Urbanist_400Regular',
  },
  badgeCheckBg: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    borderRadius: 999,
    padding: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressBarBg: {
    width: 48,
    height: 8,
    backgroundColor: '#E5E7EB',
    borderRadius: 8,
    marginTop: 4,
    overflow: 'hidden',
  },
  progressBarFill: {
    width: 40,
    height: 8,
    backgroundColor: '#10B981',
    borderRadius: 8,
  },
  goalCard: {
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.04,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 1 },
  },
  goalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  goalLabel: {
    color: '#374151',
    fontWeight: '500',
    fontSize: 15,
    fontFamily: 'Urbanist_700Bold',
  },
  goalValue: {
    color: '#10B981',
    fontWeight: '700',
    fontSize: 15,
    fontFamily: 'Urbanist_700Bold',
  },
  goalProgress: {
    height: 8,
    borderRadius: 8,
    marginBottom: 4,
    backgroundColor: '#E5E7EB',
  },
  goalSubLabel: {
    color: '#6B7280',
    fontSize: 13,
    marginTop: 2,
    fontFamily: 'Urbanist_400Regular',
  },
}); 