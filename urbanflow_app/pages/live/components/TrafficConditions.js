import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Dimensions, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { useTrafficConditions } from '../../../hooks/useTrafficConditions';

const { width } = Dimensions.get('window');

const LEVEL_STYLES = {
  HIGH: { icon: 'trending-up', color: '#EF4444', bg: '#FEF2F2', borderColor: '#FECACA' },
  MODERATE: { icon: 'trending-flat', color: '#F59E0B', bg: '#FFFBEB', borderColor: '#FDE68A' },
  LIGHT: { icon: 'trending-down', color: '#10B981', bg: '#ECFDF5', borderColor: '#A7F3D0' },
  CONSTRUCTION: { icon: 'information', color: '#3B82F6', bg: '#EFF6FF', borderColor: '#BFDBFE' },
  UNKNOWN: { icon: 'help-circle-outline', color: '#64748b', bg: '#F8FAFC', borderColor: '#E2E8F0' },
};

const DEFAULT_PLACES = [
  'Main Highway',
  'City Center',
  'Residential Areas',
  'West Boulevard',
];

const mapLevelKey = (level) => {
  if (!level) return 'UNKNOWN';
  const upper = String(level).toUpperCase();
  if (upper.includes('HIGH') || upper.includes('HEAVY')) return 'HIGH';
  if (upper.includes('MODERATE') || upper.includes('MEDIUM')) return 'MODERATE';
  if (upper.includes('LIGHT') || upper.includes('LOW')) return 'LIGHT';
  if (upper.includes('CONSTRUCTION') || upper.includes('WORK') || upper.includes('CLOSED')) return 'CONSTRUCTION';
  return 'UNKNOWN';
};

const formatDelay = (delayMinutes) => {
  if (delayMinutes == null) return 'No data';
  if (delayMinutes === 0) return 'No delays';
  return `${delayMinutes} min delay`;
};

const formatChange = (change) => {
  if (change == null) return 'No data';
  if (change === 0) return 'Normal flow';
  return `${change > 0 ? '+' : ''}${change}% than usual`;
};

export default function TrafficConditions({ area: areaProp, data: propData, onRefresh }) {
  const area = areaProp || 'bengaluru';

  const shouldFetch = !propData;
  const { conditions, loading, error, refetch, hasData } = useTrafficConditions(
    shouldFetch ? area : null,
    { refreshInterval: 60000 }
  );

  const handleRefresh = async () => {
    if (onRefresh) {
      onRefresh();
    } else if (refetch) {
      await refetch();
    }
  };

  const cards = useMemo(() => {
    const source = propData || conditions;
    if (source && source.length > 0) {
      return source.slice(0, 4).map((c, idx) => {
        const levelKey = mapLevelKey(c.level || c.congestionLevel);
        const style = LEVEL_STYLES[levelKey] || LEVEL_STYLES.UNKNOWN;
        return {
          id: c.id || `traffic-${idx}`,
          level: c.level
            ? c.level.charAt(0).toUpperCase() + c.level.slice(1).toLowerCase()
            : levelKey === 'UNKNOWN'
              ? 'Unknown'
              : levelKey.charAt(0) + levelKey.slice(1).toLowerCase(),
          icon: style.icon,
          color: style.color,
          place: c.area || c.place || c.name || DEFAULT_PLACES[idx] || 'Area',
          change: formatChange(c.changePercent ?? c.change),
          delay: formatDelay(c.delayMinutes ?? c.delay),
          delayColor: style.color,
          bg: style.bg,
          borderColor: style.borderColor,
        };
      });
    }
    return DEFAULT_PLACES.map((place, idx) => {
      const style = LEVEL_STYLES.UNKNOWN;
      return {
        id: `placeholder-${idx}`,
        level: 'No data',
        icon: style.icon,
        color: style.color,
        place,
        change: 'No data',
        delay: 'No data',
        delayColor: style.color,
        bg: style.bg,
        borderColor: style.borderColor,
      };
    });
  }, [propData, conditions]);

  return (
    <View style={styles.container}>
      <View style={styles.sectionRow}>
        <Text style={styles.sectionTitle}>Traffic Conditions</Text>
        <TouchableOpacity style={styles.refreshBtn} onPress={handleRefresh} disabled={loading}>
          <Icon name="refresh" size={16} color="#10B981" style={{ marginRight: 4 }} />
          <Text style={styles.refreshText}>{loading ? 'Loading…' : 'Refresh'}</Text>
        </TouchableOpacity>
      </View>

      {error && !hasData ? (
        <View style={styles.errorBox}>
          <Icon name="alert-circle-outline" size={20} color="#EF4444" />
          <Text style={styles.errorText}>Traffic data unavailable: {error}</Text>
        </View>
      ) : null}

      <View style={styles.trafficGrid}>
        {cards.map((t, i) => (
          <MotiView
            key={t.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 200 + i * 80 }}
          >
            <View style={[styles.trafficCard, { backgroundColor: t.bg, borderColor: t.borderColor }]}>
              <View style={styles.trafficHeader}>
                <Icon name={t.icon} size={20} color={t.color} style={{ marginRight: 6 }} />
                <Text style={[styles.trafficLevel, { color: t.color }]}>{t.level}</Text>
              </View>
              <Text style={styles.trafficPlace}>{t.place}</Text>
              <View style={styles.trafficMeta}>
                <Text style={styles.trafficChange}>{t.change}</Text>
                <Text style={[styles.trafficDelay, { color: t.delayColor }]}>{t.delay}</Text>
              </View>
            </View>
          </MotiView>
        ))}
        {loading && !hasData ? (
          <View style={styles.loadingOverlay}>
            <ActivityIndicator size="small" color="#10B981" />
          </View>
        ) : null}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0F172A',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: -0.5,
  },
  refreshBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#D1FAE5',
  },
  refreshText: {
    color: '#059669',
    fontWeight: '700',
    fontFamily: 'Urbanist_600SemiBold',
    fontSize: 12,
  },
  trafficGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 12,
  },
  trafficCard: {
    width: (width - 48 - 12) / 2,
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
  },
  trafficHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    flexWrap: 'wrap',
  },
  trafficLevel: {
    fontSize: 12,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
    flex: 1,
    flexWrap: 'wrap',
  },
  trafficPlace: {
    fontSize: 12,
    color: '#64748B',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 12,
    flexWrap: 'wrap',
  },
  trafficMeta: {
    flexDirection: 'column',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 4,
  },
  trafficChange: {
    fontSize: 10,
    color: '#94A3B8',
    fontFamily: 'Urbanist_400Regular',
  },
  trafficDelay: {
    fontSize: 10,
    fontWeight: 'bold',
    fontFamily: 'Urbanist_700Bold',
  },
  loadingOverlay: {
    width: '100%',
    paddingVertical: 8,
    alignItems: 'center',
  },
  errorBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FEF2F2',
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    gap: 6,
  },
  errorText: {
    color: '#B91C1C',
    fontSize: 12,
    fontFamily: 'Urbanist_400Regular',
    flex: 1,
  },
});
