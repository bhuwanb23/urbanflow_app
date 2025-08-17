import React, { useState, useEffect } from 'react';
import { 
  View, 
  ScrollView, 
  SafeAreaView, 
  StyleSheet, 
  Alert,
  RefreshControl 
} from 'react-native';
import notificationTheme from './theme/notificationTheme';

// Import API hooks
import { useNotifications } from '../../utils/hooks/useAPI';

// Components
import NotificationHeader from './components/NotificationHeader';
import FilterTabs from './components/FilterTabs';
import NotificationSection from './components/NotificationSection';
import EmptyState from './components/EmptyState';

const NotificationsScreen = ({ navigation }) => {
  const [refreshing, setRefreshing] = useState(false);
  const [activeFilter, setActiveFilter] = useState('all');

  // API hooks
  const { 
    notifications, 
    fetchNotifications, 
    markAsRead, 
    markAllAsRead,
    deleteNotification, 
    loading, 
    error 
  } = useNotifications();

  useEffect(() => {
    loadNotifications();
  }, []);

  // Show error alert if there's an API error
  useEffect(() => {
    if (error) {
      Alert.alert('Error', error, [
        { text: 'Retry', onPress: loadNotifications },
        { text: 'OK' }
      ]);
    }
  }, [error]);

  const loadNotifications = async () => {
    try {
      await fetchNotifications({ limit: 50 });
    } catch (error) {
      console.log('Error loading notifications:', error);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await loadNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = async (notification) => {
    console.log('Notification pressed:', notification.title);
    
    // Mark as read when pressed
    if (!notification.isRead) {
      try {
        await markAsRead(notification.id);
      } catch (error) {
        console.log('Error marking notification as read:', error);
      }
    }
    
    // Here you can navigate to specific screens based on notification type
    // For example: navigation.navigate('RouteDetails', { routeId: notification.routeId });
  };

  const handleFilterPress = () => {
    // Show filter modal or navigate to filter screen
    console.log('Filter pressed');
  };

  const handleDeleteNotification = (notificationId) => {
    Alert.alert(
      'Delete Notification',
      'Are you sure you want to delete this notification?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Delete', 
          style: 'destructive',
          onPress: async () => {
            try {
              await deleteNotification(notificationId);
            } catch (error) {
              console.log('Error deleting notification:', error);
            }
          }
        },
      ]
    );
  };

  const handleMarkAllAsRead = async () => {
    try {
      await markAllAsRead();
    } catch (error) {
      console.log('Error marking all notifications as read:', error);
    }
  };

  // Group notifications by date
  const groupedNotifications = notifications.reduce((groups, notification) => {
    const date = new Date(notification.createdAt);
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

  if (loading) {
    return (
      <SafeAreaView style={styles.container}>
        <NotificationHeader
          navigation={navigation}
          onFilterPress={handleFilterPress}
          stats={null} // No stats in this new structure
          showStats={false}
        />
        <View style={styles.loadingContainer}>
          <EmptyState
            title="Loading notifications..."
            message="Please wait while we fetch your latest updates."
            icon="loading"
            showRefreshButton={false}
          />
        </View>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView style={styles.container}>
        <NotificationHeader
          navigation={navigation}
          onFilterPress={handleFilterPress}
          stats={null} // No stats in this new structure
          showStats={false}
        />
        <View style={styles.errorContainer}>
          <EmptyState
            title="Something went wrong"
            message={error}
            icon="alert-circle"
            onRefresh={loadNotifications}
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
        stats={null} // No stats in this new structure
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
    paddingBottom: 80, // Adjusted padding to provide proper spacing without BottomActions
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

export default NotificationsScreen;
