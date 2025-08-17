import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import profileTheme from '../theme/profileTheme';

export default function ProfileHeader({ title, onBack, onMenu, showBack = false }) {
  return (
    <LinearGradient colors={profileTheme.gradients.primary} style={styles.headerGradient}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: profileTheme.animation.duration.slower }}
        style={styles.headerContent}
      >
        <View style={styles.headerLeft}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Icon name="arrow-left" size={20} color={profileTheme.colors.textInverse} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onMenu} style={styles.settingsButton}>
            <Icon name="dots-vertical" size={18} color={profileTheme.colors.textInverse} />
          </TouchableOpacity>
        </View>
      </MotiView>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingTop: profileTheme.spacing['3xl'],
    paddingBottom: profileTheme.spacing.xl,
    paddingHorizontal: profileTheme.spacing.xl,
    borderBottomLeftRadius: profileTheme.borderRadius['2xl'],
    borderBottomRightRadius: profileTheme.borderRadius['2xl'],
    marginBottom: profileTheme.spacing.sm,
    ...profileTheme.shadows.lg,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  headerRight: {
    alignItems: 'center',
  },
  backBtn: {
    marginRight: profileTheme.spacing.md,
    padding: profileTheme.spacing.sm,
  },
  headerTitle: {
    color: profileTheme.colors.textInverse,
    fontSize: profileTheme.typography.fontSize['2xl'],
    fontWeight: profileTheme.typography.fontWeight.bold,
    fontFamily: profileTheme.typography.fontFamily.primary,
  },
  settingsButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
