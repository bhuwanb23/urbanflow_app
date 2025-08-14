import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const ROUTE_STEPS = [
  {
    id: '1',
    type: 'walk',
    title: 'Walk to Metro Station',
    duration: '5 min',
    distance: '450m',
    description: 'Head northeast on Main St',
    icon: 'walk',
    iconColor: '#3b82f6',
    iconBg: '#dbeafe',
    cost: 'Free',
    accessibility: true,
    features: ['Free', '♿ Accessible'],
  },
  {
    id: '2',
    type: 'train',
    title: 'Metro Blue Line',
    duration: '18 min',
    stops: '6 stops',
    description: 'Downtown → Central Hub',
    icon: 'train',
    iconColor: '#10b981',
    iconBg: '#d1fae5',
    cost: '$2.50',
    accessibility: true,
    busy: true,
    features: ['$2.50', '♿ Accessible', '🔥 Busy'],
  },
  {
    id: '3',
    type: 'bus',
    title: 'Express Bus 45',
    duration: '12 min',
    description: 'Direct • Central Hub → Airport',
    icon: 'bus',
    iconColor: '#8b5cf6',
    iconBg: '#ede9fe',
    cost: '$1.75',
    accessibility: true,
    electric: true,
    features: ['$1.75', '♿ Accessible', '🌱 Electric'],
  },
  {
    id: '4',
    type: 'walk',
    title: 'Walk to Terminal',
    duration: '3 min',
    distance: '200m',
    description: 'Follow signs to Terminal B',
    icon: 'walk',
    iconColor: '#3b82f6',
    iconBg: '#dbeafe',
    cost: 'Free',
    accessibility: true,
    features: ['Free', '♿ Accessible'],
  },
];

export default function RouteDetailsScreen({ navigation, route }) {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network loading
    const timer = setTimeout(() => setLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleStartRoute = () => {
    console.log('Start route pressed');
  };

  const handleSaveRoute = () => {
    console.log('Save route pressed');
  };

  const handleShareRoute = () => {
    console.log('Share route pressed');
  };

  const handleViewAlternatives = () => {
    console.log('View alternatives pressed');
  };

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 16, color: '#6366f1', fontFamily: 'Urbanist_400Regular', fontSize: 16 }}>Loading route details...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Gradient Header */}
      <LinearGradient colors={["#6366f1", "#10b981"]} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Route Details</Text>
          </View>
          <TouchableOpacity style={styles.headerButton}>
            <Icon name="dots-vertical" size={20} color="#fff" />
          </TouchableOpacity>
        </View>
      </LinearGradient>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Route Overview */}
        <MotiView from={{ opacity: 0, translateY: -20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600 }}>
          <View style={styles.routeOverview}>
            <View style={styles.routePoints}>
              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: '#10b981' }]} />
                <View style={styles.routePointInfo}>
                  <Text style={styles.routePointText}>Downtown Station</Text>
                  <Text style={styles.routePointTime}>8:30 AM</Text>
                </View>
              </View>
              
              <View style={styles.routeStats}>
                <View style={styles.routeLine} />
                <View style={styles.routeStatsCenter}>
                  <Text style={styles.routeDuration}>32 min</Text>
                  <Text style={styles.routeDistance}>5.2 km</Text>
                </View>
                <View style={styles.routeFeatures}>
                  <View style={styles.routeFeature}>
                    <Icon name="leaf" size={16} color="#10b981" />
                    <Text style={styles.routeFeatureText}>Eco-friendly</Text>
                  </View>
                  <View style={styles.routeFeature}>
                    <Icon name="star" size={14} color="#fbbf24" />
                    <Text style={styles.routeFeatureText}>4.2</Text>
                    <Text style={styles.routeFeatureText}>Comfort</Text>
                  </View>
                </View>
              </View>

              <View style={styles.routePoint}>
                <View style={[styles.routeDot, { backgroundColor: '#ef4444' }]} />
                <View style={styles.routePointInfo}>
                  <Text style={styles.routePointText}>Airport Terminal</Text>
                  <Text style={styles.routePointTime}>9:02 AM</Text>
                </View>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Live Alert */}
        <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 600, delay: 200 }}>
          <View style={styles.liveAlert}>
            <Icon name="alert-triangle" size={16} color="#f97316" />
            <Text style={styles.liveAlertText}>Light traffic on Highway 101 - 3 min delay</Text>
          </View>
        </MotiView>

        {/* Journey Steps */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 400 }}>
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Journey Steps</Text>
            <View style={styles.stepsContainer}>
              {ROUTE_STEPS.map((step, index) => (
                <View key={step.id} style={styles.stepItem}>
                  <View style={styles.stepLeft}>
                    <View style={[styles.stepIcon, { backgroundColor: step.iconBg }]}>
                      <Icon name={step.icon} size={18} color={step.iconColor} />
                    </View>
                    {index < ROUTE_STEPS.length - 1 && <View style={styles.stepLine} />}
                  </View>
                  <View style={styles.stepContent}>
                    <View style={styles.stepHeader}>
                      <Text style={styles.stepTitle}>{step.title}</Text>
                      <Text style={styles.stepDuration}>{step.duration}</Text>
                    </View>
                    <Text style={styles.stepDescription}>
                      {step.stops ? `${step.stops} • ${step.description}` : 
                       step.distance ? `${step.distance} • ${step.description}` : step.description}
                    </Text>
                    <View style={styles.stepFeatures}>
                      {step.features.map((feature, idx) => (
                        <View key={idx} style={styles.stepFeature}>
                          <Text style={styles.stepFeatureText}>{feature}</Text>
                        </View>
                      ))}
                    </View>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </MotiView>

        {/* Environmental Impact */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 600 }}>
          <View style={styles.ecoStats}>
            <View style={styles.ecoHeader}>
              <Icon name="leaf" size={20} color="#16a34a" />
              <Text style={styles.ecoTitle}>Environmental Impact</Text>
            </View>
            <View style={styles.ecoGrid}>
              <View style={styles.ecoItem}>
                <Text style={styles.ecoValue}>2.3kg</Text>
                <Text style={styles.ecoLabel}>CO₂ saved vs car</Text>
              </View>
              <View style={styles.ecoItem}>
                <Text style={styles.ecoValue}>85%</Text>
                <Text style={styles.ecoLabel}>Public transport</Text>
              </View>
            </View>
          </View>
        </MotiView>

        {/* Alternate Routes */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 800 }}>
          <TouchableOpacity style={styles.alternateButton} onPress={handleViewAlternatives}>
            <Text style={styles.alternateButtonText}>View 2 Alternate Routes</Text>
            <Icon name="chevron-right" size={20} color="#9ca3af" />
          </TouchableOpacity>
        </MotiView>

        {/* Quick Actions */}
        <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 1000 }}>
          <View style={styles.quickActions}>
            <TouchableOpacity style={styles.primaryAction} onPress={handleStartRoute}>
              <Icon name="play" size={20} color="#fff" />
              <Text style={styles.primaryActionText}>Start</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction} onPress={handleSaveRoute}>
              <Icon name="bookmark-outline" size={20} color="#64748b" />
              <Text style={styles.secondaryActionText}>Save</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.secondaryAction} onPress={handleShareRoute}>
              <Icon name="share-variant-outline" size={20} color="#64748b" />
              <Text style={styles.secondaryActionText}>Share</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
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
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  scrollContent: { 
    padding: 20, 
    paddingBottom: 80 
  },
  routeOverview: {
    backgroundColor: '#dbeafe',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#bfdbfe',
  },
  routePoints: {
    gap: 16,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  routeDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    marginRight: 12,
  },
  routePointInfo: {
    flex: 1,
  },
  routePointText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'Poppins_700Bold',
  },
  routePointTime: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
  routeStats: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 6,
  },
  routeLine: {
    width: 2,
    height: 32,
    backgroundColor: '#94a3b8',
    borderRadius: 1,
  },
  routeStatsCenter: {
    alignItems: 'center',
    marginLeft: 12,
    marginRight: 16,
  },
  routeDuration: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2563eb',
    fontFamily: 'Poppins_700Bold',
  },
  routeDistance: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
  routeFeatures: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  routeFeature: {
    alignItems: 'center',
  },
  routeFeatureText: {
    fontSize: 12,
    color: '#475569',
    fontFamily: 'Urbanist_400Regular',
    marginTop: 2,
  },
  liveAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fef3c7',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#f97316',
    gap: 12,
  },
  liveAlertText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e',
    fontFamily: 'Urbanist_400Regular',
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1e293b',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
  },
  stepsContainer: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
  },
  stepLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    width: 2,
    height: 48,
    backgroundColor: '#e2e8f0',
    borderRadius: 1,
    marginTop: 8,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1e293b',
    fontFamily: 'Poppins_700Bold',
  },
  stepDuration: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
    marginBottom: 8,
  },
  stepFeatures: {
    flexDirection: 'row',
    gap: 8,
  },
  stepFeature: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepFeatureText: {
    fontSize: 12,
    color: '#475569',
    fontFamily: 'Urbanist_400Regular',
  },
  ecoStats: {
    backgroundColor: '#f0fdf4',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  ecoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  ecoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#15803d',
    fontFamily: 'Poppins_700Bold',
    marginLeft: 8,
  },
  ecoGrid: {
    flexDirection: 'row',
    gap: 20,
  },
  ecoItem: {
    flex: 1,
    alignItems: 'center',
  },
  ecoValue: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#16a34a',
    fontFamily: 'Poppins_700Bold',
  },
  ecoLabel: {
    fontSize: 12,
    color: '#15803d',
    fontFamily: 'Urbanist_400Regular',
  },
  alternateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  alternateButtonText: {
    fontSize: 16,
    fontWeight: '500',
    color: '#475569',
    fontFamily: 'Urbanist_400Regular',
  },
  quickActions: {
    flexDirection: 'row',
    gap: 12,
  },
  primaryAction: {
    flex: 1,
    backgroundColor: '#6366f1',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  primaryActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#fff',
    fontFamily: 'Urbanist_400Regular',
  },
  secondaryAction: {
    flex: 1,
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    gap: 4,
  },
  secondaryActionText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
});
