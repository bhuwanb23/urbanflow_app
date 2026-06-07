import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, Dimensions } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

// Import real-time widgets
import TrafficWidget from './TrafficWidget';
import AQIWidget from './AQIWidget';
import TransitStatus from './TransitStatus';
import TrafficConditions from './TrafficConditions';
import RecentUpdates from './RecentUpdates';
import PopularRoutes from './PopularRoutes';

// Import Phase 4 hooks
import { useLiveAlerts } from '../../../hooks/useLiveAlerts';

const { width } = Dimensions.get('window');

// Phase 4: Helper functions for feed item styling
const getFeedItemStyle = (type) => {
  const styles = {
    alert: { backgroundColor: '#ffd9de' },
    warning: { backgroundColor: '#fff3cd' },
    update: { backgroundColor: '#b4f0c9' }
  };
  return styles[type] || styles.update;
};

const getFeedItemIcon = (type) => {
  const icons = {
    alert: 'alert-outline',
    warning: 'warning',
    update: 'information-outline'
  };
  return icons[type] || 'information-outline';
};

const getFeedItemColor = (type) => {
  const colors = {
    alert: '#a72d51',
    warning: '#856404',
    update: '#006b2c'
  };
  return colors[type] || '#006b2c';
};

const getFeedBadgeStyle = (severity) => {
  const styles = {
    CRITICAL: { backgroundColor: '#ffb2bf' },
    WARNING: { backgroundColor: '#ffe69c' },
    INFO: { backgroundColor: '#b4f0c9' }
  };
  return styles[severity] || styles.INFO;
};

const getFeedBadgeTextColor = (severity) => {
  const colors = {
    CRITICAL: { color: '#a72d51' },
    WARNING: { color: '#856404' },
    INFO: { color: '#006b2c' }
  };
  return colors[severity] || colors.INFO;
};

const formatFeedTime = (timestamp) => {
  if (!timestamp) return 'RECENT';
  const date = new Date(timestamp);
  const now = new Date();
  const diffMs = now - date;
  const diffMins = Math.floor(diffMs / 60000);
  
  if (diffMins < 1) return 'JUST NOW';
  if (diffMins < 60) return `${diffMins} MIN AGO`;
  const diffHours = Math.floor(diffMins / 60);
  return `${diffHours} HOUR${diffHours > 1 ? 'S' : ''} AGO`;
};

const LiveDashboard = () => {
  const [_lastUpdated, setLastUpdated] = useState(new Date());
  const [_refreshing, setRefreshing] = useState(false);

  // Phase 4: Fetch real alerts from backend
  const { feedItems, loading: alertsLoading, hasData } = useLiveAlerts({
    limit: 5,
    refreshInterval: 60000
  });

  // Auto-refresh timer with animation trigger
  useEffect(() => {
    const interval = setInterval(() => {
      setLastUpdated(new Date());
    }, 30000); // Update every 30 seconds
    
    return () => clearInterval(interval);
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    setLastUpdated(new Date());
    // Simulate refresh delay for smooth animation
    setTimeout(() => setRefreshing(false), 800);
  };

  const formatLastUpdated = (date) => {
    const now = new Date();
    const diffMs = now - date;
    const diffSecs = Math.floor(diffMs / 1000);
    
    if (diffSecs < 60) return `Updated ${diffSecs}s ago`;
    const diffMins = Math.floor(diffSecs / 60);
    return `Updated ${diffMins}m ago`;
  };
  return (
    <ScrollView showsVerticalScrollIndicator={false} contentContainerStyle={styles.container}>
      
      {/* Quick Stats Grid */}
      <View style={styles.statsContainer}>
        {/* Live Pulse Widget */}
        <View style={styles.liveWidget}>
          <View>
            <Text style={styles.liveLabel}>SYSTEM STATUS</Text>
            <Text style={styles.liveTitle}>Metropolitan Core</Text>
          </View>
          <View style={styles.pulseContainer}>
            <MotiView
              from={{ scale: 0.8, opacity: 0.5 }}
              animate={{ scale: 1.2, opacity: 0 }}
              transition={{
                type: 'timing',
                duration: 2000,
                loop: true,
              }}
              style={styles.pulseDotOutline}
            />
            <View style={styles.pulseDot} />
            <Text style={styles.pulseText}>LIVE INSIGHTS</Text>
          </View>
        </View>

        <View style={styles.statsGrid}>
          {/* AQI - Real-time with animation */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 100 }}
            style={{ flex: 1 }}
          >
            <AQIWidget />
          </MotiView>

          {/* Traffic - Real-time with animation */}
          <MotiView
            from={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', damping: 12, delay: 200 }}
            style={{ flex: 1 }}
          >
            <TrafficWidget />
          </MotiView>

          {/* Incidents */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 300 }}
            style={{ width: (width - 32 - 12) / 2 }}
          >
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Icon name="alert-outline" size={20} color="#191c1d" />
              </View>
              <Text style={styles.statLabel}>ACTIVE ALERTS</Text>
              <Text style={styles.statValue}>03</Text>
            </View>
          </MotiView>

          {/* Transport */}
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: 400 }}
            style={{ width: (width - 32 - 12) / 2 }}
          >
            <View style={styles.statCard}>
              <View style={styles.statHeader}>
                <Icon name="bus" size={20} color="#006b2c" />
                <View style={[styles.statBadge, { backgroundColor: '#b4f0c9' }]}>
                  <Text style={[styles.statBadgeText, { color: '#006b2c' }]}>Active</Text>
                </View>
              </View>
              <Text style={styles.statLabel}>TRANSIT CAP.</Text>
              <Text style={styles.statValue}>92<Text style={styles.statUnit}>%</Text></Text>
            </View>
          </MotiView>
        </View>
      </View>

      {/* Compact Map Widget */}
      <View style={styles.mapWidget}>
        <View style={styles.mapPlaceholder}>
          <Image 
            source={{ uri: 'https://lh3.googleusercontent.com/aida-public/AB6AXuC1XkdmOxVrQWtbED7wlX10SlMl11OQxS9rk0NbRAVWnl-UDLsvCwQpHdYrV5wcU28eNCGIy0CXFNpYUNf8nA1VRGKghuX3_N-I2X4_kWWNreJ1QtXlRGZFCDhJ31BJ27IRS4IL1UBNaYjHa9y0757h1JcCT1nlcCHX-zaEjfbKd2ndroMVVjbeRMjDD5dJ6UhjZ_d_KmQhoofK3NFyaneSWCFmh7fRUw_mA26AGFL5_hYcbkRA-sTBbQa_Tex6ab4TKqRGtwiG4IPj' }}
            style={styles.mapImage}
          />
          <View style={styles.mapOverlay}>
            <View style={styles.mapDot} />
            <Text style={styles.mapOverlayText}>ZONE A-1 COVERAGE</Text>
          </View>
          <View style={styles.mapControls}>
            <TouchableOpacity style={styles.mapBtn}><Icon name="plus" size={24} color="#191c1d" /></TouchableOpacity>
            <TouchableOpacity style={styles.mapBtn}><Icon name="minus" size={24} color="#191c1d" /></TouchableOpacity>
            <TouchableOpacity style={[styles.mapBtn, { backgroundColor: '#006b2c' }]}><Icon name="crosshairs-gps" size={20} color="#ffffff" /></TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Live Feed Section */}
      <View style={styles.feedSection}>
        <View style={styles.feedHeader}>
          <View style={styles.feedHeaderLeft}>
            <MotiView
              from={{ rotate: '0deg', scale: 0.8 }}
              animate={{ rotate: '360deg', scale: 1 }}
              transition={{ type: 'timing', duration: 800, delay: 500 }}
            >
              <View style={styles.feedIconBg}>
                <Icon name="access-point" size={20} color="#006b2c" />
              </View>
            </MotiView>
            <Text style={styles.feedTitle}>Real-Time Activity</Text>
          </View>
          <TouchableOpacity onPress={() => console.log('View Archive pressed')}>
            <Text style={styles.feedLink}>VIEW ARCHIVE</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.feedList}>
          {alertsLoading ? (
            // Loading skeleton
            <View style={styles.feedItem}>
              <View style={styles.feedItemLeft}>
                <View style={[styles.feedItemIcon, { backgroundColor: '#e1e3e4' }]} />
                <View>
                  <View style={styles.skeletonTextShort} />
                  <View style={styles.skeletonTextLong} />
                </View>
              </View>
            </View>
          ) : hasData && feedItems.length > 0 ? (
            // Render real alerts from API with staggered animations
            feedItems.map((item, index) => (
              <MotiView
                key={item.id}
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ 
                  type: 'spring',
                  damping: 12,
                  delay: 600 + (index * 100)
                }}
                style={{ width: '100%' }}
              >
                <View style={styles.feedItem}>
                  <View style={styles.feedItemLeft}>
                    <MotiView
                      from={{ scale: 0.5, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: 'spring',
                        damping: 15,
                        delay: 700 + (index * 100)
                      }}
                    >
                      <View style={[styles.feedItemIcon, getFeedItemStyle(item.type)]}>
                        <Icon name={getFeedItemIcon(item.type)} size={24} color={getFeedItemColor(item.type)} />
                      </View>
                    </MotiView>
                    <View>
                      <Text style={styles.feedItemTitle}>{item.title}</Text>
                      <Text style={styles.feedItemDesc}>{item.description}</Text>
                    </View>
                  </View>
                  <View style={styles.feedItemRight}>
                    <MotiView
                      from={{ scale: 0.8, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ 
                        type: 'spring',
                        damping: 12,
                        delay: 800 + (index * 100)
                      }}
                    >
                      <View style={[styles.feedBadge, getFeedBadgeStyle(item.severity)]}>
                        <Text style={[styles.feedBadgeText, getFeedBadgeTextColor(item.severity)]}>
                          {item.severity === 'CRITICAL' ? 'ALERT' : item.severity === 'WARNING' ? 'WARN' : 'INFO'}
                        </Text>
                      </View>
                    </MotiView>
                    <Text style={styles.feedTime}>{formatFeedTime(item.timestamp)}</Text>
                  </View>
                </View>
              </MotiView>
            ))
          ) : (
            // Empty state when no real alerts and no fallback data
            <View style={styles.feedItem}>
              <View style={styles.feedItemLeft}>
                <View style={[styles.feedItemIcon, { backgroundColor: '#e1e3e4' }]}>
                  <Icon name="check-circle" size={24} color="#006b2c" />
                </View>
                <View>
                  <Text style={styles.feedItemTitle}>All clear</Text>
                  <Text style={styles.feedItemDesc}>No active alerts right now</Text>
                </View>
              </View>
              <View style={styles.feedItemRight}>
                <Text style={styles.feedTime}>—</Text>
              </View>
            </View>
          )}
        </View>
      </View>

      {/* Phase 3.2 — Real data widgets re-integrated */}
      <TransitStatus limit={3} />
      <TrafficConditions area="bengaluru" />
      <RecentUpdates limit={3} />
      <PopularRoutes limit={3} />

    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    paddingBottom: 40,
  },
  statsContainer: {
    marginBottom: 16,
  },
  liveWidget: {
    backgroundColor: '#ffffff',
    borderRadius: 24,
    padding: 20,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e7e8e9',
  },
  liveLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3e4a3d',
    letterSpacing: 1,
    marginBottom: 4,
  },
  liveTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#191c1d',
  },
  pulseContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#b4f0c9',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 999,
  },
  pulseDotOutline: {
    position: 'absolute',
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#006b2c',
    left: 12,
  },
  pulseDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#006b2c',
    marginRight: 8,
  },
  pulseText: {
    color: '#006b2c',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: -0.5,
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  statCard: {
    width: (width - 32 - 12) / 2,
    backgroundColor: '#f3f4f5',
    borderRadius: 24,
    padding: 16,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
    height: 24,
  },
  statBadge: {
    backgroundColor: '#ffffff',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
  },
  statBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    textTransform: 'uppercase',
  },
  statLabel: {
    fontSize: 11,
    color: '#3e4a3d',
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#191c1d',
    marginTop: 2,
  },
  statUnit: {
    fontSize: 14,
    fontWeight: 'normal',
    color: '#3e4a3d',
  },
  mapWidget: {
    height: 300,
    borderRadius: 32,
    overflow: 'hidden',
    marginBottom: 16,
  },
  mapPlaceholder: {
    flex: 1,
    backgroundColor: '#d9dadb',
    position: 'relative',
  },
  mapImage: {
    width: '100%',
    height: '100%',
  },
  mapOverlay: {
    position: 'absolute',
    top: 16,
    left: 16,
    backgroundColor: 'rgba(255,255,255,0.8)',
    padding: 12,
    borderRadius: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  mapDot: {
    width: 8,
    height: 8,
    backgroundColor: '#006b2c',
    borderRadius: 4,
    marginRight: 8,
  },
  mapOverlayText: {
    fontSize: 10,
    fontWeight: 'bold',
    letterSpacing: 1,
    color: '#191c1d',
  },
  mapControls: {
    position: 'absolute',
    bottom: 16,
    right: 16,
    gap: 8,
  },
  mapBtn: {
    width: 48,
    height: 48,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  feedSection: {
    backgroundColor: '#ffffff',
    borderRadius: 32,
    padding: 24,
    borderWidth: 1,
    borderColor: '#e7e8e9',
  },
  feedHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  feedHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  feedIconBg: {
    backgroundColor: '#7ffc97',
    padding: 8,
    borderRadius: 12,
    marginRight: 12,
  },
  feedTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#191c1d',
  },
  feedLink: {
    color: '#006b2c',
    fontSize: 12,
    fontWeight: 'bold',
    letterSpacing: 1,
  },
  feedList: {
    gap: 12,
  },
  feedItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#f8f9fa',
    borderRadius: 20,
  },
  feedItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  feedItemIcon: {
    width: 48,
    height: 48,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  feedItemTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: '#191c1d',
    marginBottom: 2,
  },
  feedItemDesc: {
    fontSize: 12,
    color: '#3e4a3d',
    paddingRight: 16,
  },
  feedItemRight: {
    alignItems: 'flex-end',
  },
  feedBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 999,
    marginBottom: 4,
  },
  feedBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
  },
  feedTime: {
    fontSize: 10,
    color: '#6e7b6c',
    fontWeight: '600',
  },
});

export default LiveDashboard;