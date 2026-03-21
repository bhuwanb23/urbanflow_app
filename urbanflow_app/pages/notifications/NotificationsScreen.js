import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  SafeAreaView, 
  StyleSheet, 
  RefreshControl,
  ActivityIndicator,
  Text
} from 'react-native';
import notificationTheme from './theme/notificationTheme';

// Import API hook
import { useNotifications } from '../../utils/hooks/useAPI';

// Components
import NotificationHeader from './components/NotificationHeader';
import NotificationSection from './components/NotificationSection';
import EmptyState from './components/EmptyState';

const NotificationsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');
  
  // Use real API data instead of mock
  const { 
    notifications, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification,
    loading,
    error 
  } = useNotifications();

  // Calculate stats from real data
  const stats = {
    total: notifications?.length || 0,
    unread: notifications?.filter(n => !n.isRead).length || 0,
    important: notifications?.filter(n => n.severity === 'warning').length || 0,
    today: notifications?.filter(n => {
      const today = new Date();
      const notifDate = new Date(n.createdAt || n.timestamp);
      return notifDate.toDateString() === today.toDateString();
    }).length || 0,
  };

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      await fetchNotifications({ limit: 50 });
    } catch (err) {
      console.error('Error loading notifications:', err);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification) => {
    console.log('Notification pressed:', notification.title);
    
    // Mark as read via API when pressed
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (err) {
        console.error('Error marking notification as read:', err);
      }
    }
  };

  const handleDeleteNotification = async (notificationId) => {
    try {
      await deleteNotification(notificationId);
    } catch (err) {
      console.error('Error deleting notification:', err);
      Alert.alert('Error', 'Failed to delete notification');
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (err) {
      console.error('Error marking all as read:', err);
    }
  };

  const handleFilterSelect = (filter) => {
    setActiveFilter(filter);
    console.log('Filter selected:', filter);
  };

  // Group notifications by date and apply filter
  const filteredNotifications = notifications || [];
  
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

    // This Week section
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

  // Show loading state
  if (loading && !notifications) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.emptyContainer}>
          <ActivityIndicator size="large" color={notificationTheme.colors.primary} />
          <Text style={{ marginTop: 16, color: notificationTheme.colors.textSecondary }}>
            Loading notifications...
          </Text>
        </View>
      </SafeAreaView>
    );
  }

  if (notifications && notifications.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <NotificationHeader
          navigation={navigation}
          onFilterPress={handleFilterSelect}
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
        onFilterPress={() => {}}
        activeFilter={activeFilter}
        onFilterSelect={handleFilterSelect}
        stats={stats}
        showStats={true}
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
        {notifications && notifications.length === 0 ? (
          <EmptyState
            title="No notifications yet"
            message="Stay tuned for updates about your routes, traffic conditions, and transit information."
            icon="bell-off"
            onRefresh={handleRefresh}
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
