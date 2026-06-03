import React, { useState } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, TextInput, KeyboardAvoidingView, ScrollView, StatusBar, Alert, ActivityIndicator } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { LinearGradient } from 'expo-linear-gradient';
import { useAuth } from '../../utils/hooks/useAPI';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { login, register } = useAuth();

  const handleAuth = async () => {
    if (!email.trim() || !password.trim()) {
      Alert.alert('Validation Error', 'Please enter both email and password.');
      return;
    }

    try {
      setIsSubmitting(true);

      if (isLogin) {
        await login({ email: email.trim(), password });
      } else {
        await register({ email: email.trim(), password });
      }

      navigation.replace('MainTabs');
    } catch (error) {
      Alert.alert(
        isLogin ? 'Login Failed' : 'Registration Failed',
        error.message || 'Something went wrong. Please try again.'
      );
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
      <View style={styles.mainContainer}>
      <KeyboardAvoidingView 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        style={styles.keyboardView}
      >
        <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
          
          {/* Top Header */}
          <MotiView 
            from={{ opacity: 0, translateY: -10 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800 }}
            style={styles.topHeader}
          >
            <Icon name="shield-check" size={24} color="#10B981" />
            <Text style={styles.headerTitle}>UrbanFlow</Text>
          </MotiView>

          {/* Hero Section */}
          <View style={styles.heroSection}>
            <MotiView
              from={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ type: 'spring', delay: 100 }}
              style={styles.heroIconCircle}
            >
              <Icon name="lock" size={36} color="#10B981" />
            </MotiView>
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', delay: 200, duration: 800 }}
            >
              <Text style={styles.heroTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
              <Text style={styles.heroSubtitle}>{isLogin ? 'Access your secure mobility assistant' : 'Join UrbanFlow for smarter travel'}</Text>
            </MotiView>
          </View>

          {/* Form Section */}
          <View style={styles.formSection}>
            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', delay: 300, duration: 800 }}
              style={styles.inputGroup}
            >
              <Text style={styles.label}>EMAIL ADDRESS</Text>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="name@example.com"
                  placeholderTextColor="#94A3B8"
                  value={email}
                  onChangeText={setEmail}
                  keyboardType="email-address"
                  autoCapitalize="none"
                />
              </View>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', delay: 400, duration: 800 }}
              style={styles.inputGroup}
            >
              <View style={styles.passwordHeader}>
                <Text style={styles.label}>PASSWORD</Text>
                {isLogin && (
                  <TouchableOpacity>
                    <Text style={styles.forgotPassword}>Forgot Password?</Text>
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.inputContainer}>
                <TextInput
                  style={styles.input}
                  placeholder="••••••••"
                  placeholderTextColor="#94A3B8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                  <Icon name={showPassword ? "eye-off" : "eye"} size={20} color="#64748B" />
                </TouchableOpacity>
              </View>
            </MotiView>

            <MotiView
              from={{ opacity: 0, translateY: 20 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', delay: 500, duration: 800 }}
            >
              <TouchableOpacity
                onPress={handleAuth}
                activeOpacity={0.9}
                disabled={isSubmitting}
              >
                <LinearGradient
                  colors={['#10B981', '#059669']}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1, y: 1 }}
                  style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
                >
                  {isSubmitting ? (
                    <ActivityIndicator color="#FFFFFF" size="small" />
                  ) : (
                    <Text style={styles.submitButtonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
                  )}
                </LinearGradient>
              </TouchableOpacity>
            </MotiView>

            {/* Divider */}
            <MotiView
              from={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ type: 'timing', delay: 600, duration: 800 }}
              style={styles.dividerContainer}
            >
              <View style={styles.dividerLine} />
              <Text style={styles.dividerText}>OR CONTINUE WITH</Text>
              <View style={styles.dividerLine} />
            </MotiView>

            {/* Social Logins */}
            <MotiView
              from={{ opacity: 0, translateY: 10 }}
              animate={{ opacity: 1, translateY: 0 }}
              transition={{ type: 'timing', delay: 700, duration: 800 }}
              style={styles.socialContainer}
            >
              <TouchableOpacity style={styles.socialButton}>
                <Icon name="google" size={20} color="#0F172A" />
                <Text style={styles.socialButtonText}>Google</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.socialButton}>
                <Icon name="apple" size={22} color="#0F172A" />
                <Text style={styles.socialButtonText}>Apple</Text>
              </TouchableOpacity>
            </MotiView>
          </View>
          
          {/* Footer */}
          <MotiView
            from={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ type: 'timing', delay: 800, duration: 800 }}
            style={styles.footer}
          >
            <Text style={styles.footerText}>
              {isLogin ? "Don't have an account?" : "Already have an account?"}
            </Text>
            <TouchableOpacity onPress={() => setIsLogin(!isLogin)}>
              <Text style={styles.footerLink}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
            </TouchableOpacity>
          </MotiView>
          
          {/* Demo Button (Hidden in plain sight style) - dev only */}
          {__DEV__ && (
            <TouchableOpacity
              style={styles.demoLink}
              onPress={() => navigation.replace('MainTabs')}
            >
              <Text style={styles.demoLinkText}>Demo Mode</Text>
            </TouchableOpacity>
          )}

        </ScrollView>
      </KeyboardAvoidingView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White
  },
  keyboardView: {
    flex: 1,
  },
  scrollContent: {
    flexGrow: 1,
    paddingHorizontal: 32,
    paddingTop: Platform.OS === 'ios' ? 60 : 40,
    paddingBottom: 40,
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 40,
    gap: 8,
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Poppins_700Bold',
    color: '#10B981', // Emerald 500
    letterSpacing: -0.5,
  },
  heroSection: {
    alignItems: 'center',
    marginBottom: 40,
  },
  heroIconCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: '#ECFDF5', // Emerald 50
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
  },
  heroTitle: {
    fontSize: 30,
    fontFamily: 'Poppins_700Bold',
    color: '#0F172A', // Slate 900
    textAlign: 'center',
    marginBottom: 8,
    letterSpacing: -0.5,
  },
  heroSubtitle: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#64748B', // Slate 500
    textAlign: 'center',
  },
  formSection: {
    width: '100%',
  },
  inputGroup: {
    marginBottom: 24,
  },
  label: {
    fontSize: 10,
    fontFamily: 'Urbanist_700Bold',
    color: '#64748B', // Slate 500
    textTransform: 'uppercase',
    letterSpacing: 0.8,
    marginBottom: 8,
    marginLeft: 4,
  },
  passwordHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    marginBottom: 8,
  },
  forgotPassword: {
    fontSize: 12,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#10B981', // Emerald 500
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F8FAFC', // Slate 50
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0', // Slate 200
  },
  input: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#0F172A', // Slate 900
    fontFamily: 'Urbanist_400Regular',
  },
  eyeIcon: {
    padding: 14,
  },
  submitButton: {
    borderRadius: 9999,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 52,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: {
    opacity: 0.7,
  },
  submitButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 0.5,
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 40,
    gap: 16,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#E2E8F0', // Slate 200
  },
  dividerText: {
    fontSize: 10,
    fontFamily: 'Urbanist_700Bold',
    color: '#94A3B8', // Slate 400
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  socialContainer: {
    flexDirection: 'row',
    gap: 16,
  },
  socialButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF', // White
    borderWidth: 1,
    borderColor: '#E2E8F0', // Slate 200
    borderRadius: 12,
    paddingVertical: 14,
    gap: 10,
  },
  socialButtonText: {
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#0F172A', // Slate 900
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 48,
    gap: 6,
  },
  footerText: {
    fontSize: 14,
    fontFamily: 'Urbanist_400Regular',
    color: '#64748B', // Slate 500
  },
  footerLink: {
    fontSize: 14,
    fontFamily: 'Urbanist_700Bold',
    color: '#10B981', // Emerald 500
  },
  demoLink: {
    alignItems: 'center',
    marginTop: 24,
  },
  demoLinkText: {
    fontSize: 12,
    fontFamily: 'Urbanist_600SemiBold',
    color: '#94A3B8', // Slate 400
  },
});
