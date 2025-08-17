import React from 'react';
import { View, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import notificationTheme from '../theme/notificationTheme';

const BottomActions = () => {
  return (
    <MotiView 
      from={{ opacity: 0, translateY: 20 }} 
      animate={{ opacity: 1, translateY: 0 }} 
      transition={{ type: 'timing', duration: 600, delay: 600 }}
      style={styles.bottomActions}
    >
      {/* Bottom actions removed as requested */}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  bottomActions: {
    paddingHorizontal: notificationTheme.spacing.xl,
    paddingVertical: notificationTheme.spacing.lg,
    backgroundColor: notificationTheme.colors.surface,
    borderTopWidth: 1,
    borderTopColor: notificationTheme.colors.border,
    marginBottom: 80, // Add margin to prevent overlap with app's bottom navigation
    ...notificationTheme.shadows.xl,
  },
});

export default BottomActions;
