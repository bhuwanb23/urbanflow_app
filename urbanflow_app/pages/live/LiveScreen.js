import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Dimensions, Alert } from 'react-native';
import { Chip } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

// Import API hooks
import { useTraffic, useDemoData } from '../../utils/hooks/useAPI';

const { width, height } = Dimensions.get('window');

// Import Components
import LiveMap from './components/LiveMap';
import TrafficConditions from './components/TrafficConditions';
import RecentUpdates from './components/RecentUpdates';
import PopularRoutes from './components/PopularRoutes';
import TransitStatus from './components/TransitStatus';

export default function LiveScreen() {
    const [selectedArea, setSelectedArea] = useState('all');

    // API hooks
    const { trafficData, fetchLiveTraffic, getTrafficConditions, getTrafficAlerts, loading, error } = useTraffic();
    const { demoData, fetchTrafficData, fetchRouteSuggestions, loading: demoLoading } = useDemoData();

    useEffect(() => {
        loadLiveData();
    }, []);

    // Show error alert if there's an API error
    useEffect(() => {
        if (error) {
            Alert.alert('Error', error, [
                { text: 'Retry', onPress: loadLiveData },
                { text: 'OK' }
            ]);
        }
    }, [error]);

    const loadLiveData = async () => {
        try {
            await fetchLiveTraffic({ area: selectedArea });
        } catch (err) {
            console.log('Error loading live traffic, falling back to demo data');
            // Fallback to demo data
            await fetchTrafficData();
            await fetchRouteSuggestions();
        }
    };

    const handleAreaChange = async (area) => {
        setSelectedArea(area);
        try {
            const conditions = await getTrafficConditions(area);
            // Update traffic conditions for specific area
        } catch (error) {
            console.log('Error loading area conditions:', error);
        }
    };

    const loadAlerts = async () => {
        try {
            const alerts = await getTrafficAlerts();
            // Handle traffic alerts
        } catch (error) {
            console.log('Error loading alerts:', error);
        }
    };

    if (loading && demoLoading) {
        return (
            <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#6366f1" />
                <Text style={{ marginTop: 16, color: '#6366f1', fontFamily: 'Poppins_400Regular', fontSize: 16 }}>Loading live data...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Compact Gradient Header */}
            <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={styles.headerGradient}>
                <View style={styles.headerRow}>
                    <View style={styles.headerLeft}>
                        <Text style={styles.headerTitle}>Live Traffic</Text>
                        <View style={styles.headerSubtitleRow}>
                            <View style={styles.liveIndicator}>
                                <View style={styles.liveDot} />
                                <Text style={styles.liveText}>LIVE</Text>
                            </View>
                            <Text style={styles.headerSubtitle}>Real-time updates</Text>
                        </View>
                    </View>
                    <View style={styles.headerRight}>
                        <TouchableOpacity style={styles.settingsButton}>
                            <Icon name="cog" size={18} color="#fff" />
                        </TouchableOpacity>
                    </View>
                </View>
            </LinearGradient>
            
            <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
                {/* Live Map Component */}
                <LiveMap 
                    trafficData={trafficData || demoData?.traffic}
                    onAreaSelect={handleAreaChange}
                />
                
                {/* Traffic Conditions Component */}
                <TrafficConditions 
                    conditions={trafficData?.conditions || demoData?.traffic?.conditions}
                    onRefresh={loadLiveData}
                />
                
                {/* Recent Updates Component */}
                <RecentUpdates 
                    updates={trafficData?.updates || demoData?.traffic?.updates}
                    onLoadAlerts={loadAlerts}
                />
                
                {/* Popular Routes Component */}
                <PopularRoutes 
                    routes={demoData?.routes}
                />
                
                {/* Transit Status Component */}
                <TransitStatus />
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
  container: { 
    flex: 1, 
    backgroundColor: '#F9FAFB' 
  },
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
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSubtitle: {
    fontSize: Math.max(12, width * 0.035),
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Urbanist_400Regular',
  },
  liveIndicator: {
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 3,
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: 5,
    height: 5,
    borderRadius: 2.5,
    backgroundColor: '#fff',
    marginRight: 4,
  },
  liveText: {
    color: '#fff',
    fontSize: Math.max(10, width * 0.025),
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
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
    paddingBottom: 80 
  },
}); 