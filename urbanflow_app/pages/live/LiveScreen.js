import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, SafeAreaView, ActivityIndicator, Dimensions, Alert, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
            <SafeAreaView style={{ flex: 1, backgroundColor: '#FFFFFF', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={{ marginTop: 16, color: '#10B981', fontFamily: 'Poppins_400Regular', fontSize: 16 }}>Loading live data...</Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.container}>
            {/* Clean White Header */}
            <View style={styles.headerContainer}>
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
                            <Icon name="cog-outline" size={20} color="#0F172A" />
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
            
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
    backgroundColor: '#FFFFFF' 
  },
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 40 : 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
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
    fontSize: 24,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A', // Slate 900
    marginBottom: 4,
    letterSpacing: -0.5,
  },
  headerSubtitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  headerSubtitle: {
    fontSize: 14,
    color: '#64748B', // Slate 500
    fontFamily: 'Urbanist_400Regular',
  },
  liveIndicator: {
    backgroundColor: '#DEF7EC', // Green 100 (subtle background)
    borderRadius: 6,
    paddingHorizontal: 6,
    paddingVertical: 2,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#31C48D', // Green 500 border
  },
  liveDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#10B981', // Emerald 500
    marginRight: 4,
  },
  liveText: {
    color: '#059669', // Emerald 600
    fontSize: 10,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC', // Slate 50
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0', // Slate 200
  },
  scrollContent: { 
    padding: 24, 
    paddingBottom: 100 
  },
});
