import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { useAccessibility } from '../hooks/useAccessibility';

/**
 * TopAppBar Component
 * Header with back button and Start Journey action
 */
export default function TopAppBar({ onBack, onStartJourney, title = 'Route Details' }) {
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
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity 
            onPress={handleBackPress} 
            style={styles.backButton}
            accessibilityRole="button"
            accessibilityLabel="Go back"
            accessibilityHint="Return to previous screen"
          >
            <Icon name="arrow-left" size={22} color="#0F172A" />
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
          <Text style={styles.startButtonText}>Start</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    paddingTop: Platform.OS === 'android' ? 20 : 20,
    paddingHorizontal: 24,
    paddingBottom: Platform.OS === 'android' ? 15 : 15,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#0F172A',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: -0.5,
  },
  startButton: {
    backgroundColor: '#10B981',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  startButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
    fontFamily: 'Urbanist_700Bold',
  },
});
