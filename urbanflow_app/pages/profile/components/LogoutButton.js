import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import profileTheme from '../theme/profileTheme';

export default function LogoutButton({ onLogout }) {
  const [isPressed, setIsPressed] = useState(false);

  const handleLogoutPress = () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: onLogout,
        },
      ],
      { cancelable: true }
    );
  };

  return (
    <MotiView
      from={{ opacity: 0, translateY: 40, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'spring', duration: profileTheme.animation.duration.slower, delay: 1000 }}
      style={styles.container}
    >
      <TouchableOpacity
        style={[
          styles.logoutBtn,
          isPressed && styles.logoutBtnPressed
        ]}
        onPress={handleLogoutPress}
        onPressIn={() => setIsPressed(true)}
        onPressOut={() => setIsPressed(false)}
        activeOpacity={0.8}
      >
        <Icon name="logout" size={20} color={profileTheme.colors.textInverse} style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: profileTheme.spacing.xl,
    marginBottom: profileTheme.spacing.lg,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: profileTheme.colors.error,
    borderRadius: profileTheme.borderRadius['2xl'],
    paddingVertical: profileTheme.spacing.md,
    ...profileTheme.shadows.md,
  },
  logoutBtnPressed: {
    backgroundColor: '#dc2626',
    transform: [{ scale: 0.98 }],
  },
  logoutText: {
    color: profileTheme.colors.textInverse,
    fontWeight: profileTheme.typography.fontWeight.bold,
    fontFamily: profileTheme.typography.fontFamily.primary,
    fontSize: profileTheme.typography.fontSize.lg,
  },
});
