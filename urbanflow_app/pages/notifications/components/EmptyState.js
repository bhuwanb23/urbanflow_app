import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import notificationTheme from '../theme/notificationTheme';

const EmptyState = ({ 
  title = 'No notifications yet',
  message = 'Stay tuned for updates about your routes, traffic conditions, and transit information.',
  icon = 'bell-off',
  onRefresh,
  showRefreshButton = true
}) => {
  return (
    <MotiView 
      from={{ opacity: 0, scale: 0.9 }} 
      animate={{ opacity: 1, scale: 1 }} 
      transition={{ type: 'timing', duration: 600 }}
      style={styles.emptyState}
    >
      <View style={styles.emptyIcon}>
        <Icon name={icon} size={48} color={notificationTheme.colors.textTertiary} />
      </View>
      
      <Text style={styles.emptyTitle}>{title}</Text>
      <Text style={styles.emptyMessage}>{message}</Text>
      
      {showRefreshButton && onRefresh && (
        <TouchableOpacity style={styles.refreshButton} onPress={onRefresh}>
          <Icon name="refresh" size={16} color={notificationTheme.colors.primary} style={styles.refreshIcon} />
          <Text style={styles.refreshText}>Refresh</Text>
        </TouchableOpacity>
      )}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingVertical: notificationTheme.spacing['5xl'],
    paddingHorizontal: notificationTheme.spacing.xl,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: notificationTheme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: notificationTheme.spacing.lg,
    ...notificationTheme.shadows.md,
  },
  emptyTitle: {
    fontSize: notificationTheme.typography.fontSize.xl,
    fontWeight: notificationTheme.typography.fontWeight.medium,
    color: notificationTheme.colors.textPrimary,
    marginBottom: notificationTheme.spacing.md,
    fontFamily: notificationTheme.typography.fontFamily.primary,
    textAlign: 'center',
  },
  emptyMessage: {
    fontSize: notificationTheme.typography.fontSize.base,
    color: notificationTheme.colors.textSecondary,
    textAlign: 'center',
    lineHeight: notificationTheme.typography.lineHeight.relaxed * notificationTheme.typography.fontSize.base,
    fontFamily: notificationTheme.typography.fontFamily.secondary,
    marginBottom: notificationTheme.spacing.xl,
    paddingHorizontal: notificationTheme.spacing.lg,
  },
  refreshButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: notificationTheme.colors.surface,
    paddingHorizontal: notificationTheme.spacing.lg,
    paddingVertical: notificationTheme.spacing.md,
    borderRadius: notificationTheme.borderRadius.full,
    borderWidth: 1,
    borderColor: notificationTheme.colors.primary,
    ...notificationTheme.shadows.sm,
  },
  refreshIcon: {
    marginRight: notificationTheme.spacing.sm,
  },
  refreshText: {
    color: notificationTheme.colors.primary,
    fontSize: notificationTheme.typography.fontSize.base,
    fontWeight: notificationTheme.typography.fontWeight.medium,
    fontFamily: notificationTheme.typography.fontFamily.secondary,
  },
});

export default EmptyState;
