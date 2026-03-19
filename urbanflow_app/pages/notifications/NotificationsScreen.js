import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  SafeAreaView, 
  StyleSheet, 
  RefreshControl 
} from 'react-native';
import notificationTheme from './theme/notificationTheme';

// Import mock data
import { mockNotifications, getNotificationsByFilter } from './data/mockNotifications';

// Components
import NotificationHeader from './components/NotificationHeader';
import FilterTabs from './components/FilterTabs';
import NotificationSection from './components/NotificationSection';
import EmptyState from './components/EmptyState';

const NotificationsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  const [notifications, setNotifications] = useState(mockNotifications);
  
  // Calculate stats from mock data
  const stats = {
    total: notifications.length,
    unread: notifications.filter(n => !n.isRead).length,
    important: notifications.filter(n => n.isImportant).length,
    today: notifications.filter(n => {
      const today = new Date();
      const notifDate = new Date(n.timestamp);
      return notifDate.toDateString() === today.toDateString();
    }).length,
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate refresh delay
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleNotificationPress = async (notification) => {
    console.log('Notification pressed:', notification.title);
    
    // Mark as read locally when pressed
    if (!notification.isRead) {
      setNotifications(prev => 
        prev.map(n => 
          n.id === notification.id ? { ...n, isRead: true } : n
        )
      );
    }
  };

  const markAsRead = (notificationId) => {
    // Mark single notification as read locally
    setNotifications(prev => 
      prev.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      )
    );
  };

  const handleFilterPress = () => {
    // Show filter modal or navigate to filter screen
    console.log('Filter pressed');
  };

  const handleDeleteNotification = (notificationId) => {
    // Remove notification locally
    setNotifications(prev => prev.filter(n => n.id !== notificationId));
  };

  const handleMarkAllAsRead = () => {
    // Mark all as read locally
    setNotifications(prev => prev.map(n => ({ ...n, isRead: true })));
  };

  // Group notifications by date and apply filter
  const filteredNotifications = getNotificationsByFilter(activeFilter, notifications);
  
  const groupedNotifications = filteredNotifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt || notification.timestamp);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    
    let group = 'older';
    if (date.toDateString() === today.toDateString()) {
      group = 'today';
    } else if (date.toDateString() === yesterday.toDateString()) {
      group = 'yesterday';
    }
    
    if (!groups[group]) {
      groups[group] = [];
    }
    groups[group].push(notification);
    return groups;
  }, {});

  const renderNotificationSections = () => {
    if (!groupedNotifications) return null;

    const sections = [];

    // Today section
    if (groupedNotifications.today && groupedNotifications.today.length > 0) {
      sections.push(
        <NotificationSection
          key="today"
          title="Today"
          notifications={groupedNotifications.today}
          icon="calendar-today"
          iconColor={notificationTheme.colors.primary}
          delay={200}
          onNotificationPress={handleNotificationPress}
          onMarkRead={markAsRead}
          onDelete={handleDeleteNotification}
        />
      );
    }

    // Yesterday section
    if (groupedNotifications.yesterday && groupedNotifications.yesterday.length > 0) {
      sections.push(
        <NotificationSection
          key="yesterday"
          title="Yesterday"
          notifications={groupedNotifications.yesterday}
          icon="calendar-yesterday"
          iconColor={notificationTheme.colors.secondary}
          delay={400}
          onNotificationPress={handleNotificationPress}
          onMarkRead={markAsRead}
          onDelete={handleDeleteNotification}
        />
      );
    }

    // This week section
    if (groupedNotifications.thisWeek && groupedNotifications.thisWeek.length > 0) {
      sections.push(
        <NotificationSection
          key="thisWeek"
          title="This Week"
          notifications={groupedNotifications.thisWeek}
          icon="calendar-week"
          iconColor={notificationTheme.colors.accent}
          delay={600}
          onNotificationPress={handleNotificationPress}
          onMarkRead={markAsRead}
          onDelete={handleDeleteNotification}
        />
      );
    }

    // Older section
    if (groupedNotifications.older && groupedNotifications.older.length > 0) {
      sections.push(
        <NotificationSection
          key="older"
          title="Older"
          notifications={groupedNotifications.older}
          icon="calendar"
          iconColor={notificationTheme.colors.textSecondary}
          delay={800}
          onNotificationPress={handleNotificationPress}
          onMarkRead={markAsRead}
          onDelete={handleDeleteNotification}
        />
      );
    }

    return sections;
  };

  if (notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <NotificationHeader
          navigation={navigation}
          onFilterPress={handleFilterPress}
          stats={stats}
          showStats={true}
        />
        <View style={styles.emptyContainer}>
          <EmptyState
            title="No notifications yet"
            message="Stay tuned for updates about your routes, traffic conditions, and transit information."
            icon="bell-off"
            onRefresh={handleRefresh}
          />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <NotificationHeader
        navigation={navigation}
        onFilterPress={handleFilterPress}
        stats={stats}
        showStats={true}
      />
      
      <FilterTabs
        activeFilter={activeFilter}
        onFilterChange={setActiveFilter}
        filters={['All', 'Unread', 'Important', 'Today']}
      />

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            colors={[notificationTheme.colors.primary]}
            tintColor={notificationTheme.colors.primary}
          />
        }
      >
        {notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            message="Stay tuned for updates about your routes, traffic conditions, and transit information."
            icon="bell-off"
            onRefresh={loadNotifications}
          />
        ) : (
          renderNotificationSections()
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: notificationTheme.colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 80,
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationsScreen;
