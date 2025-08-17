import React, { useState } from 'react';
import { 
  View, 
  ScrollView, 
  SafeAreaView, 
  StyleSheet, 
  Alert,
  RefreshControl 
} from 'react-native';
import notificationTheme from './theme/notificationTheme';

// Custom hooks
import { useNotifications } from './hooks/useNotifications';

// Components
import NotificationHeader from './components/NotificationHeader';
import FilterTabs from './components/FilterTabs';
import NotificationSection from './components/NotificationSection';
import EmptyState from './components/EmptyState';

const NotificationsScreen = ({ navigation }) => {
  const {
    notifications,
    groupedNotifications,
    loading,
    error,
    activeFilter,
    stats,
    setActiveFilter,
    markAsRead,
    toggleImportant,
    deleteNotification,
    refreshNotifications,
  } = useNotifications();

  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await refreshNotifications();
    setRefreshing(false);
  };

  const handleNotificationPress = (notification) => {
    console.log('Notification pressed:', notification.title);
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
          onPress: () => deleteNotification(notificationId)
        },
      ]
    );
  };

  const renderNotificationSections = () => {
    if (!groupedNotifications) return null;

    const sections = [];

    // Today section
    if (groupedNotifications.today.length > 0) {
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
          onToggleImportant={toggleImportant}
          onDelete={handleDeleteNotification}
        />
      );
    }

    // Yesterday section
    if (groupedNotifications.yesterday.length > 0) {
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
          onToggleImportant={toggleImportant}
          onDelete={handleDeleteNotification}
        />
      );
    }

    // This week section
    if (groupedNotifications.thisWeek.length > 0) {
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
          onToggleImportant={toggleImportant}
          onDelete={handleDeleteNotification}
        />
      );
    }

    // Older section
    if (groupedNotifications.older.length > 0) {
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
          onToggleImportant={toggleImportant}
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
          stats={stats}
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
          stats={stats}
          showStats={false}
        />
        <View style={styles.errorContainer}>
          <EmptyState
            title="Something went wrong"
            message={error}
            icon="alert-circle"
            onRefresh={refreshNotifications}
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
            onRefresh={refreshNotifications}
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
