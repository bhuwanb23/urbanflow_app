import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { useTranslation } from 'react-i18next';

import api from '../../../utils/api';

const MODE_ICONS = {
  walk: 'walk',
  walking: 'walk',
  bike: 'bike',
  bicycle: 'bike',
  cycle: 'bike',
  bus: 'bus',
  metro: 'subway',
  train: 'train',
  car: 'car',
  auto: 'rickshaw',
  taxi: 'taxi',
};

const modeIcon = (mode) => MODE_ICONS[String(mode || '').toLowerCase()] || 'map-marker';

const RecommendationSkeleton = () => (
  <View style={styles.card}>
    <View style={styles.skeletonRow}>
      <View style={styles.skeletonIcon} />
      <View style={{ flex: 1 }}>
        <View style={[styles.skeletonLine, { width: '70%' }]} />
        <View style={[styles.skeletonLine, { width: '90%', marginTop: 8 }]} />
      </View>
    </View>
  </View>
);

export default function RecommendationsCard({ style }) {
  const { t } = useTranslation();
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [recommendations, setRecommendations] = useState([]);
  const [message, setMessage] = useState(null);

  const load = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await api.recommendationsAPI.getRecommendations();
      if (response.success && response.data) {
        setRecommendations(response.data.recommendations || []);
        setMessage(response.data.message || null);
      } else {
        setRecommendations([]);
      }
    } catch (err) {
      console.error('Error loading recommendations:', err);
      setError('Could not load recommendations right now.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const EmptyState = () => (
    <View style={styles.empty}>
      <Icon name="lightbulb-outline" size={28} color="#94a3b8" />
      <Text style={styles.emptyText}>
        {message || t('recommendations.empty', 'No recommendations yet — log a few trips first.')}
      </Text>
    </View>
  );

  return (
    <View style={[styles.container, style]}>
      <View style={styles.header}>
        <View style={styles.headerTitleWrap}>
          <Icon name="sparkles" size={18} color="#6366f1" />
          <Text style={styles.headerTitle}>
            {t('recommendations.title', 'Recommended for you')}
          </Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>
            {t('recommendations.experimental', 'Experimental')}
          </Text>
        </View>
      </View>

      {loading ? (
        <>
          <RecommendationSkeleton />
          <RecommendationSkeleton />
        </>
      ) : error ? (
        <View style={styles.empty}>
          <Icon name="alert-circle-outline" size={28} color="#ef4444" />
          <Text style={styles.emptyText}>{error}</Text>
          <TouchableOpacity style={styles.retryButton} onPress={load}>
            <Text style={styles.retryText}>{t('recommendations.retry', 'Retry')}</Text>
          </TouchableOpacity>
        </View>
      ) : recommendations.length === 0 ? (
        <EmptyState />
      ) : (
        recommendations.map((rec, idx) => (
          <MotiView
            key={rec.id || idx}
            from={{ opacity: 0, translateY: 12 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 400, delay: idx * 80 }}
            style={styles.card}
          >
            <View style={styles.cardIconWrap}>
              <Icon name={modeIcon(rec.mode)} size={22} color="#6366f1" />
            </View>
            <View style={styles.cardBody}>
              <Text style={styles.cardTitle}>{rec.title}</Text>
              <Text style={styles.cardDesc}>{rec.description}</Text>
              <View style={styles.cardFooter}>
                <Text style={styles.reason}>{rec.reason}</Text>
                <View style={styles.confidence}>
                  <Text style={styles.confidenceText}>
                    {Math.round((rec.confidence || 0) * 100)}%
                  </Text>
                </View>
              </View>
            </View>
          </MotiView>
        ))
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginVertical: 8,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 12,
  },
  headerTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#0f172a',
    marginLeft: 8,
  },
  badge: {
    backgroundColor: '#EEF2FF',
    borderRadius: 999,
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#6366f1',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 1,
  },
  cardIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EEF2FF',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  cardBody: {
    flex: 1,
  },
  cardTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#0f172a',
  },
  cardDesc: {
    fontSize: 13,
    color: '#475569',
    marginTop: 2,
    lineHeight: 18,
  },
  cardFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 8,
  },
  reason: {
    flex: 1,
    fontSize: 11,
    color: '#94a3b8',
    fontStyle: 'italic',
  },
  confidence: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    paddingVertical: 2,
    paddingHorizontal: 8,
    marginLeft: 8,
  },
  confidenceText: {
    fontSize: 11,
    fontWeight: '700',
    color: '#10B981',
  },
  empty: {
    alignItems: 'center',
    paddingVertical: 16,
  },
  emptyText: {
    fontSize: 13,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 8,
    paddingHorizontal: 8,
  },
  retryButton: {
    marginTop: 10,
    paddingVertical: 6,
    paddingHorizontal: 16,
    borderRadius: 10,
    backgroundColor: '#6366f1',
  },
  retryText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: '600',
  },
  skeletonRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  skeletonIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#E2E8F0',
    marginRight: 12,
  },
  skeletonLine: {
    height: 12,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
  },
});
