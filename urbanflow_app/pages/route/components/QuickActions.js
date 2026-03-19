import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { routeTheme } from '../styles/routeTheme';

export default function QuickActions() {
  return (
    <MotiView from={{ opacity: 0, translateY: 40 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 1000 }}>
      <View style={styles.actionContainer}>
        <TouchableOpacity style={styles.saveButton}>
          <Icon name="heart-outline" size={24} color={routeTheme.colors.primary} />
        </TouchableOpacity>
        <TouchableOpacity style={styles.startButton}>
          <LinearGradient
            colors={[routeTheme.colors.primary, routeTheme.colors.primaryDark]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={styles.startButtonGradient}
          >
            <Text style={styles.startButtonText}>Start Journey</Text>
            <Icon name="navigation" size={20} color="#fff" style={styles.startIcon} />
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  actionContainer: {
    flexDirection: 'row',
    gap: 16,
    marginTop: 10,
  },
  saveButton: {
    width: 56,
    height: 56,
    borderRadius: 16,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  startButton: {
    flex: 1,
    height: 56,
    borderRadius: 16,
    overflow: 'hidden',
    elevation: 4,
    shadowColor: routeTheme.colors.primary,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
  },
  startButtonGradient: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  startButtonText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
  },
  startIcon: {
    marginLeft: 8,
  },
});
