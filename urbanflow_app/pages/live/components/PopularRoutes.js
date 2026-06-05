import React, { useMemo } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { ProgressBar } from 'react-native-paper';
import { MotiView } from 'moti';
import { usePopularRoutes } from '../../../hooks/usePopularRoutes';

const STATUS_STYLES = {
  'HEAVY': { color: '#ef4444', barColor: '#ef4444', label: 'Heavy traffic' },
  'MODERATE': { color: '#facc15', barColor: '#facc15', label: 'Moderate traffic' },
  'LIGHT': { color: '#22c55e', barColor: '#22c55e', label: 'Light traffic' },
  'UNKNOWN': { color: '#94a3b8', barColor: '#94a3b8', label: 'No data' },
};

const POI_ICONS = {
  HOME: { icon: 'home', color: '#6366f1' },
  WORK: { icon: 'briefcase', color: '#10b981' },
  SCHOOL: { icon: 'school', color: '#10b981' },
  RESTAURANT: { icon: 'silverware-fork-knife', color: '#f59e42' },
  GYM: { icon: 'dumbbell', color: '#f43f5e' },
  SHOPPING: { icon: 'shopping', color: '#0ea5e9' },
  DEFAULT: { icon: 'map-marker', color: '#6366f1' },
};

const mapStatusKey = (status) => {
  if (!status) return 'UNKNOWN';
  const upper = String(status).toUpperCase();
  if (upper.includes('HEAVY') || upper.includes('HIGH')) return 'HEAVY';
  if (upper.includes('MODERATE') || upper.includes('MEDIUM')) return 'MODERATE';
  if (upper.includes('LIGHT') || upper.includes('LOW')) return 'LIGHT';
  return 'UNKNOWN';
};

const mapPoi = (name = '') => {
  const upper = name.toUpperCase();
  for (const key of Object.keys(POI_ICONS)) {
    if (key !== 'DEFAULT' && upper.includes(key)) return POI_ICONS[key];
  }
  return POI_ICONS.DEFAULT;
};

const computeProgress = (current, usual) => {
  if (!current || !usual) return 0;
  const ratio = current / usual;
  if (ratio <= 1) return Math.max(0.05, ratio);
  return Math.min(1, 0.6 + (ratio - 1) * 0.4);
};

export default function PopularRoutes({ data: propData, limit = 3, onItemPress }) {
  const shouldFetch = !propData;
  const { routes, loading, error, hasData } = usePopularRoutes(
    shouldFetch ? { refreshInterval: 300000 } : { enabled: false }
  );

  const sourceData = propData || routes;

  const items = useMemo(() => {
    const list = sourceData || [];
    if (list.length === 0) {
      return [
        {
          id: 'placeholder-0',
          from: 'Home',
          to: 'Work',
          fromIcon: POI_ICONS.HOME.icon,
          fromColor: POI_ICONS.HOME.color,
          toIcon: POI_ICONS.WORK.icon,
          toColor: POI_ICONS.WORK.color,
          time: '—',
          progress: 0,
          usual: '—',
          status: 'No data',
          statusColor: STATUS_STYLES.UNKNOWN.color,
          barColor: STATUS_STYLES.UNKNOWN.barColor,
        },
      ];
    }

    return list.slice(0, limit).map((r, idx) => {
      const fromPoi = mapPoi(r.origin || r.from || '');
      const toPoi = mapPoi(r.destination || r.to || '');
      const statusKey = mapStatusKey(r.trafficStatus || r.status);
      const style = STATUS_STYLES[statusKey] || STATUS_STYLES.UNKNOWN;
      const current = r.durationMinutes ?? r.time ?? r.duration;
      const usual = r.usualDurationMinutes ?? r.usual;
      return {
        id: r.id || `route-${idx}`,
        from: r.origin || r.from || 'Origin',
        fromIcon: fromPoi.icon,
        fromColor: fromPoi.color,
        to: r.destination || r.to || 'Destination',
        toIcon: toPoi.icon,
        toColor: toPoi.color,
        time: current ? `${current} min` : '—',
        progress: computeProgress(current, usual),
        usual: usual ? `${usual} min` : '—',
        status: r.trafficStatus || style.label,
        statusColor: style.color,
        barColor: style.barColor,
      };
    });
  }, [sourceData, limit]);

  const handlePress = (item) => {
    if (onItemPress) onItemPress(item);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>Popular Routes</Text>
      {loading && !hasData ? (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="small" color="#6366f1" />
          <Text style={styles.loadingText}>Loading popular routes…</Text>
        </View>
      ) : (
        items.map((r, i) => (
          <MotiView
            key={r.id}
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', delay: 600 + i * 100 }}
          >
            <TouchableOpacity
              style={styles.popularCard}
              onPress={() => handlePress(r)}
              activeOpacity={0.7}
            >
              <View style={styles.popularHeader}>
                <View style={styles.popularRouteRow}>
                  <View style={styles.routePoint}>
                    <Icon name={r.fromIcon} size={20} color={r.fromColor} />
                    <Text style={[styles.popularRouteText, { color: r.fromColor }]}>
                      {r.from}
                    </Text>
                  </View>
                  <Text style={styles.popularArrow}>→</Text>
                  <View style={styles.routePoint}>
                    <Icon name={r.toIcon} size={20} color={r.toColor} />
                    <Text style={[styles.popularRouteText, { color: r.toColor }]}>
                      {r.to}
                    </Text>
                  </View>
                </View>
                <Text style={styles.popularTime}>{r.time}</Text>
              </View>

              <ProgressBar
                progress={r.progress}
                color={r.barColor}
                style={styles.popularBar}
              />

              <View style={styles.popularMetaRow}>
                <Text style={styles.popularUsual}>Usual: {r.usual}</Text>
                <View style={styles.statusContainer}>
                  <Text style={[styles.popularStatus, { color: r.statusColor }]}>
                    {r.status}
                  </Text>
                </View>
              </View>
            </TouchableOpacity>
          </MotiView>
        ))
      )}
      {error && (
        <Text style={styles.errorText}>Couldn’t load popular routes: {error}</Text>
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
  popularCard: {
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
  popularHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  popularRouteRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  routePoint: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 4,
  },
  popularRouteText: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
    marginLeft: 6,
  },
  popularArrow: {
    color: '#9ca3af',
    fontSize: 17,
    marginHorizontal: 8,
  },
  popularTime: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6366f1',
    fontFamily: 'Poppins_700Bold',
  },
  popularBar: {
    height: 8,
    borderRadius: 4,
    marginVertical: 8,
    backgroundColor: '#f3f4f6',
  },
  popularMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 4,
  },
  popularUsual: {
    fontSize: 13,
    color: '#9ca3af',
    fontFamily: 'Urbanist_400Regular',
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  popularStatus: {
    fontSize: 13,
    fontWeight: 'bold',
    fontFamily: 'Poppins_700Bold',
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
