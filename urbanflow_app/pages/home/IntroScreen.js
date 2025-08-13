import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Text, Dimensions, Platform, Image, Animated } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiImage } from 'moti';
import { BlurView } from 'expo-blur';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

const { width, height } = Dimensions.get('window');

export default function IntroScreen({ navigation }) {
  const [fadeAnim] = useState(new Animated.Value(0));
  const [scaleAnim] = useState(new Animated.Value(0.8));

  useEffect(() => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1500,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const floatingIcons = [
    { icon: 'train', delay: 0, position: { top: '15%', left: '10%' } },
    { icon: 'bus', delay: 200, position: { top: '25%', right: '15%' } },
    { icon: 'bike', delay: 400, position: { top: '45%', left: '5%' } },
    { icon: 'walk', delay: 600, position: { top: '55%', right: '10%' } },
    { icon: 'map-marker', delay: 800, position: { top: '75%', left: '20%' } },
    { icon: 'leaf', delay: 1000, position: { top: '85%', right: '25%' } },
  ];

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#43cea2", "#185a9d", "#6a11cb", "#2575fc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      {/* Animated background pattern */}
      <Animated.View style={[styles.backgroundPattern, { opacity: fadeAnim }]}>
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.patternGradient}
        />
      </Animated.View>

      {/* Floating transportation icons */}
      {floatingIcons.map((item, index) => (
        <MotiView
          key={index}
          from={{ opacity: 0, scale: 0, translateY: 50 }}
          animate={{ opacity: 0.3, scale: 1, translateY: 0 }}
          transition={{ 
            type: 'spring', 
            delay: item.delay, 
            duration: 2000,
            loop: true,
            repeatReverse: true
          }}
          style={[styles.floatingIcon, item.position]}
        >
          <BlurView intensity={20} tint="light" style={styles.iconBlur}>
            <Icon name={item.icon} size={24} color="rgba(255,255,255,0.8)" />
          </BlurView>
        </MotiView>
      ))}

      <View style={styles.centered}>
        {/* Enhanced logo with multiple animations */}
        <MotiView
          from={{ scale: 0.5, rotate: '-10deg' }}
          animate={{ scale: 1, rotate: '0deg' }}
          transition={{ 
            type: 'spring', 
            delay: 300, 
            duration: 1000,
            loop: true,
            repeatReverse: true
          }}
          style={styles.logoContainer}
        >
          <LinearGradient
            colors={["rgba(255,255,255,0.2)", "rgba(255,255,255,0.1)"]}
            style={styles.logoGlow}
          />
          <MotiImage
            source={require('../../assets/icon.png')}
            style={styles.logo}
            from={{ scale: 0.7, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', delay: 500, duration: 1200 }}
            resizeMode="contain"
          />
        </MotiView>

        {/* Enhanced tagline with staggered animation */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000, delay: 800 }}
        >
          <Text style={styles.tagline}>Move Smarter.</Text>
        </MotiView>
        
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 1000, delay: 1000 }}
        >
          <Text style={styles.taglineSecondary}>Live Greener.</Text>
        </MotiView>

        {/* Feature highlights */}
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 1200 }}
          style={styles.featuresContainer}
        >
          <View style={styles.featureRow}>
            <View style={styles.featureItem}>
              <Icon name="leaf" size={20} color="#4ade80" />
              <Text style={styles.featureText}>Eco-Friendly</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="lightning-bolt" size={20} color="#fbbf24" />
              <Text style={styles.featureText}>Fast Routes</Text>
            </View>
            <View style={styles.featureItem}>
              <Icon name="shield-check" size={20} color="#60a5fa" />
              <Text style={styles.featureText}>Safe Travel</Text>
            </View>
          </View>
        </MotiView>
      </View>

      {/* Enhanced button with animations */}
      <MotiView
        from={{ opacity: 0, translateY: 40, scale: 0.8 }}
        animate={{ opacity: 1, translateY: 0, scale: 1 }}
        transition={{ type: 'spring', duration: 1000, delay: 1400 }}
        style={styles.buttonContainer}
      >
        <BlurView intensity={40} tint="light" style={styles.buttonBlur}>
          <Button
            mode="contained"
            style={styles.getStartedBtn}
            labelStyle={styles.buttonLabel}
            onPress={() => navigation.replace('Login')}
            icon={({ size, color }) => (
              <Icon name="arrow-right" size={size} color={color} />
            )}
          >
            Get Started
          </Button>
        </BlurView>
      </MotiView>

      {/* Bottom wave decoration */}
      <MotiView
        from={{ translateY: 100, opacity: 0 }}
        animate={{ translateY: 0, opacity: 1 }}
        transition={{ type: 'timing', duration: 1200, delay: 1600 }}
        style={styles.waveContainer}
      >
        <LinearGradient
          colors={['rgba(255,255,255,0.1)', 'rgba(255,255,255,0.05)']}
          style={styles.wave}
        />
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  backgroundPattern: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    zIndex: 1,
  },
  patternGradient: {
    flex: 1,
  },
  floatingIcon: {
    position: 'absolute',
    zIndex: 2,
  },
  iconBlur: {
    width: 50,
    height: 50,
    borderRadius: 25,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 3,
    paddingHorizontal: 20,
  },
  logoContainer: {
    position: 'relative',
    marginBottom: 40,
  },
  logoGlow: {
    position: 'absolute',
    width: width * 0.5,
    height: width * 0.5,
    borderRadius: width * 0.25,
    top: -20,
    left: -20,
  },
  logo: {
    width: width * 0.4,
    height: width * 0.4,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.2,
    shadowRadius: 20,
    elevation: 12,
  },
  tagline: {
    fontSize: 32,
    color: '#fff',
    fontWeight: '800',
    textAlign: 'center',
    letterSpacing: 2,
    fontFamily: 'Urbanist_700Bold',
    textShadowColor: 'rgba(0,0,0,0.3)',
    textShadowOffset: { width: 0, height: 4 },
    textShadowRadius: 12,
    marginBottom: 8,
  },
  taglineSecondary: {
    fontSize: 28,
    color: 'rgba(255,255,255,0.9)',
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: 1.5,
    fontFamily: 'Urbanist_700Bold',
    textShadowColor: 'rgba(0,0,0,0.2)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
    marginBottom: 40,
  },
  featuresContainer: {
    marginTop: 20,
  },
  featureRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: width * 0.8,
  },
  featureItem: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.1)',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    backdropFilter: 'blur(10px)',
  },
  featureText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
    marginTop: 4,
    fontFamily: 'Urbanist_600SemiBold',
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 80,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 4,
  },
  buttonBlur: {
    borderRadius: 35,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
    elevation: 12,
  },
  getStartedBtn: {
    backgroundColor: '#fff',
    borderRadius: 35,
    paddingHorizontal: 50,
    paddingVertical: 15,
    elevation: 0,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.2,
    shadowRadius: 16,
  },
  buttonLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    letterSpacing: 1,
    fontFamily: 'Urbanist_700Bold',
    color: '#185a9d',
  },
  waveContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    height: 100,
    zIndex: 1,
  },
  wave: {
    flex: 1,
    borderTopLeftRadius: 50,
    borderTopRightRadius: 50,
  },
}); 