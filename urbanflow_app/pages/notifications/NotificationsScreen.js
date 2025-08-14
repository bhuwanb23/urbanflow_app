import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width } = Dimensions.get('window');

const NOTIFICATIONS = [
  {
    id: '1',
    type: 'traffic',
    title: 'Traffic Alert',
    message: 'Heavy traffic on Route 101 North. Consider alternative routes to save 15 minutes.',
    time: '2 min ago',
    icon: 'alert-triangle',
    iconColor: '#ef4444',
    iconBg: '#fee2e2',
    category: 'Driving',
    categoryColor: '#ef4444',
    categoryBg: '#fee2e2',
    swipeAction: 'delete',
    swipeColor: '#ef4444',
  },
  {
    id: '2',
    type: 'route',
    title: 'Route Optimized',
    message: 'Your daily commute route has been updated. New route saves 8 minutes.',
    time: '5 min ago',
    icon: 'map-marker-path',
    iconColor: '#3b82f6',
    iconBg: '#dbeafe',
    category: 'Navigation',
    categoryColor: '#3b82f6',
    categoryBg: '#dbeafe',
    swipeAction: 'bookmark',
    swipeColor: '#3b82f6',
  },
  {
    id: '3',
    type: 'transit',
    title: 'Metro Service Update',
    message: 'Line 2 is running on schedule. Next train arrives in 3 minutes.',
    time: '12 min ago',
    icon: 'train',
    iconColor: '#10b981',
    iconBg: '#d1fae5',
    category: 'Transit',
    categoryColor: '#10b981',
    categoryBg: '#d1fae5',
    swipeAction: 'check',
    swipeColor: '#10b981',
  },
  {
    id: '4',
    type: 'bike',
    title: 'Bike Available',
    message: '5 bikes available at Central Station. Perfect weather for cycling!',
    time: '1 day ago',
    icon: 'bike',
    iconColor: '#f59e0b',
    iconBg: '#fef3c7',
    category: 'Bike Share',
    categoryColor: '#f59e0b',
    categoryBg: '#fef3c7',
    swipeAction: null,
    swipeColor: null,
  },
  {
    id: '5',
    type: 'parking',
    title: 'Parking Reminder',
    message: 'Your parking expires in 30 minutes. Extend or move your vehicle.',
    time: '1 day ago',
    icon: 'car',
    iconColor: '#8b5cf6',
    iconBg: '#ede9fe',
    category: 'Parking',
    categoryColor: '#8b5cf6',
    categoryBg: '#ede9fe',
    swipeAction: null,
    swipeColor: null,
  },
];

const TABS = ['All', 'Unread', 'Important'];

export default function NotificationsScreen({ navigation }) {
  const [activeTab, setActiveTab] = useState(0);
  const [notifications, setNotifications] = useState(NOTIFICATIONS);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate network loading
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  const handleBack = () => {
    navigation.goBack();
  };

  const handleFilter = () => {
    console.log('Filter pressed');
  };

  const handleMarkAllRead = () => {
    console.log('Mark all read pressed');
  };

  const handleSettings = () => {
    console.log('Settings pressed');
  };

  const handleNotificationPress = (notification) => {
    console.log('Notification pressed:', notification.title);
  };

  const handleSwipeAction = (notification) => {
    console.log('Swipe action:', notification.swipeAction);
    // Remove notification from list
    setNotifications(prev => prev.filter(n => n.id !== notification.id));
  };

  const filteredNotifications = notifications.filter(notification => {
    if (activeTab === 0) return true; // All
    if (activeTab === 1) return notification.type === 'unread'; // Unread
    if (activeTab === 2) return notification.type === 'important'; // Important
    return true;
  });

  if (loading) {
    return (
      <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#6366f1" />
        <Text style={{ marginTop: 16, color: '#6366f1', fontFamily: 'Urbanist_400Regular', fontSize: 16 }}>Loading notifications...</Text>
      </SafeAreaView>
    );
  }

    return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
      {/* Gradient Header */}
      <LinearGradient colors={["#6366f1", "#10b981"]} style={styles.headerGradient}>
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Notifications</Text>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity onPress={handleFilter} style={styles.headerButton}>
              <Icon name="filter-variant" size={20} color="#fff" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Icon name="check-all" size={20} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Tabs */}
        <View style={styles.tabsContainer}>
          <View style={styles.tabsWrapper}>
            {TABS.map((tab, index) => (
              <TouchableOpacity
                key={tab}
                style={[styles.tab, activeTab === index && styles.tabActive]}
                onPress={() => setActiveTab(index)}
              >
                <Text style={[styles.tabText, activeTab === index && styles.tabTextActive]}>
                  {tab}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Notifications List */}
        {filteredNotifications.length === 0 ? (
          <View style={styles.emptyState}>
            <View style={styles.emptyIcon}>
              <Icon name="bell-off" size={48} color="#9ca3af" />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyMessage}>
              Stay tuned for updates about your routes, traffic conditions, and transit information.
            </Text>
          </View>
        ) : (
          <>
            {/* Today Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Today</Text>
              </View>
              {filteredNotifications.slice(0, 3).map((notification, index) => (
                <MotiView
                  key={notification.id}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 500, delay: index * 100 }}
                  style={styles.notificationItem}
                >
                  <TouchableOpacity
                    style={styles.notificationContent}
                    onPress={() => handleNotificationPress(notification)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notificationLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: notification.iconBg }]}>
                        <Icon name={notification.icon} size={20} color={notification.iconColor} />
                      </View>
                    </View>
                    <View style={styles.notificationRight}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <Text style={styles.notificationTime}>{notification.time}</Text>
                      </View>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <View style={styles.notificationFooter}>
                        <View style={[styles.categoryBadge, { backgroundColor: notification.categoryBg }]}>
                          <Text style={[styles.categoryText, { color: notification.categoryColor }]}>
                            {notification.category}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                  {notification.swipeAction && (
                    <TouchableOpacity
                      style={[styles.swipeAction, { backgroundColor: notification.swipeColor }]}
                      onPress={() => handleSwipeAction(notification)}
                    >
                      <Icon 
                        name={notification.swipeAction === 'delete' ? 'delete' : 
                              notification.swipeAction === 'bookmark' ? 'bookmark' : 'check'} 
                        size={20} 
                        color="#fff" 
                      />
                    </TouchableOpacity>
                  )}
                </MotiView>
              ))}
            </View>

            {/* Yesterday Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionTitle}>Yesterday</Text>
              </View>
              {filteredNotifications.slice(3).map((notification, index) => (
                <MotiView
                  key={notification.id}
                  from={{ opacity: 0, translateY: 20 }}
                  animate={{ opacity: 1, translateY: 0 }}
                  transition={{ type: 'timing', duration: 500, delay: (index + 3) * 100 }}
                  style={styles.notificationItem}
                >
                  <TouchableOpacity
                    style={styles.notificationContent}
                    onPress={() => handleNotificationPress(notification)}
                    activeOpacity={0.7}
                  >
                    <View style={styles.notificationLeft}>
                      <View style={[styles.iconContainer, { backgroundColor: notification.iconBg }]}>
                        <Icon name={notification.icon} size={20} color={notification.iconColor} />
                      </View>
                    </View>
                    <View style={styles.notificationRight}>
                      <View style={styles.notificationHeader}>
                        <Text style={styles.notificationTitle}>{notification.title}</Text>
                        <Text style={styles.notificationTime}>{notification.time}</Text>
                      </View>
                      <Text style={styles.notificationMessage}>{notification.message}</Text>
                      <View style={styles.notificationFooter}>
                        <View style={[styles.categoryBadge, { backgroundColor: notification.categoryBg }]}>
                          <Text style={[styles.categoryText, { color: notification.categoryColor }]}>
                            {notification.category}
                          </Text>
                        </View>
                      </View>
                    </View>
                  </TouchableOpacity>
                </MotiView>
              ))}
            </View>
          </>
        )}
      </ScrollView>

      {/* Bottom Actions */}
      <View style={styles.bottomActions}>
        <TouchableOpacity style={styles.actionButton} onPress={handleMarkAllRead}>
          <Icon name="check-all" size={16} color="#64748b" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Mark All Read</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryAction]} onPress={handleSettings}>
          <Icon name="cog" size={16} color="#fff" style={{ marginRight: 8 }} />
                   <Text style={[styles.actionButtonText, { color: '#fff' }]}>Settings</Text>
       </TouchableOpacity>
     </View>
   </SafeAreaView>
 );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: 48,
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 6,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: 8,
    marginLeft: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
     tabsContainer: {
     backgroundColor: '#fff',
     paddingHorizontal: 20,
     paddingVertical: 16,
     marginBottom: 16,
     borderRadius: 12,
     borderWidth: 1,
     borderColor: '#f1f5f9',
   },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 8,
    alignItems: 'center',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  tabText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
     tabTextActive: {
     color: '#6366f1',
     fontFamily: 'Poppins_700Bold',
   },
   scrollContent: { 
     padding: 20, 
     paddingBottom: 80 
   },
  section: {
    backgroundColor: '#fff',
    marginTop: 8,
  },
  sectionHeader: {
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  notificationItem: {
    position: 'relative',
    backgroundColor: '#fff',
  },
  notificationContent: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  notificationLeft: {
    marginRight: 12,
  },
  iconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  notificationRight: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  notificationTitle: {
    fontSize: 14,
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  notificationTime: {
    fontSize: 12,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
  notificationMessage: {
    fontSize: 14,
    color: '#64748b',
    lineHeight: 20,
    marginBottom: 8,
    fontFamily: 'Urbanist_400Regular',
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  categoryText: {
    fontSize: 12,
    fontWeight: '500',
    fontFamily: 'Urbanist_400Regular',
  },
  swipeAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 80,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: '500',
    color: '#111827',
    marginBottom: 8,
    fontFamily: 'Poppins_700Bold',
  },
  emptyMessage: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Urbanist_400Regular',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
  },
  primaryAction: {
    backgroundColor: '#6366f1',
  },
  actionButtonText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
});
