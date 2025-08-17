import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
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
      <Card style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <MotiView
            from={{ scale: 0, rotate: '-180deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            transition={{ type: 'spring', delay: 400, duration: profileTheme.animation.duration.slower }}
            style={styles.avatarWrap}
          >
            <Image source={{ uri: profile.avatar }} style={styles.avatarImg} />
            <TouchableOpacity onPress={onEditAvatar} style={styles.avatarEditBtn}>
              <Icon name="camera" size={16} color={profileTheme.colors.textInverse} />
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
              <Icon name="pencil" size={16} color={profileTheme.colors.textInverse} style={{ marginRight: 6 }} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </Card>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  profileCardWrap: {
    marginBottom: profileTheme.spacing.lg,
    borderRadius: profileTheme.borderRadius['3xl'],
    ...profileTheme.shadows.lg,
  },
  profileCard: {
    borderRadius: profileTheme.borderRadius['3xl'],
    backgroundColor: profileTheme.colors.surface,
    padding: profileTheme.spacing.xl,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: profileTheme.spacing.xs,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: profileTheme.spacing.md,
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: profileTheme.colors.surface,
    backgroundColor: profileTheme.colors.surfaceVariant,
    ...profileTheme.shadows.lg,
  },
  avatarEditBtn: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: profileTheme.colors.success,
    borderWidth: 3,
    borderColor: profileTheme.colors.surface,
    alignItems: 'center',
    justifyContent: 'center',
    ...profileTheme.shadows.md,
  },
  profileName: {
    fontSize: profileTheme.typography.fontSize['3xl'],
    fontWeight: profileTheme.typography.fontWeight.bold,
    color: profileTheme.colors.textPrimary,
    marginBottom: profileTheme.spacing.xs,
    fontFamily: profileTheme.typography.fontFamily.primary,
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: profileTheme.typography.fontSize.base,
    color: profileTheme.colors.textSecondary,
    marginBottom: profileTheme.spacing.md,
    fontFamily: profileTheme.typography.fontFamily.secondary,
    textAlign: 'center',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: profileTheme.colors.primary,
    paddingHorizontal: profileTheme.spacing.md,
    paddingVertical: profileTheme.spacing.sm,
    borderRadius: profileTheme.borderRadius.xl,
    ...profileTheme.shadows.primary,
  },
  editProfileText: {
    color: profileTheme.colors.textInverse,
    fontSize: profileTheme.typography.fontSize.base,
    fontWeight: profileTheme.typography.fontWeight.semibold,
    fontFamily: profileTheme.typography.fontFamily.secondary,
  },
});
