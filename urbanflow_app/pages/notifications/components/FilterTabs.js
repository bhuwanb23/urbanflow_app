import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { MotiView } from 'moti';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import notificationTheme from '../theme/notificationTheme';

const FilterTabs = ({ 
  activeFilter, 
  onFilterChange, 
  filters = ['All', 'Unread', 'Important', 'Today'] 
}) => {
  return (
    <MotiView 
      from={{ opacity: 0, translateY: -20 }} 
      animate={{ opacity: 1, translateY: 0 }} 
      transition={{ type: 'timing', duration: 600 }}
      style={styles.tabsContainer}
    >
      <View style={styles.tabsWrapper}>
        {filters.map((filter, index) => {
          const isActive = activeFilter === filter.toLowerCase();
          return (
            <TouchableOpacity
              key={filter}
              style={[styles.tab, isActive && styles.tabActive]}
              onPress={() => onFilterChange(filter.toLowerCase())}
              activeOpacity={0.7}
            >
              <Text style={[styles.tabText, isActive && styles.tabTextActive]}>
                {filter}
              </Text>
              {isActive && (
                <MotiView 
                  from={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ type: 'spring', damping: 15, stiffness: 200 }}
                  style={styles.tabIndicator}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </MotiView>
  );
};

const styles = StyleSheet.create({
  tabsContainer: {
    backgroundColor: notificationTheme.colors.surface,
    paddingHorizontal: notificationTheme.spacing.lg,
    paddingVertical: notificationTheme.spacing.md,
    marginBottom: notificationTheme.spacing.md,
    marginHorizontal: notificationTheme.spacing.lg,
    borderRadius: notificationTheme.borderRadius.lg,
    borderWidth: 1,
    borderColor: notificationTheme.colors.borderLight,
    ...notificationTheme.shadows.md,
  },
  tabsWrapper: {
    flexDirection: 'row',
    backgroundColor: notificationTheme.colors.surfaceVariant,
    borderRadius: notificationTheme.borderRadius.base,
    padding: 3,
  },
  tab: {
    flex: 1,
    paddingVertical: notificationTheme.spacing.sm,
    paddingHorizontal: notificationTheme.spacing.md,
    borderRadius: notificationTheme.borderRadius.base,
    alignItems: 'center',
    position: 'relative',
  },
  tabActive: {
    backgroundColor: notificationTheme.colors.surface,
    ...notificationTheme.shadows.sm,
  },
  tabIndicator: {
    position: 'absolute',
    bottom: -3,
    left: '50%',
    marginLeft: -6,
    width: 12,
    height: 2,
    backgroundColor: notificationTheme.colors.primary,
    borderRadius: 1,
  },
  tabText: {
    fontSize: notificationTheme.typography.fontSize.sm,
    fontWeight: notificationTheme.typography.fontWeight.medium,
    color: notificationTheme.colors.textSecondary,
    fontFamily: notificationTheme.typography.fontFamily.secondary,
  },
  tabTextActive: {
    color: notificationTheme.colors.primary,
    fontFamily: notificationTheme.typography.fontFamily.primary,
    fontWeight: notificationTheme.typography.fontWeight.bold,
  },
});

export default FilterTabs;
