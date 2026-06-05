import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { useLiveAlerts } from '../../../hooks/useLiveAlerts';

const SEVERITY_STYLES = {
  CRITICAL: {
    icon: 'alert-circle',
    color: '#EF4444',
    bg: '#FEF2F2',
    impact: 'Severe impact',
    impactColor: '#EF4444',
    impactIcon: 'alert',
  },
  WARNING: {
    icon: 'tools',
    color: '#F59E0B',
    bg: '#FFFBEB',
    impact: 'Moderate delay',
    impactColor: '#F59E0B',
    impactIcon: 'clock-outline',
  },
  INFO: {
    icon: 'check-circle',
    color: '#10B981',
    bg: '#ECFDF5',
    impact: 'Traffic normalizing',
    impactColor: '#10B981',
    impactIcon: 'check-circle',
  },
};

const DEFAULT_STYLE = {
  icon: 'information-outline',
  color: '#64748B',
  bg: '#F1F5F9',
  impact: 'Update',
  impactColor: '#64748B',
  impactIcon: 'information-outline',
};

const formatTimeAgo = (timestamp) => {
  if (!timestamp) return 'RECENT';
  const date = timestamp instanceof Date ? timestamp : new Date(timestamp);
  const diffMs = Date.now() - date.getTime();
  const diffMins = Math.floor(diffMs / 60000);
  if (diffMins < 1) return 'JUST NOW';
  if (diffMins < 60) return `${diffMins} min ago`;
  const diffHours = Math.floor(diffMins / 60);
  if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
  const diffDays = Math.floor(diffHours / 24);
  return `${diffDays} day${diffDays > 1 ? 's' : ''} ago`;
};

const stripHtml = (value) => (value ? value.replace(/<[^>]+>/g, '').trim() : '');

export default function RecentUpdates({ data: propData, limit = 3, onItemPress }) {
  const shouldFetch = !propData;
  const { alerts, loading, error, hasData } = useLiveAlerts(
    shouldFetch ? { limit, refreshInterval: 60000 } : { enabled: false }
  );

  const sourceData = propData || alerts;

  const updates = useMemo(() => {
    const list = sourceData || [];
    if (list.length === 0) {
      return [
        {
          id: 'placeholder-0',
          icon: DEFAULT_STYLE.icon,
          color: DEFAULT_STYLE.color,
          bg: DEFAULT_STYLE.bg,
          title: 'No recent updates',
          desc: 'New alerts and incidents will appear here',
          time: '—',
          impact: DEFAULT_STYLE.impact,
          impactColor: DEFAULT_STYLE.impactColor,
          impactIcon: DEFAULT_STYLE.impactIcon,
        },
      ];
    }
    return list.slice(0, limit).map((alert, idx) => {
      const style = SEVERITY_STYLES[alert.severity] || DEFAULT_STYLE;
      const title = stripHtml(alert.headerText) || 'Service update';
      const desc = stripHtml(alert.descriptionText) || 'Tap to view details';
      const time = formatTimeAgo(alert.startTime || alert.timestamp);
      return {
        id: alert.id || `update-${idx}`,
        ...style,
        title: title.slice(0, 80),
        desc: desc.slice(0, 140),
        time,
      };
    });
  }, [sourceData, limit]);

  const handlePress = (item) => {
    if (onItemPress) onItemPress(item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Recent Updates</Text>
      {loading && !hasData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#0F172A" />
          <Text style={styles.loadingText}>Loading recent updates…</Text>
        </View>
      ) : (
        updates.map((u, i) => (
          <MotiView
            key={u.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 400 + i * 100 }}
          >
            <TouchableOpacity
              style={styles.updateCard}
              onPress={() => handlePress(u)}
              activeOpacity={0.7}
            >
              <View style={styles.updateContent}>
                <View style={[styles.updateIconWrap, { backgroundColor: u.bg }]}>
                  <Icon name={u.icon} size={22} color={u.color} />
                </View>
                <View style={styles.updateInfo}>
                  <Text style={styles.updateTitle}>{u.title}</Text>
                  <Text style={styles.updateDesc}>{u.desc}</Text>
                  <View style={styles.updateMetaRow}>
                    <Text style={styles.updateTime}>{u.time}</Text>
                    <View style={styles.impactContainer}>
                      <Text style={[styles.updateImpact, { color: u.impactColor }]}>
                        {u.impact}
                      </Text>
                      <Icon
                        name={u.impactIcon}
                        size={14}
                        color={u.impactColor}
                        style={{ marginLeft: 4 }}
                      />
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </MotiView>
        ))
      )}
      {error && (
        <Text style={styles.errorText}>Couldn’t load updates: {error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#0F172A',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: -0.5,
  },
  updateCard: {
    borderRadius: 16,
    backgroundColor: '#FFFFFF',
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#64748B',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  updateContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  updateIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  updateInfo: {
    flex: 1,
  },
  updateTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'Urbanist_700Bold',
    marginBottom: 4,
  },
  updateDesc: {
    fontSize: 14,
    color: '#64748B',
    fontFamily: 'Urbanist_400Regular',
    marginBottom: 8,
    lineHeight: 20,
  },
  updateMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  updateTime: {
    fontSize: 12,
    color: '#94A3B8',
    fontFamily: 'Urbanist_400Regular',
  },
  impactContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  updateImpact: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_700Bold',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    color: '#64748B',
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
  },
  errorText: {
    color: '#ef4444',
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
    marginTop: 8,
  },
});
