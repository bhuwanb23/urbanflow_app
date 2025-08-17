import notificationTheme from '../theme/notificationTheme';

export const NOTIFICATION_TYPES = {
  TRAFFIC: 'traffic',
  ROUTE: 'route',
  TRANSIT: 'transit',
  BIKE: 'bike',
  PARKING: 'parking',
  ALERT: 'alert',
  UPDATE: 'update',
  REMINDER: 'reminder',
};

export const NOTIFICATION_CATEGORIES = {
  DRIVING: 'Driving',
  NAVIGATION: 'Navigation',
  TRANSIT: 'Transit',
  BIKE_SHARE: 'Bike Share',
  PARKING: 'Parking',
  ALERTS: 'Alerts',
  UPDATES: 'Updates',
  REMINDERS: 'Reminders',
};

export const NOTIFICATION_PRIORITIES = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  URGENT: 'urgent',
};

export const getNotificationConfig = (type) => {
  const configs = {
    [NOTIFICATION_TYPES.TRAFFIC]: {
      icon: 'alert-triangle',
      iconColor: notificationTheme.colors.traffic,
      iconBg: '#fee2e2',
      category: NOTIFICATION_CATEGORIES.DRIVING,
      categoryColor: notificationTheme.colors.traffic,
      categoryBg: '#fee2e2',
      priority: NOTIFICATION_PRIORITIES.HIGH,
    },
    [NOTIFICATION_TYPES.ROUTE]: {
      icon: 'map-marker-path',
      iconColor: notificationTheme.colors.route,
      iconBg: '#dbeafe',
      category: NOTIFICATION_CATEGORIES.NAVIGATION,
      categoryColor: notificationTheme.colors.route,
      categoryBg: '#dbeafe',
      priority: NOTIFICATION_PRIORITIES.MEDIUM,
    },
    [NOTIFICATION_TYPES.TRANSIT]: {
      icon: 'train',
      iconColor: notificationTheme.colors.transit,
      iconBg: '#d1fae5',
      category: NOTIFICATION_CATEGORIES.TRANSIT,
      categoryColor: notificationTheme.colors.transit,
      categoryBg: '#d1fae5',
      priority: NOTIFICATION_PRIORITIES.MEDIUM,
    },
    [NOTIFICATION_TYPES.BIKE]: {
      icon: 'bike',
      iconColor: notificationTheme.colors.bike,
      iconBg: '#fef3c7',
      category: NOTIFICATION_CATEGORIES.BIKE_SHARE,
      categoryColor: notificationTheme.colors.bike,
      categoryBg: '#fef3c7',
      priority: NOTIFICATION_PRIORITIES.LOW,
    },
    [NOTIFICATION_TYPES.PARKING]: {
      icon: 'car',
      iconColor: notificationTheme.colors.parking,
      iconBg: '#ede9fe',
      category: NOTIFICATION_CATEGORIES.PARKING,
      categoryColor: notificationTheme.colors.parking,
      categoryBg: '#ede9fe',
      priority: NOTIFICATION_PRIORITIES.MEDIUM,
    },
    [NOTIFICATION_TYPES.ALERT]: {
      icon: 'bell-ring',
      iconColor: notificationTheme.colors.error,
      iconBg: '#fee2e2',
      category: NOTIFICATION_CATEGORIES.ALERTS,
      categoryColor: notificationTheme.colors.error,
      categoryBg: '#fee2e2',
      priority: NOTIFICATION_PRIORITIES.URGENT,
    },
    [NOTIFICATION_TYPES.UPDATE]: {
      icon: 'update',
      iconColor: notificationTheme.colors.info,
      iconBg: '#dbeafe',
      category: NOTIFICATION_CATEGORIES.UPDATES,
      categoryColor: notificationTheme.colors.info,
      categoryBg: '#dbeafe',
      priority: NOTIFICATION_PRIORITIES.LOW,
    },
    [NOTIFICATION_TYPES.REMINDER]: {
      icon: 'clock-outline',
      iconColor: notificationTheme.colors.warning,
      iconBg: '#fef3c7',
      category: NOTIFICATION_CATEGORIES.REMINDERS,
      categoryColor: notificationTheme.colors.warning,
      categoryBg: '#fef3c7',
      priority: NOTIFICATION_PRIORITIES.MEDIUM,
    },
  };

  return configs[type] || configs[NOTIFICATION_TYPES.UPDATE];
};

export const getPriorityColor = (priority) => {
  const priorityColors = {
    [NOTIFICATION_PRIORITIES.LOW]: notificationTheme.colors.success,
    [NOTIFICATION_PRIORITIES.MEDIUM]: notificationTheme.colors.warning,
    [NOTIFICATION_PRIORITIES.HIGH]: notificationTheme.colors.error,
    [NOTIFICATION_PRIORITIES.URGENT]: notificationTheme.colors.error,
  };

  return priorityColors[priority] || notificationTheme.colors.textSecondary;
};

export const getTimeAgo = (timestamp) => {
  const now = new Date();
  const diff = now - new Date(timestamp);
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return 'Just now';
  if (minutes < 60) return `${minutes} min ago`;
  if (hours < 24) return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  if (days < 7) return `${days} day${days > 1 ? 's' : ''} ago`;
  
  return new Date(timestamp).toLocaleDateString();
};

export const groupNotificationsByDate = (notifications) => {
  const groups = {
    today: [],
    yesterday: [],
    thisWeek: [],
    older: [],
  };

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  const yesterday = new Date(today.getTime() - 86400000);
  const thisWeek = new Date(today.getTime() - 7 * 86400000);

  notifications.forEach(notification => {
    const notificationDate = new Date(notification.timestamp);
    const notificationDay = new Date(notificationDate.getFullYear(), notificationDate.getMonth(), notificationDate.getDate());

    if (notificationDay.getTime() === today.getTime()) {
      groups.today.push(notification);
    } else if (notificationDay.getTime() === yesterday.getTime()) {
      groups.yesterday.push(notification);
    } else if (notificationDay.getTime() >= thisWeek.getTime()) {
      groups.thisWeek.push(notification);
    } else {
      groups.older.push(notification);
    }
  });

  return groups;
};
