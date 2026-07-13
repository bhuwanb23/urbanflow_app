import React, { useState, useEffect, useMemo } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, Dimensions } from 'react-native';
import MapView, { Polyline, Marker, PROVIDER_GOOGLE } from 'react-native-maps';
import Constants from 'expo-constants';
import api from '../../../utils/api';

const { height } = Dimensions.get('window');

const DEFAULT_REGION = {
  latitude: 12.9716,
  longitude: 77.5946,
  latitudeDelta: 0.08,
  longitudeDelta: 0.08,
};

const MAP_HEIGHT = Math.max(180, height * 0.24);

const GOOGLE_MAPS_API_KEY =
  Constants.expoConfig?.extra?.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY || '';
const USE_GOOGLE_PROVIDER = Boolean(GOOGLE_MAPS_API_KEY);

/**
 * Defensively parse a shape payload into an array of { latitude, longitude }.
 * Handles GeoJSON (Feature/FeatureCollection with [lng, lat] pairs), arrays of
 * [lat, lng] / [lng, lat] pairs, and arrays/objects of { lat/latitude, lng/longitude }.
 */
function parseShapeCoordinates(shape) {
  if (!shape) return [];

  let coords = null;
  if (Array.isArray(shape)) {
    coords = shape;
  } else if (shape.geometry && Array.isArray(shape.geometry.coordinates)) {
    coords = shape.geometry.coordinates; // GeoJSON: [lng, lat]
  } else if (Array.isArray(shape.coordinates)) {
    coords = shape.coordinates;
  } else if (Array.isArray(shape.points)) {
    coords = shape.points;
  }

  if (!Array.isArray(coords) || coords.length === 0) return [];

  // Array of objects: { lat/latitude, lng/longitude }
  if (typeof coords[0] === 'object' && coords[0] !== null) {
    return coords
      .map((p) => {
        const lat = p.latitude ?? p.lat;
        const lng = p.longitude ?? p.lng ?? p.lon;
        return typeof lat === 'number' && typeof lng === 'number'
          ? { latitude: lat, longitude: lng }
          : null;
      })
      .filter(Boolean);
  }

  // Array of pairs
  if (Array.isArray(coords[0])) {
    return coords
      .map((pair) => {
        if (!Array.isArray(pair) || pair.length < 2) return null;
        const [a, b] = pair;
        // GeoJSON uses [lng, lat]; if first value > 90 it is a longitude
        const lat = Math.abs(a) > 90 ? b : a;
        const lng = Math.abs(a) > 90 ? a : b;
        return { latitude: lat, longitude: lng };
      })
      .filter(Boolean);
  }

  return [];
}

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
    latitudeDelta: Math.max((maxLat - minLat) * 1.3, 0.01),
    longitudeDelta: Math.max((maxLng - minLng) * 1.3, 0.01),
  };
}

/**
 * RouteMap
 * Renders a route polyline from a shapeId (fetched from the backend) or an
 * explicit `coordinates` array. Gracefully degrades when no geometry is
 * available: shows a centered map (default provider) and a placeholder notice.
 */
export default function RouteMap({
  shapeId,
  coordinates,
  title,
  height: mapHeight = MAP_HEIGHT,
}) {
  const [fetched, setFetched] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    let cancelled = false;
    if (shapeId) {
      setLoading(true);
      api.mapsAPI
        .getShape(shapeId)
        .then((res) => {
          if (cancelled) return;
          const shape = res?.data?.data ?? res?.data ?? null;
          setFetched(parseShapeCoordinates(shape));
        })
        .catch((err) => {
          if (cancelled) return;
          console.error('RouteMap shape error:', err);
          setFetched([]);
        })
        .finally(() => {
          if (!cancelled) setLoading(false);
        });
    } else {
      setFetched(null);
    }
    return () => {
      cancelled = true;
    };
  }, [shapeId]);

  const points = useMemo(() => {
    if (Array.isArray(coordinates) && coordinates.length) {
      const parsed = parseShapeCoordinates(coordinates);
      if (parsed.length) return parsed;
    }
    return fetched || [];
  }, [coordinates, fetched]);

  const region = computeRegion(points);
  const hasGeometry = points.length >= 2;

  const mapProps = {
    style: [styles.map, { height: mapHeight }],
    initialRegion: region,
  };
  if (USE_GOOGLE_PROVIDER) {
    mapProps.provider = PROVIDER_GOOGLE;
    mapProps.googleMapsApiKey = GOOGLE_MAPS_API_KEY;
  }

  return (
    <View style={[styles.wrap, { height: mapHeight }]}>
      <MapView {...mapProps}>
        {hasGeometry && (
          <Polyline
            coordinates={points}
            strokeColor="#10B981"
            strokeWidth={4}
            lineCap="round"
            lineJoin="round"
          />
        )}
        {points.length === 1 && (
          <Marker coordinate={points[0]} title={title || 'Location'} />
        )}
      </MapView>

      {loading && (
        <View style={styles.overlay}>
          <ActivityIndicator size="small" color="#10B981" />
        </View>
      )}

      {!loading && !hasGeometry && (
        <View style={styles.placeholder}>
          <Text style={styles.placeholderText}>
            {title ? `${title} — ` : ''}No route path available
          </Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: {
    width: '100%',
    borderRadius: 20,
    overflow: 'hidden',
    backgroundColor: '#eef2f6',
  },
  map: {
    width: '100%',
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.4)',
  },
  placeholder: {
    ...StyleSheet.absoluteFillObject,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 16,
  },
  placeholderText: {
    fontSize: 13,
    color: '#64748B',
    textAlign: 'center',
    fontWeight: '600',
  },
});
