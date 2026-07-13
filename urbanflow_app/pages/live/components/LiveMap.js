import React, { useState, useEffect, useCallback, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Dimensions } from 'react-native';
import { MotiView } from 'moti';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import MapView, { Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';
import api from '../../../utils/api';

const { width, height } = Dimensions.get('window');

const DEFAULT_REGION = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};
const MAP_HEIGHT = Math.max(180, height * 0.22);

const GOOGLE_MAPS_API_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const USE_GOOGLE_PROVIDER = Boolean(GOOGLE_MAPS_API_KEY);

function computeRegion(points) {
  if (!points || points.length === 0) return DEFAULT_REGION;
  const lats = points.map((p) => p.latitude);
  const lngs = points.map((p) => p.longitude);
  const minLat = Math.min(...lats);
  const maxLat = Math.max(...lats);
  const minLng = Math.min(...lngs);
  const maxLng = Math.max(...lngs);
  return {
    latitude: (minLat + maxLat) / 2,
    longitude: (minLng + maxLng) / 2,
    latitudeDelta: Math.max((maxLat - minLat) * 1.4, 0.02),
    longitudeDelta: Math.max((maxLng - minLng) * 1.4, 0.02),
  };
}

const LiveMap = () => {
  const [vehicles, setVehicles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const loadVehicles = useCallback(async () => {
    try {
      const response = await api.mapsAPI.getVehicles();
      const list = response?.data?.vehicles;
      setVehicles(Array.isArray(list) ? list : []);
      setHasError(false);
    } catch (err) {
      console.error('LiveMap vehicles error:', err);
      setHasError(true);
      setVehicles([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadVehicles();
    const id = setInterval(loadVehicles, 30000);
    return () => clearInterval(id);
  }, [loadVehicles]);

  const plotted = useMemo(
    () =>
      vehicles.filter(
        (v) => typeof v.latitude === 'number' && typeof v.longitude === 'number'
      ),
    [vehicles]
  );

  const region = computeRegion(plotted);

  const mapProps = { style: styles.map, initialRegion: region };
  if (USE_GOOGLE_PROVIDER) {
    mapProps.provider = PROVIDER_GOOGLE;
    mapProps.googleMapsApiKey = GOOGLE_MAPS_API_KEY;
  }

  return (
    <MotiView
      from={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      transition={{ type: 'timing', duration: 700 }}
    >
      <View style={[styles.mapWrap, { height: MAP_HEIGHT }]}>
        {loading ? (
          <View style={styles.center}>
            <ActivityIndicator size="small" color="#6366f1" />
          </View>
        ) : (
          <MapView {...mapProps}>
            {plotted.map((v) => (
              <Marker
                key={v.vehicleId || `v-${v.latitude}-${v.longitude}`}
                coordinate={{ latitude: v.latitude, longitude: v.longitude }}
                title={v.routeId ? `Route ${v.routeId}` : 'Vehicle'}
                pinColor="#006b2c"
              />
            ))}
          </MapView>
        )}

        {/* Live indicator */}
        <View style={styles.liveIndicator}>
          <View style={styles.liveDot} />
          <Text style={styles.liveText}>LIVE</Text>
        </View>

        {/* Status / count */}
        <View style={styles.mapUpdated}>
          <Text style={styles.mapUpdatedText}>
            {hasError
              ? 'Live data unavailable'
              : `${plotted.length} vehicle${plotted.length === 1 ? '' : 's'}`}
          </Text>
        </View>

        {/* Recenter button (placeholder) */}
        <TouchableOpacity
          style={styles.mapBtn}
          onPress={() => console.log('Recenter live map')}
        >
          <Icon name="crosshairs-gps" size={22} color="#6366f1" />
        </TouchableOpacity>
      </View>
    </MotiView>
  );
};

export default LiveMap;

const styles = StyleSheet.create({
  mapWrap: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    marginBottom: 16,
    position: 'relative',
    backgroundColor: '#eef2f6',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  map: {
    width: '100%',
    height: '100%',
  },
  center: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapBtn: {
    position: 'absolute',
    bottom: Math.max(12, height * 0.015),
    right: Math.max(12, width * 0.03),
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: Math.max(8, width * 0.02),
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },
  mapUpdated: {
    position: 'absolute',
    top: Math.max(12, height * 0.015),
    right: Math.max(12, width * 0.03),
    backgroundColor: '#fff',
    borderRadius: 10,
    paddingHorizontal: Math.max(10, width * 0.025),
    paddingVertical: Math.max(3, height * 0.004),
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 2,
  },
  mapUpdatedText: {
    color: '#6366f1',
    fontSize: Math.max(11, width * 0.028),
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  liveIndicator: {
    position: 'absolute',
    top: Math.max(12, height * 0.015),
    left: Math.max(12, width * 0.03),
    backgroundColor: 'rgba(239, 68, 68, 0.9)',
    borderRadius: 10,
    paddingHorizontal: Math.max(8, width * 0.02),
    paddingVertical: Math.max(3, height * 0.004),
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: Math.max(5, width * 0.012),
    height: Math.max(5, width * 0.012),
    borderRadius: Math.max(2.5, width * 0.006),
    backgroundColor: '#fff',
    marginRight: Math.max(4, width * 0.01),
  },
  liveText: {
    color: '#fff',
    fontSize: Math.max(10, width * 0.025),
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
});
