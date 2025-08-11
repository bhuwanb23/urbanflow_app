import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Dimensions, Platform, TouchableOpacity, TextInput, Alert, ActivityIndicator } from 'react-native';
import { Button } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { BlurView } from 'expo-blur';
import { MotiView } from 'moti';
import { authFlow, tokenManager } from '../../utils/auth';

const { width, height } = Dimensions.get('window');

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isLogin, setIsLogin] = useState(true);

  // Login status is now checked in App.js, so we don't need to check here

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    setLoading(true);
    
    try {
      if (isLogin) {
        // Login
        await authFlow.login({ email, password });
      } else {
        // Register
        const name = email.split('@')[0]; // Use email prefix as name
        await authFlow.register({ name, email, password });
      }
      
      // Navigate to main app
      navigation.replace('MainTabs');
    } catch (error) {
      console.log('Auth error:', error);
      Alert.alert('Error', error.message || 'Authentication failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={{ flex: 1 }}>
      <LinearGradient
        colors={["#43cea2", "#185a9d", "#6a11cb", "#2575fc"]}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={StyleSheet.absoluteFill}
      />
      
      <View style={styles.container}>
        {/* Header Section */}
        <MotiView
          from={{ opacity: 0, translateY: -30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 700 }}
          style={styles.headerSection}
        >
          <BlurView intensity={60} tint="light" style={styles.headerBlur}>
            <View style={styles.logoContainer}>
              <LinearGradient colors={["#43cea2", "#6a11cb"]} style={styles.logoGradient}>
                <Icon name="map-marker-path" size={48} color="#fff" />
              </LinearGradient>
            </View>
            <Text style={styles.appTitle}>UrbanFlow</Text>
            <Text style={styles.appSubtitle}>Smart Urban Mobility</Text>
          </BlurView>
        </MotiView>

        {/* Auth Form */}
        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 300 }}
          style={styles.formContainer}
        >
          <BlurView intensity={60} tint="light" style={styles.formBlur}>
            <Text style={styles.formTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
            <Text style={styles.formSubtitle}>
              {isLogin ? 'Sign in to continue your journey' : 'Join us for smarter mobility'}
            </Text>

            {/* Email Input */}
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={20} color="#1976d2" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Email address"
                placeholderTextColor="#9ca3af"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            {/* Password Input */}
            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={20} color="#1976d2" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Password"
                placeholderTextColor="#9ca3af"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity
                onPress={() => setShowPassword(!showPassword)}
                style={styles.eyeIcon}
              >
                <Icon
                  name={showPassword ? "eye-off-outline" : "eye-outline"}
                  size={20}
                  color="#9ca3af"
                />
              </TouchableOpacity>
            </View>

            {/* Auth Button */}
            <TouchableOpacity
              style={styles.authButton}
              onPress={handleAuth}
              disabled={loading}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#43cea2", "#6a11cb"]}
                style={styles.authButtonGradient}
              >
                {loading ? (
                  <ActivityIndicator color="#fff" size="small" />
                ) : (
                  <Text style={styles.authButtonText}>
                    {isLogin ? 'Sign In' : 'Create Account'}
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Toggle Login/Register */}
            <TouchableOpacity
              style={styles.toggleButton}
              onPress={() => setIsLogin(!isLogin)}
              disabled={loading}
            >
              <Text style={styles.toggleText}>
                {isLogin ? "Don't have an account? " : "Already have an account? "}
                <Text style={styles.toggleTextBold}>
                  {isLogin ? 'Sign Up' : 'Sign In'}
                </Text>
              </Text>
            </TouchableOpacity>

            {/* Demo Login */}
            <TouchableOpacity
              style={styles.demoButton}
              onPress={async () => {
                setLoading(true);
                try {
                  // Demo login using the demo credentials
                  await authFlow.login({
                    email: 'demo@urbanflow.com',
                    password: 'password'
                  });
                  
                  navigation.replace('MainTabs');
                } catch (error) {
                  Alert.alert('Error', 'Demo login failed. Please check if the server is running.');
                } finally {
                  setLoading(false);
                }
              }}
              disabled={loading}
            >
              <Text style={styles.demoButtonText}>Try Demo Mode</Text>
            </TouchableOpacity>
          </BlurView>
        </MotiView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingHorizontal: 20,
  },
  headerSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  headerBlur: {
    borderRadius: 32,
    padding: 24,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  logoContainer: {
    marginBottom: 16,
  },
  logoGradient: {
    width: 80,
    height: 80,
    borderRadius: 40,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  appTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: '#185a9d',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 4,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#388e3c',
    fontFamily: 'Urbanist_400Regular',
  },
  formContainer: {
    flex: 1,
  },
  formBlur: {
    borderRadius: 32,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.08,
    shadowRadius: 16,
    elevation: 8,
  },
  formTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#185a9d',
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  formSubtitle: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
    textAlign: 'center',
    marginBottom: 32,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.8)',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#185a9d',
    fontFamily: 'Urbanist_400Regular',
  },
  eyeIcon: {
    padding: 4,
  },
  authButton: {
    marginTop: 8,
    marginBottom: 24,
    borderRadius: 16,
    overflow: 'hidden',
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 10,
    elevation: 6,
  },
  authButtonGradient: {
    paddingVertical: 16,
    alignItems: 'center',
  },
  authButtonText: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
    fontFamily: 'Urbanist_700Bold',
  },
  toggleButton: {
    alignItems: 'center',
    marginBottom: 24,
  },
  toggleText: {
    fontSize: 16,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
  toggleTextBold: {
    color: '#1976d2',
    fontWeight: '700',
    fontFamily: 'Poppins_700Bold',
  },
  demoButton: {
    alignItems: 'center',
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#e5e7eb',
  },
  demoButtonText: {
    fontSize: 16,
    color: '#388e3c',
    fontFamily: 'Urbanist_700Bold',
  },
}); 