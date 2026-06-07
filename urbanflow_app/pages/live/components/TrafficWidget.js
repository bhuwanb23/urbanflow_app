import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../../utils/api';

/**
 * TrafficWidget Component
 * Displays real-time traffic data from backend API
 */
export default function TrafficWidget() {
  const [trafficData, setTrafficData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchTrafficData = async () => {
    try {
      setLoading(true);
      const response = await api.trafficAPI.getLiveTraffic({ area: 'bengaluru' });
      
      if (response.success && response.data) {
        setTrafficData(response.data);
        setError(null);
      } else {
        setError('Unable to fetch traffic data');
      }
    } catch (err) {
      console.error('Traffic API error:', err);
      setError('Failed to load traffic data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTrafficData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchTrafficData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#16a34a" />
      </View>
    );
  }

  if (error || !trafficData) {
    return (
      <View style={styles.container}>
        <Icon name="alert-circle-outline" size={20} color="#a72d51" />
        <Text style={styles.errorText}>--</Text>
      </View>
    );
  }

  // Calculate traffic level
  const trafficLevel = trafficData.congestion || 50;
  const isHeavy = trafficLevel > 70;
  const isModerate = trafficLevel > 40 && trafficLevel <= 70;
  const _isLight = trafficLevel <= 40;

  return (
    <View style={styles.container}>
      <View style={styles.statHeader}>
        <Icon name="car-multiple" size={20} color={isHeavy ? '#a72d51' : isModerate ? '#f59e0b' : '#16a34a'} />
        {trafficData.status && (
          <View style={[styles.statBadge, { backgroundColor: isHeavy ? '#ffd9de' : isModerate ? '#fef3c7' : '#dcfce7' }]}>
            <Text style={[styles.statBadgeText, { color: isHeavy ? '#a72d51' : isModerate ? '#92400e' : '#16a34a' }]}>
              {trafficData.status}
            </Text>
          </View>
        )}
      </View>
      <Text style={styles.statLabel}>TRAFFIC LOAD</Text>
      <Text style={styles.statValue}>{trafficLevel}<Text style={styles.statUnit}>%</Text></Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f3f4f5',
    borderRadius: 24,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    height: 24,
  },
  statBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statLabel: {
    fontSize: 11,
    color: '#3e4a3d',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#191c1d',
    marginTop: 2,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#3e4a3d',
  },
  errorText: {
    fontSize: 20,
    color: '#64748B',
    fontFamily: 'Urbanist_400Regular',
  },
});
