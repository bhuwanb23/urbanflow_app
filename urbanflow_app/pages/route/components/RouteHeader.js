import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

export default function RouteHeader({ onBack, onMenu }) {
  const insets = useSafeAreaInsets();
  
  return (
    <LinearGradient colors={["#6366f1", "#8b5cf6"]} style={[styles.headerGradient, { paddingTop: insets.top + 16 }]}>
      <View style={styles.headerRow}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={onBack} style={styles.backButton}>
            <Icon name="arrow-left" size={24} color="#fff" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Route Details</Text>
        </View>
        <TouchableOpacity style={styles.headerButton} onPress={onMenu}>
          <Icon name="dots-vertical" size={20} color="#fff" />
        </TouchableOpacity>
      </View>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  headerGradient: {
    paddingBottom: 24,
    paddingHorizontal: 24,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    elevation: 6,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 16,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    padding: 8,
    marginRight: 12,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#fff',
    fontFamily: 'Poppins_700Bold',
  },
  headerButton: {
    padding: 8,
    borderRadius: 12,
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
});
