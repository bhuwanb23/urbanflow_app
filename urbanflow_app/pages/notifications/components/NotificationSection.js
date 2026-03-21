import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import notificationTheme from '../theme/notificationTheme';
import NotificationCard from './NotificationCard';

const NotificationSection = ({ 
  title, 
  notifications, 
  icon, 
  iconColor, 
  delay = 0,
  onNotificationPress,
  onMarkRead,
  onToggleImportant,
  onDelete
}) => {
  if (!notifications || notifications.length === 0) {
    return null;
  }

  return (
    <MotiView 
      from={{ opacity: 0, translateY: 20 }} 
      animate={{ opacity: 1, translateY: 0 }} 
      transition={{ type: 'spring', damping: 12, delay }}
      style={styles.section}
    >
      <MotiView
        from={{ opacity: 0, translateX: -10 }}
        animate={{ opacity: 1, translateX: 0 }}
        transition={{ type: 'timing', duration: 300, delay: delay + 100 }}
      >
        <View style={styles.sectionHeader}>
          <View style={styles.sectionTitleRow}>
            <MotiView
              from={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ type: 'spring', damping: 10, delay: delay + 200 }}
            >
              <View style={[styles.sectionTitleDot, { backgroundColor: iconColor }]} />
            </MotiView>
            <Text style={styles.sectionTitle}>{title}</Text>
            {icon && (
              <MotiView
                from={{ rotate: '-90deg', opacity: 0 }}
                animate={{ rotate: '0deg', opacity: 1 }}
                transition={{ type: 'timing', duration: 400, delay: delay + 300 }}
              >
                <Icon name={icon} size={18} color={iconColor} style={styles.sectionIcon} />
              </MotiView>
            )}
          </View>
          <Text style={styles.sectionCount}>{notifications.length} notification{notifications.length !== 1 ? 's' : ''}</Text>
        </View>
      </MotiView>

      {notifications.map((notification, index) => (
        <NotificationCard
          key={notification.id}
          notification={notification}
          index={index}
          onPress={onNotificationPress}
          onMarkRead={onMarkRead}
          onToggleImportant={onToggleImportant}
          onDelete={onDelete}
        />
      ))}
    </MotiView>
  );
};

const styles = StyleSheet.create({
  section: {
    marginTop: notificationTheme.spacing.md,
    marginBottom: notificationTheme.spacing.lg,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: notificationTheme.spacing.xl,
    paddingVertical: notificationTheme.spacing.md,
    marginBottom: notificationTheme.spacing.md,
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  sectionTitleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: notificationTheme.spacing.sm,
  },
  sectionTitle: {
    fontSize: notificationTheme.typography.fontSize.lg,
    fontWeight: notificationTheme.typography.fontWeight.semibold,
    color: notificationTheme.colors.textPrimary,
    fontFamily: notificationTheme.typography.fontFamily.primary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    flex: 1,
  },
  sectionIcon: {
    marginLeft: notificationTheme.spacing.sm,
  },
  sectionCount: {
    fontSize: notificationTheme.typography.fontSize.sm,
    color: notificationTheme.colors.textSecondary,
    fontFamily: notificationTheme.typography.fontFamily.secondary,
  },
});

export default NotificationSection;
