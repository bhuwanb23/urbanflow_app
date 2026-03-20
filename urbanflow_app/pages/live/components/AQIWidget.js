import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import api from '../../../utils/api';

/**
 * AQIWidget Component
 * Displays real-time air quality index from backend API
 */
export default function AQIWidget() {
  const [aqiData, setAqiData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchAQIData = async () => {
    try {
      setLoading(true);
      const response = await api.environmentAPI.getAQI('bengaluru');
      
      if (response.success && response.data) {
        setAqiData(response.data);
        setError(null);
      } else {
        setError('Unable to fetch AQI data');
      }
    } catch (err) {
      console.error('AQI API error:', err);
      setError('Failed to load AQI data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAQIData();
    // Auto-refresh every 30 seconds
    const interval = setInterval(fetchAQIData, 30000);
    return () => clearInterval(interval);
  }, []);

  if (loading) {
    return (
      <View style={styles.container}>
        <ActivityIndicator size="small" color="#16a34a" />
      </View>
    );
  }

  if (error || !aqiData) {
    return (
      <View style={styles.container}>
        <Icon name="alert-circle-outline" size={20} color="#64748B" />
        <Text style={styles.errorText}>--</Text>
      </View>
    );
  }

  const aqi = aqiData.aqi || 50;
  let aqiStatus = 'Good';
  let statusColor = '#16a34a';
  let bgColor = '#dcfce7';
  
  if (aqi > 150) {
    aqiStatus = 'Unhealthy';
    statusColor = '#dc2626';
    bgColor = '#fee2e2';
  } else if (aqi > 100) {
    aqiStatus = 'Moderate';
    statusColor = '#f59e0b';
    bgColor = '#fef3c7';
  } else if (aqi > 50) {
    aqiStatus = 'Fair';
    statusColor = '#0891b2';
    bgColor = '#ecfeff';
  }

  return (
    <View style={styles.container}>
      <View style={styles.statHeader}>
        <Icon name="weather-windy" size={20} color={statusColor} />
        <View style={[styles.statBadge, { backgroundColor: bgColor }]}>
          <Text style={[styles.statBadgeText, { color: statusColor }]}>
            {aqiStatus}
          </Text>
        </View>
      </View>
      <Text style={styles.statLabel}>AIR QUALITY INDEX</Text>
      <Text style={styles.statValue}>{aqi} <Text style={styles.statUnit}>aqi</Text></Text>
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
