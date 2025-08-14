import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

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
      transition={{ type: 'spring', duration: 1000, delay: 1000 }}
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
        <Icon name="logout" size={20} color="#fff" style={{ marginRight: 8 }} />
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  container: {
    marginTop: 24,
    marginBottom: 18,
  },
  logoutBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ef4444',
    borderRadius: 22,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#ef4444',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  logoutBtnPressed: {
    backgroundColor: '#dc2626',
    transform: [{ scale: 0.98 }],
  },
  logoutText: {
    color: '#fff',
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
    fontSize: 16,
  },
});
