import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { routeTheme } from '../styles/routeTheme';

export default function LiveAlert() {
  return (
    <MotiView from={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ type: 'timing', duration: 600, delay: 200 }}>
      <View style={styles.liveAlert}>
        <Icon name="alert-triangle" size={16} color={routeTheme.colors.warning} />
        <Text style={styles.liveAlertText}>Light traffic on Highway 101 - 3 min delay</Text>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  liveAlert: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFBEB', // Amber 50
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderLeftWidth: 4,
    borderLeftColor: routeTheme.colors.warning,
    gap: 12,
  },
  liveAlertText: {
    flex: 1,
    fontSize: 14,
    color: '#92400e', // Dark amber text for readability
    fontFamily: 'Urbanist_400Regular',
  },
});
