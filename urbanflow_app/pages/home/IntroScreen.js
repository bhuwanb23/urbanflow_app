import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Platform, TouchableOpacity } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default function IntroScreen({ navigation }) {

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000 }}
          style={styles.logoWrapper}
        >
          <View style={styles.iconContainer}>
            <Icon name="leaf" size={48} color="#10B981" />
          </View>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000, delay: 200 }}
          style={styles.textContainer}
        >
          <Text style={styles.title}>UrbanFlow</Text>
          <Text style={styles.subtitle}>Smart Mobility.</Text>
          <Text style={styles.subtitleGreener}>Zero Compromise.</Text>
          
          <Text style={styles.description}>
            Navigate your city efficiently while reducing your carbon footprint. Intelligent routing for the modern commuter.
          </Text>
        </MotiView>
      </View>

      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 1000, delay: 400 }}
        style={styles.footer}
      >
        <TouchableOpacity
          style={styles.primaryButton}
          activeOpacity={0.8}
          onPress={() => navigation.replace('Login')}
        >
          <Text style={styles.buttonText}>Get Started</Text>
          <Icon name="arrow-right" size={20} color="#0B0F19" style={styles.buttonIcon} />
        </TouchableOpacity>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
    justifyContent: 'space-between',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    paddingHorizontal: 32,
  },
  logoWrapper: {
    marginBottom: 40,
  },
  iconContainer: {
    width: 80,
    height: 80,
    borderRadius: 24,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: '#10B981',
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 40,
    color: '#F8FAFC',
    fontFamily: 'Poppins_700Bold',
    lineHeight: 48,
  },
  subtitleGreener: {
    fontSize: 40,
    color: '#94A3B8',
    fontFamily: 'Poppins_700Bold',
    lineHeight: 48,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'Urbanist_400Regular',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
  },
  primaryButton: {
    backgroundColor: '#10B981',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
  },
  buttonText: {
    color: '#0B0F19',
    fontSize: 18,
    fontFamily: 'Urbanist_700Bold',
  },
  buttonIcon: {
    marginLeft: 8,
  }
}); 