import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import notificationTheme from '../theme/notificationTheme';

const NotificationHeader = ({ 
  navigation, 
  onFilterPress, 
  stats,
  showStats = true 
}) => {
  const handleBack = () => {
    navigation.goBack();
  };

  return (
    <LinearGradient 
      colors={notificationTheme.gradients.primary}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      style={styles.headerGradient}
    >
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={handleBack} style={styles.backButton}>
            <Icon name="arrow-left" size={22} color={notificationTheme.colors.textInverse} />
          </TouchableOpacity>
          <View style={styles.titleContainer}>
            <Text style={styles.headerTitle}>Notifications</Text>
            <Text style={styles.headerSubtitle}>Stay updated with your journey</Text>
          </View>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onFilterPress} style={styles.headerButton}>
            <Icon name="filter-variant" size={18} color={notificationTheme.colors.textInverse} />
          </TouchableOpacity>
        </View>
      </View>

      {showStats && (
        <View style={styles.statsContainer}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.total}</Text>
            <Text style={styles.statLabel}>Total</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.unread}</Text>
            <Text style={styles.statLabel}>Unread</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.important}</Text>
            <Text style={styles.statLabel}>Important</Text>
          </View>
          <View style={styles.statDivider} />
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>{stats.today}</Text>
            <Text style={styles.statLabel}>Today</Text>
          </View>
        </View>
      )}
    </LinearGradient>
  );
};

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: notificationTheme.spacing['3xl'],
    paddingBottom: notificationTheme.spacing.xl,
    paddingHorizontal: notificationTheme.spacing.xl,
    borderBottomLeftRadius: notificationTheme.borderRadius['2xl'],
    borderBottomRightRadius: notificationTheme.borderRadius['2xl'],
    ...notificationTheme.shadows.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: notificationTheme.spacing.md,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  backButton: {
    padding: notificationTheme.spacing.sm,
    marginRight: notificationTheme.spacing.md,
    borderRadius: notificationTheme.borderRadius.base,
    backgroundColor: 'rgba(255,255,255,0.15)',
    ...notificationTheme.shadows.sm,
  },
  titleContainer: {
    flex: 1,
  },
  headerTitle: {
    fontSize: notificationTheme.typography.fontSize['2xl'],
    fontWeight: notificationTheme.typography.fontWeight.bold,
    color: notificationTheme.colors.textInverse,
    fontFamily: notificationTheme.typography.fontFamily.primary,
    marginBottom: notificationTheme.spacing.xs,
  },
  headerSubtitle: {
    fontSize: notificationTheme.typography.fontSize.sm,
    color: 'rgba(255,255,255,0.85)',
    fontFamily: notificationTheme.typography.fontFamily.secondary,
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    padding: notificationTheme.spacing.sm,
    marginLeft: notificationTheme.spacing.sm,
    borderRadius: notificationTheme.borderRadius.base,
    backgroundColor: 'rgba(255,255,255,0.15)',
    ...notificationTheme.shadows.sm,
  },
  statsContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: notificationTheme.borderRadius.md,
    paddingVertical: notificationTheme.spacing.md,
    paddingHorizontal: notificationTheme.spacing.lg,
    marginTop: notificationTheme.spacing.sm,
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },
  statNumber: {
    fontSize: notificationTheme.typography.fontSize.xl,
    fontWeight: notificationTheme.typography.fontWeight.bold,
    color: notificationTheme.colors.textInverse,
    fontFamily: notificationTheme.typography.fontFamily.primary,
    marginBottom: notificationTheme.spacing.xs,
  },
  statLabel: {
    fontSize: notificationTheme.typography.fontSize.xs,
    color: 'rgba(255,255,255,0.8)',
    fontFamily: notificationTheme.typography.fontFamily.secondary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statDivider: {
    width: 1,
    height: 24,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});

export default NotificationHeader;
