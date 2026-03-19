import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import profileTheme from '../theme/profileTheme';

export default function ProfileHeader({ title, onBack, onMenu, showBack = false }) {
  return (
    <View style={styles.headerContainer}>
      <MotiView
        from={{ opacity: 0, translateY: -20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: profileTheme.animation.duration.slower }}
        style={styles.headerContent}
      >
        <View style={styles.headerLeft}>
          {showBack && (
            <TouchableOpacity onPress={onBack} style={styles.backBtn}>
              <Icon name="arrow-left" size={24} color={profileTheme.colors.textPrimary} />
            </TouchableOpacity>
          )}
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.headerRight}>
          <TouchableOpacity onPress={onMenu} style={styles.settingsButton}>
            <Icon name="dots-vertical" size={20} color={profileTheme.colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  headerContainer: {
    paddingTop: Platform.OS === 'android' ? 20 : 20,
    paddingBottom: 20,
    paddingHorizontal: 24,
    backgroundColor: profileTheme.colors.surface,
    borderBottomWidth: 1,
    borderBottomColor: profileTheme.colors.borderLight,
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
    padding: profileTheme.spacing.xs,
  },
  headerTitle: {
    color: profileTheme.colors.textPrimary,
    fontSize: 24,
    fontFamily: profileTheme.typography.fontFamily.primary,
    letterSpacing: -0.5,
  },
  settingsButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: profileTheme.colors.surfaceVariant,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: profileTheme.colors.border,
  },
});
