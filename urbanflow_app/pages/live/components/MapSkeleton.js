import React from 'react';
import { View, StyleSheet } from 'react-native';

/**
 * MapSkeleton Component
 * Loading skeleton for map sections
 */
export default function MapSkeleton() {
  return (
    <View style={styles.container}>
      {/* Map Placeholder */}
      <View style={styles.mapPlaceholder}>
        <View style={styles.mapBackground} />
        
        {/* Pulsing loading indicator */}
        <View style={styles.loadingContainer}>
          <View style={styles.loadingCircle} />
          <View style={styles.loadingCircle} />
          <View style={styles.loadingCircle} />
        </View>
        
        {/* Map controls skeleton */}
        <View style={styles.controlsContainer}>
          <View style={styles.controlButton} />
          <View style={styles.controlButton} />
        </View>
      </View>
      
      {/* Map legend skeleton */}
      <View style={styles.legendContainer}>
        <View style={[styles.legendItem, { width: 120 }]} />
        <View style={[styles.legendItem, { width: 100 }]} />
        <View style={[styles.legendItem, { width: 80 }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: '#F1F5F9',
    borderRadius: 24,
    overflow: 'hidden',
    position: 'relative',
  },
  mapBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: '#E2E8F0',
  },
  loadingContainer: {
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginLeft: -30,
    marginTop: -30,
    width: 60,
    height: 60,
  },
  loadingCircle: {
    position: 'absolute',
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#CBD5E1',
    opacity: 0.6,
  },
  controlsContainer: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    gap: 8,
  },
  controlButton: {
    width: 48,
    height: 48,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  legendContainer: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 24,
    paddingTop: 16,
    gap: 8,
  },
  legendItem: {
    height: 24,
    backgroundColor: '#F1F5F9',
    borderRadius: 12,
  },
});
