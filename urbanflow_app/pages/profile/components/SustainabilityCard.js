import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import profileTheme from '../theme/profileTheme';

export default function SustainabilityCard({ title, sustainabilityData }) {
  return (
    <View style={styles.sectionWrap}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: profileTheme.animation.duration.slower, delay: 600 }}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
      </MotiView>
      
      <View style={styles.sustainCardWrap}>
        <View style={styles.sustainCard}>
          {sustainabilityData.map((item, index) => (
            <MotiView
              key={item.label}
              from={{ opacity: 0, translateY: 30, scale: 0.9 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: 'spring', duration: profileTheme.animation.duration.slower, delay: 800 + index * 150 }}
            >
              <View style={[styles.sustainItem, index !== sustainabilityData.length - 1 && styles.sustainItemBorder]}>
                <View style={[styles.sustainIconWrap, { backgroundColor: item.bg }]}>
                  <Icon name={item.icon} size={22} color={item.color[0]} />
                </View>
                <View style={styles.sustainInfo}>
                  <Text style={styles.sustainLabel}>{item.label}</Text>
                  <Text style={styles.sustainValue}>{item.value}</Text>
                </View>
                <View style={styles.sustainStats}>
                  <Text style={[styles.sustainPercent, { color: item.percentColor }]}>
                    {item.percent}
                  </Text>
                  <Text style={styles.sustainMonth}>This month</Text>
                </View>
              </View>
            </MotiView>
          ))}
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrap: {
    marginTop: profileTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: profileTheme.typography.fontSize['xl'],
    fontWeight: profileTheme.typography.fontWeight.bold,
    color: profileTheme.colors.textPrimary,
    fontFamily: profileTheme.typography.fontFamily.primary,
    marginBottom: profileTheme.spacing.md,
    letterSpacing: -0.5,
  },
  sustainCardWrap: {
    marginBottom: profileTheme.spacing.sm,
  },
  sustainCard: {
    borderRadius: profileTheme.borderRadius['2xl'],
    backgroundColor: profileTheme.colors.surface,
    borderWidth: 1,
    borderColor: profileTheme.colors.borderLight,
    overflow: 'hidden',
    ...profileTheme.shadows.sm,
  },
  sustainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: profileTheme.spacing.lg,
    paddingHorizontal: profileTheme.spacing.xl,
    backgroundColor: 'transparent',
  },
  sustainItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: profileTheme.colors.borderLight,
  },
  sustainIconWrap: {
    width: 44,
    height: 44,
    borderRadius: 22,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: profileTheme.spacing.md,
  },
  sustainInfo: {
    flex: 1,
  },
  sustainLabel: {
    fontSize: profileTheme.typography.fontSize.sm,
    color: profileTheme.colors.textSecondary,
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 2,
  },
  sustainValue: {
    fontSize: profileTheme.typography.fontSize.xl,
    fontWeight: profileTheme.typography.fontWeight.bold,
    color: profileTheme.colors.textPrimary,
    fontFamily: profileTheme.typography.fontFamily.primary,
  },
  sustainStats: {
    alignItems: 'flex-end',
  },
  sustainPercent: {
    fontSize: profileTheme.typography.fontSize.base,
    fontWeight: profileTheme.typography.fontWeight.bold,
    fontFamily: profileTheme.typography.fontFamily.primary,
  },
  sustainMonth: {
    fontSize: profileTheme.typography.fontSize.xs,
    color: profileTheme.colors.textTertiary,
    fontFamily: profileTheme.typography.fontFamily.secondary,
    marginTop: 2,
  },
});
