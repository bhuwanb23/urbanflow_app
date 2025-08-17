import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, ActivityIndicator, SafeAreaView, Dimensions } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

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
    <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }} edges={['top']}>
      {/* Enhanced Gradient Header */}
      <LinearGradient 
        colors={["#6366f1", "#8b5cf6", "#10b981"]} 
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.headerGradient}
      >
        <View style={styles.headerRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={handleBack} style={styles.backButton}>
              <Icon name="arrow-left" size={24} color="#fff" />
            </TouchableOpacity>
            <View style={styles.titleContainer}>
              <Text style={styles.headerTitle}>Notifications</Text>
              <Text style={styles.headerSubtitle}>Stay updated with your journey</Text>
            </View>
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
        {/* Enhanced Tabs */}
        <MotiView 
          from={{ opacity: 0, translateY: -20 }} 
          animate={{ opacity: 1, translateY: 0 }} 
          transition={{ type: 'timing', duration: 600 }}
          style={styles.tabsContainer}
        >
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
                {activeTab === index && (
                  <View style={styles.tabIndicator} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        </MotiView>

        {/* Enhanced Notifications List */}
        {filteredNotifications.length === 0 ? (
          <MotiView 
            from={{ opacity: 0, scale: 0.9 }} 
            animate={{ opacity: 1, scale: 1 }} 
            transition={{ type: 'timing', duration: 600 }}
            style={styles.emptyState}
          >
            <View style={styles.emptyIcon}>
              <Icon name="bell-off" size={48} color="#9ca3af" />
            </View>
            <Text style={styles.emptyTitle}>No notifications yet</Text>
            <Text style={styles.emptyMessage}>
              Stay tuned for updates about your routes, traffic conditions, and transit information.
            </Text>
          </MotiView>
        ) : (
          <>
            {/* Enhanced Today Section */}
            <MotiView 
              from={{ opacity: 0, translateY: 20 }} 
              animate={{ opacity: 1, translateY: 0 }} 
              transition={{ type: 'timing', duration: 600, delay: 200 }}
              style={styles.section}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <View style={styles.sectionTitleDot} />
                  <Text style={styles.sectionTitle}>Today</Text>
                </View>
                <Text style={styles.sectionCount}>{filteredNotifications.slice(0, 3).length} notifications</Text>
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
              </MotiView>

            {/* Enhanced Yesterday Section */}
            <MotiView 
              from={{ opacity: 0, translateY: 20 }} 
              animate={{ opacity: 1, translateY: 0 }} 
              transition={{ type: 'timing', duration: 600, delay: 400 }}
              style={styles.section}
            >
              <View style={styles.sectionHeader}>
                <View style={styles.sectionTitleRow}>
                  <View style={[styles.sectionTitleDot, { backgroundColor: '#8b5cf6' }]} />
                  <Text style={styles.sectionTitle}>Yesterday</Text>
                </View>
                <Text style={styles.sectionCount}>{filteredNotifications.slice(3).length} notifications</Text>
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
              </MotiView>
          </>
        )}
      </ScrollView>

      {/* Enhanced Bottom Actions */}
      <MotiView 
        from={{ opacity: 0, translateY: 20 }} 
        animate={{ opacity: 1, translateY: 0 }} 
        transition={{ type: 'timing', duration: 600, delay: 600 }}
        style={styles.bottomActions}
      >
        <TouchableOpacity style={styles.actionButton} onPress={handleMarkAllRead}>
          <Icon name="check-all" size={16} color="#64748b" style={{ marginRight: 8 }} />
          <Text style={styles.actionButtonText}>Mark All Read</Text>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionButton, styles.primaryAction]} onPress={handleSettings}>
          <Icon name="cog" size={16} color="#fff" style={{ marginRight: 8 }} />
          <Text style={[styles.actionButtonText, { color: '#fff' }]}>Settings</Text>
        </TouchableOpacity>
      </MotiView>
   </SafeAreaView>
 );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: Math.max(48, height * 0.06),
    paddingBottom: Math.max(24, height * 0.03),
    paddingHorizontal: Math.max(24, width * 0.06),
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 8,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: Math.max(8, width * 0.02),
    marginRight: Math.max(12, width * 0.03),
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: Math.max(24, width * 0.06),
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: Math.max(12, width * 0.03),
    color: 'rgba(255,255,255,0.8)',
    fontFamily: 'Urbanist_400Regular',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: Math.max(8, width * 0.02),
    marginLeft: Math.max(8, width * 0.02),
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabsContainer: {
    backgroundColor: '#fff',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, height * 0.02),
    marginBottom: Math.max(16, height * 0.02),
    marginHorizontal: Math.max(20, width * 0.05),
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#f1f5f9',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 12,
    padding: 4,
  },
  tab: {
    flex: 1,
    paddingVertical: Math.max(8, height * 0.01),
    paddingHorizontal: Math.max(16, width * 0.04),
    borderRadius: 8,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    backgroundColor: '#fff',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -4,
    left: '50%',
    marginLeft: -8,
    width: 16,
    height: 3,
    backgroundColor: '#6366f1',
    borderRadius: 2,
  },
  tabText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
  tabTextActive: {
    color: '#6366f1',
    fontFamily: 'Poppins_700Bold',
  },
  scrollContent: { 
    padding: Math.max(20, width * 0.05), 
    paddingBottom: Math.max(100, height * 0.12) 
  },
  section: {
    backgroundColor: '#fff',
    marginTop: Math.max(8, height * 0.01),
    borderRadius: 16,
    marginHorizontal: Math.max(20, width * 0.05),
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(12, height * 0.015),
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionTitleDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#6366f1',
    marginRight: Math.max(8, width * 0.02),
  },
  sectionTitle: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '600',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sectionCount: {
    fontSize: Math.max(12, width * 0.03),
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
  notificationItem: {
    position: 'relative',
    backgroundColor: '#fff',
    marginHorizontal: Math.max(20, width * 0.05),
    marginBottom: Math.max(8, height * 0.01),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 1,
  },
  notificationContent: {
    flexDirection: 'row',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, height * 0.02),
    borderBottomWidth: 1,
    borderBottomColor: '#f8fafc',
  },
  notificationLeft: {
    marginRight: Math.max(12, width * 0.03),
  },
  iconContainer: {
    width: Math.max(40, width * 0.1),
    height: Math.max(40, width * 0.1),
    borderRadius: Math.max(20, width * 0.05),
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  notificationRight: {
    flex: 1,
  },
  notificationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Math.max(4, height * 0.005),
  },
  notificationTitle: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '500',
    color: '#111827',
    fontFamily: 'Poppins_700Bold',
  },
  notificationTime: {
    fontSize: Math.max(12, width * 0.03),
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
  notificationMessage: {
    fontSize: Math.max(14, width * 0.035),
    color: '#64748b',
    lineHeight: Math.max(20, height * 0.025),
    marginBottom: Math.max(8, height * 0.01),
    fontFamily: 'Urbanist_400Regular',
  },
  notificationFooter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  categoryBadge: {
    paddingHorizontal: Math.max(8, width * 0.02),
    paddingVertical: Math.max(4, height * 0.005),
    borderRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 1,
  },
  categoryText: {
    fontSize: Math.max(12, width * 0.03),
    fontWeight: '500',
    fontFamily: 'Urbanist_400Regular',
  },
  swipeAction: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: Math.max(80, width * 0.2),
    alignItems: 'center',
    justifyContent: 'center',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: Math.max(60, height * 0.08),
    paddingHorizontal: Math.max(40, width * 0.1),
  },
  emptyIcon: {
    width: Math.max(80, width * 0.2),
    height: Math.max(80, width * 0.2),
    borderRadius: Math.max(40, width * 0.1),
    backgroundColor: '#f1f5f9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: Math.max(16, height * 0.02),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  emptyTitle: {
    fontSize: Math.max(18, width * 0.045),
    fontWeight: '500',
    color: '#111827',
    marginBottom: Math.max(8, height * 0.01),
    fontFamily: 'Poppins_700Bold',
  },
  emptyMessage: {
    fontSize: Math.max(14, width * 0.035),
    color: '#64748b',
    textAlign: 'center',
    lineHeight: Math.max(20, height * 0.025),
    fontFamily: 'Urbanist_400Regular',
  },
  bottomActions: {
    flexDirection: 'row',
    paddingHorizontal: Math.max(20, width * 0.05),
    paddingVertical: Math.max(16, height * 0.02),
    backgroundColor: '#fff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
    gap: Math.max(12, width * 0.03),
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 8,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: Math.max(12, height * 0.015),
    paddingHorizontal: Math.max(16, width * 0.04),
    borderRadius: 12,
    backgroundColor: '#f1f5f9',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  primaryAction: {
    backgroundColor: '#6366f1',
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  actionButtonText: {
    fontSize: Math.max(14, width * 0.035),
    fontWeight: '500',
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
});
