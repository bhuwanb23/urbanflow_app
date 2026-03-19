import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { routeTheme } from '../theme/routeTheme';
import { useAccessibility } from '../hooks/useAccessibility';

/**
 * TopAppBar Component
 * Header with back button and Start Journey action
 */
export default function TopAppBar({ onBack, onStartJourney, title = 'UrbanFlow' }) {
  const insets = useSafeAreaInsets();
  const { triggerHapticFeedback, announceForAccessibility } = useAccessibility();

  const handleBackPress = () => {
    triggerHapticFeedback('impact-light');
    onBack();
  };

  const handleStartJourney = () => {
    triggerHapticFeedback('success');
    announceForAccessibility('Starting journey');
    onStartJourney();
  };

  return (
    <LinearGradient 
      colors={['#059669', '#047857']} 
      style={[styles.header, { paddingTop: insets.top + 16 }]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 0 }}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={handleBackPress} 
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Return to previous screen"
          >
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.startButton} 
          onPress={handleStartJourney}
          accessibilityRole="button"
          accessibilityLabel="Start journey"
          accessibilityHint="Begin navigation for this route"
        >
          <Text style={styles.startButtonText}>Start Journey</Text>
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: routeTheme.borderRadius.xl,
    borderBottomRightRadius: routeTheme.borderRadius.xl,
    ...routeTheme.shadows.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: routeTheme.borderRadius.lg,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: routeTheme.typography.fontSize['2xl'],
    fontWeight: routeTheme.typography.fontWeight.extrabold,
    color: '#fff',
    fontFamily: routeTheme.typography.fontFamily.headline,
  },
  startButton: {
    backgroundColor: routeTheme.colors.primary,
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: routeTheme.borderRadius.full,
    shadowColor: routeTheme.colors.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: routeTheme.colors.onPrimary,
    fontSize: routeTheme.typography.fontSize.base,
    fontWeight: routeTheme.typography.fontWeight.bold,
    fontFamily: routeTheme.typography.fontFamily.label,
  },
});
