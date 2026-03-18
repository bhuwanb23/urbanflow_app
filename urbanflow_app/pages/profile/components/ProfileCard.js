import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import profileTheme from '../theme/profileTheme';

export default function ProfileCard({ profile, onEditProfile, onEditAvatar }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 30, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'spring', duration: profileTheme.animation.duration.slower, delay: 200 }}
      style={styles.profileCardWrap}
    >
      <View style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <MotiView
            from={{ scale: 0, rotate: '-180deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            transition={{ type: 'spring', delay: 400, duration: profileTheme.animation.duration.slower }}
            style={styles.avatarWrap}
          >
            <View style={styles.avatarPlaceholder}>
              <Icon name="account" size={48} color={profileTheme.colors.primary} />
            </View>
            <TouchableOpacity onPress={onEditAvatar} style={styles.avatarEditBtn}>
              <Icon name="camera" size={14} color={profileTheme.colors.textInverse} />
            </TouchableOpacity>
          </MotiView>
          
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: profileTheme.animation.duration.slower, delay: 600 }}
          >
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </MotiView>
          
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 800 }}
          >
            <TouchableOpacity onPress={onEditProfile} style={styles.editProfileBtn}>
              <Icon name="pencil" size={16} color={profileTheme.colors.primary} style={{ marginRight: 6 }} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  profileCardWrap: {
    marginBottom: profileTheme.spacing.lg,
  },
  profileCard: {
    borderRadius: profileTheme.borderRadius['3xl'],
    backgroundColor: profileTheme.colors.surface,
    padding: profileTheme.spacing.xl,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: profileTheme.colors.borderLight,
    ...profileTheme.shadows.md,
  },
  profileInfo: {
    alignItems: 'center',
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: profileTheme.spacing.md,
  },
  avatarPlaceholder: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: profileTheme.colors.surface,
    backgroundColor: '#ECFDF5', // Emerald 50
    alignItems: 'center',
    justifyContent: 'center',
    ...profileTheme.shadows.md,
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: profileTheme.colors.primary,
    borderWidth: 3,
    borderColor: profileTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...profileTheme.shadows.sm,
  },
  profileName: {
    fontSize: profileTheme.typography.fontSize['2xl'],
    color: profileTheme.colors.textPrimary,
    marginBottom: profileTheme.spacing.xs,
    fontFamily: profileTheme.typography.fontFamily.primary,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: profileTheme.typography.fontSize.base,
    color: profileTheme.colors.textSecondary,
    marginBottom: profileTheme.spacing.lg,
    fontFamily: profileTheme.typography.fontFamily.secondary,
    textAlign: 'center',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ECFDF5', // Emerald 50
    paddingHorizontal: profileTheme.spacing.lg,
    paddingVertical: profileTheme.spacing.base,
    borderRadius: profileTheme.borderRadius.full,
    borderWidth: 1,
    borderColor: '#A7F3D0', // Emerald 200
  },
  editProfileText: {
    color: profileTheme.colors.primary,
    fontSize: profileTheme.typography.fontSize.base,
    fontFamily: 'Urbanist_700Bold',
  },
});
