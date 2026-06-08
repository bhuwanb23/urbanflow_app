import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import profileTheme from '../theme/profileTheme';

export default function SettingsCard({ title, settings, onSettingPress, theme: propTheme }) {
  const t = propTheme || profileTheme;
  const s = makeStyles(t);

  return (
    <View style={s.sectionWrap}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'spring', damping: 12, delay: 400 }}
      >
        <Text style={s.sectionTitle}>{title}</Text>
      </MotiView>
      
      <View style={s.settingsCardWrap}>
        <View style={s.settingsCard}>
          {settings.map((setting, index) => (
            <MotiView
              key={setting.label}
              from={{ opacity: 0, translateX: -30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ 
                type: 'spring',
                damping: 12,
                delay: 600 + index * 100 
              }}
              style={{ width: '100%' }}
            >
              <TouchableOpacity 
                style={[s.settingItem, index !== settings.length - 1 && s.settingItemBorder]}
                onPress={() => onSettingPress(setting)}
                activeOpacity={0.6}
              >
                <MotiView
                  from={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ 
                    type: 'spring',
                    damping: 15,
                    delay: 700 + index * 100
                  }}
                >
                  <View style={s.settingLeft}>
                    <View style={[s.settingIconWrap, { backgroundColor: setting.bg }]}>
                      <Icon name={setting.icon} size={20} color={setting.color[0]} />
                    </View>
                    <Text style={s.settingLabel}>{setting.label}</Text>
                  </View>
                </MotiView>
                <MotiView
                  from={{ opacity: 0, scale: 0.5 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ 
                    type: 'spring',
                    damping: 12,
                    delay: 800 + index * 100
                  }}
                >
                  <Icon name="chevron-right" size={20} color={t.colors.textTertiary} />
                </MotiView>
              </TouchableOpacity>
            </MotiView>
          ))}
        </View>
      </View>
    </View>
  );
}

const makeStyles = (t) => StyleSheet.create({
  sectionWrap: {
    marginTop: t.spacing.lg,
  },
  sectionTitle: {
    fontSize: t.typography.fontSize['xl'],
    fontWeight: t.typography.fontWeight.bold,
    color: t.colors.textPrimary,
    fontFamily: t.typography.fontFamily.primary,
    marginBottom: t.spacing.md,
    letterSpacing: -0.5,
  },
  settingsCardWrap: {
    marginBottom: t.spacing.sm,
  },
  settingsCard: {
    borderRadius: t.borderRadius['2xl'],
    backgroundColor: t.colors.surface,
    borderWidth: 1,
    borderColor: t.colors.borderLight,
    overflow: 'hidden',
    ...t.shadows.sm,
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: t.spacing.lg,
    paddingHorizontal: t.spacing.xl,
    backgroundColor: 'transparent',
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: t.colors.borderLight,
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
    marginRight: t.spacing.md,
  },
  settingLabel: {
    fontSize: t.typography.fontSize.base,
    color: t.colors.textPrimary,
    fontFamily: 'Urbanist_600SemiBold',
  },
});
