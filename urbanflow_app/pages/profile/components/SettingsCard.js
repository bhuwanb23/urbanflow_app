import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import profileTheme from '../theme/profileTheme';

export default function SettingsCard({ title, settings, onSettingPress }) {
  return (
    <View style={styles.sectionWrap}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: profileTheme.animation.duration.slower, delay: 400 }}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
      </MotiView>
      
      <View style={styles.settingsCardWrap}>
        <Card style={styles.settingsCard}>
          {settings.map((setting, index) => (
            <MotiView
              key={setting.label}
              from={{ opacity: 0, translateX: -30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 600 + index * 100 }}
            >
              <TouchableOpacity 
                style={[styles.settingItem, index !== settings.length - 1 && styles.settingItemBorder]}
                onPress={() => onSettingPress(setting)}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <LinearGradient colors={setting.color} style={styles.settingIconWrap}>
                    <Icon name={setting.icon} size={22} color={profileTheme.colors.textInverse} />
                  </LinearGradient>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                </View>
                <Icon name="chevron-right" size={22} color={profileTheme.colors.textTertiary} />
              </TouchableOpacity>
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
  settingsCardWrap: {
    borderRadius: profileTheme.borderRadius['2xl'],
    marginBottom: profileTheme.spacing.sm,
    ...profileTheme.shadows.md,
  },
  settingsCard: {
    borderRadius: profileTheme.borderRadius['2xl'],
    backgroundColor: profileTheme.colors.surface,
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: profileTheme.spacing.lg,
    paddingHorizontal: profileTheme.spacing.xl,
    backgroundColor: 'transparent',
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: profileTheme.colors.borderLight,
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: profileTheme.spacing.md,
  },
  settingLabel: {
    fontSize: profileTheme.typography.fontSize.lg,
    color: profileTheme.colors.textPrimary,
    fontFamily: profileTheme.typography.fontFamily.secondary,
    fontWeight: profileTheme.typography.fontWeight.medium,
  },
});
