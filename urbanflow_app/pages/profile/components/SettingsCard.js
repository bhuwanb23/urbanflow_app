import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
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
        <View style={styles.settingsCard}>
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
                  <View style={[styles.settingIconWrap, { backgroundColor: setting.bg }]}>
                    <Icon name={setting.icon} size={20} color={setting.color[0]} />
                  </View>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                </View>
                <Icon name="chevron-right" size={20} color={profileTheme.colors.textTertiary} />
              </TouchableOpacity>
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
  settingsCardWrap: {
    marginBottom: profileTheme.spacing.sm,
  },
  settingsCard: {
    borderRadius: profileTheme.borderRadius['2xl'],
    backgroundColor: profileTheme.colors.surface,
    borderWidth: 1,
    borderColor: profileTheme.colors.borderLight,
    overflow: 'hidden',
    ...profileTheme.shadows.sm,
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
    fontSize: profileTheme.typography.fontSize.base,
    color: profileTheme.colors.textPrimary,
    fontFamily: 'Urbanist_600SemiBold',
  },
});
