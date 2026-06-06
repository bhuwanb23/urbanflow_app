import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Animated } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useNetworkStatus } from '../hooks/useNetworkStatus';

/**
 * OfflineBanner
 * Renders a slide-down banner when the device is offline.
 * Mount it once near the top of the navigation tree so every
 * screen benefits from the same connectivity hint.
 */
export default function OfflineBanner({ onRetry }) {
  const { isOffline } = useNetworkStatus();

  if (!isOffline) return null;

  return (
    <View
      style={styles.container}
      accessibilityRole="alert"
      accessibilityLabel="You are offline"
      testID="offline-banner"
    >
      <Icon name="wifi-off" size={16} color="#FFFFFF" style={styles.icon} />
      <Text style={styles.text}>You are offline</Text>
      {onRetry ? (
        <TouchableOpacity
          accessibilityRole="button"
          accessibilityLabel="Retry connection"
          onPress={onRetry}
          style={styles.button}
        >
          <Icon name="refresh" size={14} color="#FFFFFF" />
          <Text style={styles.buttonText}>Retry</Text>
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#B91C1C',
    paddingHorizontal: 16,
    paddingVertical: 8,
    gap: 8,
  },
  icon: {
    marginRight: 4,
  },
  text: {
    flex: 1,
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
    gap: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
