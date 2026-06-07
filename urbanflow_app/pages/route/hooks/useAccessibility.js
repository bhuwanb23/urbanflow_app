import { useState, useCallback, useEffect } from 'react';
import * as Haptics from 'expo-haptics';

/**
 * Custom hook for accessibility features
 * Provides screen reader announcements, focus management, and haptic feedback
 */
export function useAccessibility() {
  const [isScreenReaderEnabled, setIsScreenReaderEnabled] = useState(false);

  useEffect(() => {
    // In a real implementation, detect if screen reader is active
    // This is a placeholder for actual accessibility detection
    const checkAccessibility = async () => {
      try {
        // Would use react-native-accessibility-info in production
        setIsScreenReaderEnabled(false);
      } catch (error) {
        console.error('Error checking accessibility:', error);
      }
    };

    checkAccessibility();
  }, []);

  /**
   * Announce message to screen readers
   */
  const announceForAccessibility = useCallback((message, priority = 'polite') => {
    if (isScreenReaderEnabled) {
      // In React Native, this would use AccessibilityInfo.announceForAccessibility
      console.log(`[Accessibility] ${priority}: ${message}`);
    }
  }, [isScreenReaderEnabled]);

  /**
   * Set accessibility focus to a specific element
   */
  const setAccessibilityFocus = useCallback((ref) => {
    if (ref?.current) {
      // In React Native, use ref.current.setNativeProps({ accessibilityFocus: true })
      if (ref.current.setNativeProps) {
        ref.current.setNativeProps({ accessibilityFocus: true });
      }
    }
  }, []);

  /**
   * Trigger haptic feedback
   */
  const triggerHapticFeedback = useCallback(async (type = 'selection') => {
    try {
      switch (type) {
        case 'success':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
          break;
        case 'warning':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Warning);
          break;
        case 'error':
          await Haptics.notificationAsync(Haptics.NotificationFeedbackType.Error);
          break;
        case 'selection':
          await Haptics.selectionAsync();
          break;
        case 'impact-light':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
          break;
        case 'impact-medium':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
          break;
        case 'impact-heavy':
          await Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
          break;
        default:
          await Haptics.selectionAsync();
      }
    } catch (error) {
      console.error('Error triggering haptic feedback:', error);
    }
  }, []);

  /**
   * Check if reduce motion is enabled
   */
  const shouldReduceMotion = useCallback(async () => {
    // Would use AccessibilityInfo.isReduceMotionEnabled in production
    return false;
  }, []);

  /**
   * Get accessibility label based on status
   */
  const getStatusAccessibilityLabel = useCallback((status, type) => {
    const statusLabels = {
      'on-time': 'On time',
      'delayed': 'Delayed',
      'cancelled': 'Cancelled',
      'available': 'Available',
    };

    return `${type}, ${statusLabels[status] || status}`;
  }, []);

  return {
    isScreenReaderEnabled,
    announceForAccessibility,
    setAccessibilityFocus,
    triggerHapticFeedback,
    shouldReduceMotion,
    getStatusAccessibilityLabel,
  };
}

export default useAccessibility;
