import React from 'react';
import { View, StyleSheet, Text, Dimensions, Platform, Image } from 'react-native';
import { Button } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView, MotiImage } from 'moti';
import { BlurView } from 'expo-blur';

const { width, height } = Dimensions.get('window');

export default function IntroScreen({ navigation }) {
  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#43cea2", "#185a9d", "#6a11cb", "#2575fc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      {/* Optional: Add a blurred cityscape image overlay if you have one in assets */}
      {/* <Image source={require('../../assets/cityscape.png')} style={styles.cityscape} resizeMode="cover" />
      <BlurView intensity={60} tint="light" style={styles.cityBlur} /> */}
      <View style={styles.centered}>
        <MotiImage
          source={require('../../assets/icon.png')}
          style={styles.logo}
          from={{ scale: 0.7, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ type: 'spring', delay: 200 }}
          resizeMode="contain"
        />
        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 600 }}
        >
          <Text style={styles.tagline}>Move Smarter. Live Greener.</Text>
        </MotiView>
      </View>
      <MotiView
        from={{ opacity: 0, translateY: 40 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800, delay: 1200 }}
        style={styles.buttonContainer}
      >
        <Button
          mode="contained"
          style={styles.getStartedBtn}
          labelStyle={{ fontSize: 18, fontWeight: 'bold', letterSpacing: 1, fontFamily: 'Urbanist_700Bold' }}
          onPress={() => navigation.replace('Login')}
        >
          Get Started
        </Button>
      </MotiView>
    </View>
  );
}

const styles = StyleSheet.create({
  // cityscape: {
  //   ...StyleSheet.absoluteFillObject,
  //   width: width,
  //   height: height,
  //   opacity: 0.25,
  //   zIndex: 0,
  // },
  // cityBlur: {
  //   ...StyleSheet.absoluteFillObject,
  //   zIndex: 1,
  // },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width: '100%',
    zIndex: 2,
  },
  logo: {
    width: width * 0.38,
    height: width * 0.38,
    marginBottom: 32,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.15)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 16,
    elevation: 8,
  },
  tagline: {
    fontSize: 28,
    color: '#fff',
    fontWeight: '700',
    marginBottom: 20,
    textAlign: 'center',
    letterSpacing: 1,
    fontFamily: 'Urbanist_700Bold',
    textShadowColor: 'rgba(0,0,0,0.15)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 8,
  },
  buttonContainer: {
    position: 'absolute',
    bottom: 60,
    left: 0,
    right: 0,
    alignItems: 'center',
    zIndex: 3,
  },
  getStartedBtn: {
    backgroundColor: '#fff',
    borderRadius: 30,
    paddingHorizontal: 40,
    paddingVertical: 10,
    elevation: 8,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.18,
    shadowRadius: 16,
  },
}); 