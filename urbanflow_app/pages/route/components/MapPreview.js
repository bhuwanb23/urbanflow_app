import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { routeTheme } from '../theme/routeTheme';

/**
 * MapPreview Component
 * Displays map preview image between route segments
 */
export default function MapPreview({ 
  location = 'Berlin', 
  imageUrl,
  label = 'Mid-Route View' 
}) {
  const defaultImageUrl = 'https://lh3.googleusercontent.com/aida-public/AB6AXuAk8x4JCFcpncNOv2a4V0XKUeozSGohxBmKJ7ecQFucJzk0pqFSmX0ExfPbhU2g4AmgueQlBwrlCarfAOLXOuIZC_WglsrKz0BWb7VCwvNbrX57p9xY2mFvVI68FxZxDzupEz3u_A9o_7EK9UboprPD5ywxJh3mEylrm1eeBqFM_-Iq45JnuxSxqhyS8bkw-dyYLA9d_23zQDUo7jd3_7C4YG3kqYr9T3-EZj96_EeVnjaU_WOiVZRF6vDaCkZjq1YAsyEWQ6CDkjbS';

  return (
    <View style={styles.container}>
      <View style={styles.mapContainer}>
        <Image 
          source={{ uri: imageUrl || defaultImageUrl }}
          style={styles.mapImage}
          resizeMode="cover"
          accessibilityLabel={`Map view of ${location}`}
        />
        
        <View style={styles.overlay} />
        
        <View style={styles.locationBadge}>
          <Icon name="map-marker" size={14} color={routeTheme.colors.primary} />
          <Text style={styles.locationText}>{label}</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: 'relative',
    marginBottom: routeTheme.spacing.xl,
    marginLeft: 56, // Align with segment cards
  },
  mapContainer: {
    height: routeTheme.spacing['2xl'] * 4, // 128px
    borderRadius: routeTheme.borderRadius['2xl'],
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: routeTheme.colors.outlineVariant,
    ...routeTheme.shadows.sm,
  },
  mapImage: {
    width: '100%',
    height: '100%',
    opacity: 0.8,
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'transparent',
  },
  locationBadge: {
    position: 'absolute',
    bottom: 12,
    left: 12,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: routeTheme.borderRadius.lg,
    backdropFilter: 'blur(8px)',
  },
  locationText: {
    fontSize: 10,
    fontWeight: routeTheme.typography.fontWeight.bold,
    color: routeTheme.colors.primary,
    fontFamily: routeTheme.typography.fontFamily.label,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
});
