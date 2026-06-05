import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { useLiveAlerts } from '../../../hooks/useLiveAlerts';

const TRANSIT_MODES = [
  { id: 'metro', icon: 'train', label: 'Metro', color: '#6366f1', bg: '#e0e7ff' },
  { id: 'bus', icon: 'bus', label: 'Bus', color: '#10b981', bg: '#d1fae5' },
  { id: 'tram', icon: 'tram', label: 'Tram', color: '#ef4444', bg: '#fee2e2' },
];

const SEVERITY_TO_STATUS = {
  CRITICAL: { status: 'Disrupted', statusColor: '#ef4444', statusBg: '#fee2e2' },
  WARNING: { status: 'Slight delay', statusColor: '#facc15', statusBg: '#fef9c3' },
  INFO: { status: 'On time', statusColor: '#22c55e', statusBg: '#bbf7d0' },
};

const DEFAULT_STATUS = { status: 'No data', statusColor: '#94a3b8', statusBg: '#f1f5f9' };

export default function TransitStatus({ data: propData, limit = 3, onItemPress }) {
  const shouldFetch = !propData;
  const { alerts, loading, error, hasData } = useLiveAlerts(
    shouldFetch ? { limit, refreshInterval: 60000 } : { enabled: false }
  );

  const sourceData = propData || alerts;

  const items = useMemo(() => {
    if (!sourceData || sourceData.length === 0) return [];
    const mapped = sourceData.slice(0, limit).map((alert, idx) => {
      const mode = TRANSIT_MODES[idx % TRANSIT_MODES.length];
      const sev = SEVERITY_TO_STATUS[alert.severity] || DEFAULT_STATUS;
      const desc = alert.descriptionText
        ? alert.descriptionText.replace(/<[^>]+>/g, '').slice(0, 60)
        : alert.effect
          ? `Effect: ${alert.effect.replace(/_/g, ' ').toLowerCase()}`
          : 'No description';
      return {
        id: alert.id || `transit-${idx}`,
        icon: mode.icon,
        color: mode.color,
        bg: mode.bg,
        title: alert.headerText?.replace(/<[^>]+>/g, '').slice(0, 40) || `${mode.label} Line ${idx + 1}`,
        desc,
        ...sev,
      };
    });

    if (mapped.length > 0) return mapped;

    return TRANSIT_MODES.map((mode, idx) => ({
      id: `placeholder-${mode.id}`,
      icon: mode.icon,
      color: mode.color,
      bg: mode.bg,
      title: `${mode.label} Line ${idx + 1}`,
      desc: 'No live data available',
      ...DEFAULT_STATUS,
    }));
  }, [sourceData, limit]);

  const handlePress = (item) => {
    if (onItemPress) {
      onItemPress(item);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Transit Status</Text>
      {loading && !hasData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6366f1" />
          <Text style={styles.loadingText}>Loading transit status…</Text>
        </View>
      ) : (
        items.map((t, i) => (
          <MotiView
            key={t.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 800 + i * 100 }}
          >
            <TouchableOpacity
              style={styles.transitCard}
              onPress={() => handlePress(t)}
              activeOpacity={0.7}
            >
              <View style={styles.transitContent}>
                <View style={[styles.transitIconWrap, { backgroundColor: t.bg }]}>
                  <Icon name={t.icon} size={22} color={t.color} />
                </View>
                <View style={styles.transitInfo}>
                  <View style={styles.transitHeaderRow}>
                    <Text style={styles.transitTitle}>{t.title}</Text>
                    <View style={[styles.transitStatus, { backgroundColor: t.statusBg }]}>
                      <Text style={[styles.transitStatusText, { color: t.statusColor }]}>
                        {t.status}
                      </Text>
                    </View>
                  </View>
                  <Text style={styles.transitDesc}>{t.desc}</Text>
                </View>
              </View>
            </TouchableOpacity>
          </MotiView>
        ))
      )}
      {error && (
        <Text style={styles.errorText}>Couldn’t reach live service: {error}</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#6366f1',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.2,
  },
  transitCard: {
    borderRadius: 18,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#0EA5E9',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  transitContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  transitIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  transitInfo: {
    flex: 1,
  },
  transitHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  transitTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    fontFamily: 'Poppins_700Bold',
    flex: 1,
  },
  transitStatus: {
    borderRadius: 10,
    paddingHorizontal: 8,
    paddingVertical: 2,
    marginLeft: 8,
  },
  transitStatusText: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
  },
  transitDesc: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
    lineHeight: 20,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    gap: 8,
  },
  loadingText: {
    color: '#64748b',
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
