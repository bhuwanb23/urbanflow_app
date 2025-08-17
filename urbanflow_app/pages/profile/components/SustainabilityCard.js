import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
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
        <Card style={styles.sustainCard}>
          {sustainabilityData.map((item, index) => (
            <MotiView
              key={item.label}
              from={{ opacity: 0, translateY: 30, scale: 0.9 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: 'spring', duration: profileTheme.animation.duration.slower, delay: 800 + index * 150 }}
            >
              <View style={styles.sustainItem}>
                <LinearGradient colors={item.color} style={styles.sustainIconWrap}>
                  <Icon name={item.icon} size={24} color={profileTheme.colors.textInverse} />
                </LinearGradient>
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
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrap: {
    marginTop: profileTheme.spacing.lg,
  },
  sectionTitle: {
    fontSize: profileTheme.typography.fontSize['2xl'],
    fontWeight: profileTheme.typography.fontWeight.bold,
    color: profileTheme.colors.primary,
    fontFamily: profileTheme.typography.fontFamily.primary,
    marginBottom: profileTheme.spacing.md,
  },
  sustainCardWrap: {
    borderRadius: profileTheme.borderRadius['2xl'],
    marginBottom: profileTheme.spacing.sm,
    ...profileTheme.shadows.md,
  },
  sustainCard: {
    borderRadius: profileTheme.borderRadius['2xl'],
    backgroundColor: profileTheme.colors.surface,
    overflow: 'hidden',
  },
  sustainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: profileTheme.spacing.lg,
    paddingHorizontal: profileTheme.spacing.xl,
    backgroundColor: 'transparent',
  },
  sustainIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: profileTheme.spacing.md,
  },
  sustainInfo: {
    flex: 1,
  },
  sustainLabel: {
    fontSize: profileTheme.typography.fontSize.lg,
    color: profileTheme.colors.textPrimary,
    fontWeight: profileTheme.typography.fontWeight.semibold,
    fontFamily: profileTheme.typography.fontFamily.secondary,
  },
  sustainValue: {
    fontSize: profileTheme.typography.fontSize['2xl'],
    fontWeight: profileTheme.typography.fontWeight.bold,
    color: profileTheme.colors.textPrimary,
    fontFamily: profileTheme.typography.fontFamily.primary,
    marginTop: profileTheme.spacing.xs,
  },
  sustainStats: {
    alignItems: 'flex-end',
  },
  sustainPercent: {
    fontSize: profileTheme.typography.fontSize['2xl'],
    fontWeight: profileTheme.typography.fontWeight.bold,
    fontFamily: profileTheme.typography.fontFamily.primary,
  },
  sustainMonth: {
    fontSize: profileTheme.typography.fontSize.sm,
    color: profileTheme.colors.textSecondary,
    fontFamily: profileTheme.typography.fontFamily.secondary,
    marginTop: profileTheme.spacing.xs,
  },
});
