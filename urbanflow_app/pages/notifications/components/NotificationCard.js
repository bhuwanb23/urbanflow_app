import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import notificationTheme from '../theme/notificationTheme';
import { getNotificationConfig, getTimeAgo, getPriorityColor } from '../utils/notificationTypes';

const NotificationCard = ({ 
  notification, 
  index, 
  onPress, 
  onMarkRead, 
  onToggleImportant, 
  onDelete 
}) => {
  const config = getNotificationConfig(notification.type);
  const timeAgo = getTimeAgo(notification.timestamp);
  const priorityColor = getPriorityColor(notification.priority);

  const handlePress = () => {
    if (onPress) onPress(notification);
    if (!notification.isRead && onMarkRead) {
      onMarkRead(notification.id);
    }
  };

  const handleMarkRead = (e) => {
    e.stopPropagation();
    if (onMarkRead) onMarkRead(notification.id);
  };

  const handleToggleImportant = (e) => {
    e.stopPropagation();
    if (onToggleImportant) onToggleImportant(notification.id);
  };

  const handleDelete = (e) => {
    e.stopPropagation();
    if (onDelete) onDelete(notification.id);
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 20 }}
      animate={{ opacity: 1, translateY: 0 }}
      transition={{ 
        type: 'timing', 
        duration: 500, 
        delay: index * 100 
      }}
      style={[
        styles.notificationItem,
        !notification.isRead && styles.unreadItem
      ]}
    >
      <TouchableOpacity
        style={styles.notificationContent}
        onPress={handlePress}
        activeOpacity={0.7}
      >
        <View style={styles.notificationLeft}>
          <View style={[styles.iconContainer, { backgroundColor: config.iconBg }]}>
            <Icon name={config.icon} size={18} color={config.iconColor} />
          </View>
          {!notification.isRead && (
            <View style={styles.unreadDot} />
          )}
        </View>
        
        <View style={styles.notificationRight}>
          <View style={styles.notificationHeader}>
            <View style={styles.titleRow}>
              <Text style={[
                styles.notificationTitle,
                !notification.isRead && styles.unreadTitle
              ]}>
                {notification.title}
              </Text>
              {notification.isImportant && (
                <Icon name="star" size={14} color={notificationTheme.colors.warning} />
              )}
            </View>
            <Text style={styles.notificationTime}>{timeAgo}</Text>
          </View>
          
          <Text style={styles.notificationMessage}>{notification.message}</Text>
          
          <View style={styles.notificationFooter}>
            <View style={[styles.categoryBadge, { backgroundColor: config.categoryBg }]}>
              <Text style={[styles.categoryText, { color: config.categoryColor }]}>
                {config.category}
              </Text>
            </View>
            
            {notification.priority && (
              <View style={[styles.priorityBadge, { backgroundColor: priorityColor + '20' }]}>
                <Text style={[styles.priorityText, { color: priorityColor }]}>
                  {notification.priority}
                </Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>

      <View style={styles.actionButtons}>
        {!notification.isRead && (
          <TouchableOpacity 
            style={styles.actionButton} 
            onPress={handleMarkRead}
          >
            <Icon name="check" size={14} color={notificationTheme.colors.success} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleToggleImportant}
        >
          <Icon 
            name={notification.isImportant ? "star" : "star-outline"} 
            size={14} 
            color={notification.isImportant ? notificationTheme.colors.warning : notificationTheme.colors.textSecondary} 
          />
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.actionButton} 
          onPress={handleDelete}
        >
          <Icon name="delete-outline" size={14} color={notificationTheme.colors.error} />
        </TouchableOpacity>
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  notificationItem: {
    backgroundColor: notificationTheme.colors.surface,
    marginHorizontal: notificationTheme.spacing.lg,
    marginBottom: notificationTheme.spacing.sm,
    borderRadius: notificationTheme.borderRadius.md,
    ...notificationTheme.shadows.sm,
    overflow: 'hidden',
  },
  unreadItem: {
    borderLeftWidth: 3,
    borderLeftColor: notificationTheme.colors.primary,
    ...notificationTheme.shadows.md,
  },
  notificationContent: {
    flexDirection: 'row',
    padding: notificationTheme.spacing.md,
  },
  notificationLeft: {
    marginRight: notificationTheme.spacing.md,
    position: 'relative',
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    ...notificationTheme.shadows.sm,
  },
  unreadDot: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: notificationTheme.colors.primary,
    borderWidth: 2,
    borderColor: notificationTheme.colors.surface,
  },
  notificationRight: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: notificationTheme.spacing.xs,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: notificationTheme.spacing.sm,
  },
  notificationTitle: {
    fontSize: notificationTheme.typography.fontSize.sm,
    fontWeight: notificationTheme.typography.fontWeight.medium,
    color: notificationTheme.colors.textPrimary,
    fontFamily: notificationTheme.typography.fontFamily.primary,
    flex: 1,
    marginRight: notificationTheme.spacing.xs,
  },
  unreadTitle: {
    fontWeight: notificationTheme.typography.fontWeight.bold,
  },
  notificationTime: {
    fontSize: notificationTheme.typography.fontSize.xs,
    color: notificationTheme.colors.textSecondary,
    fontFamily: notificationTheme.typography.fontFamily.secondary,
  },
  notificationMessage: {
    fontSize: notificationTheme.typography.fontSize.sm,
    color: notificationTheme.colors.textSecondary,
    lineHeight: notificationTheme.typography.lineHeight.normal * notificationTheme.typography.fontSize.sm,
    marginBottom: notificationTheme.spacing.sm,
    fontFamily: notificationTheme.typography.fontFamily.secondary,
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  categoryBadge: {
    paddingHorizontal: notificationTheme.spacing.xs,
    paddingVertical: 2,
    borderRadius: notificationTheme.borderRadius.full,
    ...notificationTheme.shadows.sm,
  },
  categoryText: {
    fontSize: notificationTheme.typography.fontSize.xs,
    fontWeight: notificationTheme.typography.fontWeight.medium,
    fontFamily: notificationTheme.typography.fontFamily.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  priorityBadge: {
    paddingHorizontal: notificationTheme.spacing.xs,
    paddingVertical: 2,
    borderRadius: notificationTheme.borderRadius.full,
  },
  priorityText: {
    fontSize: notificationTheme.typography.fontSize.xs,
    fontWeight: notificationTheme.typography.fontWeight.medium,
    fontFamily: notificationTheme.typography.fontFamily.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  actionButtons: {
    flexDirection: 'row',
    borderTopWidth: 1,
    borderTopColor: notificationTheme.colors.borderLight,
    backgroundColor: notificationTheme.colors.surfaceVariant,
  },
  actionButton: {
    flex: 1,
    paddingVertical: notificationTheme.spacing.xs,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default NotificationCard;
