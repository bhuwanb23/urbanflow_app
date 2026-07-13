import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

/**
 * RouteHeader Component
 * Compact header for route-related screens with back and menu actions.
 */
export default function RouteHeader({ title = 'Route Details', onBack, onMenu }) {
  const insets = useSafeAreaInsets();

  const handleBack = () => {
    if (onBack) onBack();
  };

  const handleMenu = () => {
    if (onMenu) onMenu();
  };

  return (
    <View style={[styles.header, { paddingTop: insets.top || 0 }]}>
      <View style={styles.row}>
        <TouchableOpacity
          onPress={handleBack}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Go back"
          accessibilityHint="Return to previous screen"
        >
          <Icon name="arrow-left" size={22} color="#0F172A" />
        </TouchableOpacity>

        <Text style={styles.title}>{title}</Text>

        <TouchableOpacity
          onPress={handleMenu}
          style={styles.iconButton}
          accessibilityRole="button"
          accessibilityLabel="Open menu"
          accessibilityHint="Open route menu"
        >
          <Icon name="dots-vertical" size={22} color="#0F172A" />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingHorizontal: 24,
    paddingBottom: 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 48,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: -0.5,
  },
  iconButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
});
