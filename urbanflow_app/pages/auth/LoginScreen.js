import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, TextInput, Alert, ActivityIndicator, KeyboardAvoidingView } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { useAuth } from '../../utils/hooks/useAPI';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLogin, setIsLogin] = useState(true);
  
  const { login, register, loading, error } = useAuth();

  useEffect(() => {
    if (error) Alert.alert('Error', error, [{ text: 'OK' }]);
  }, [error]);

  const handleAuth = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }
    try {
      if (isLogin) {
        await login({ email, password });
      } else {
        const name = email.split('@')[0];
        await register({ name, email, password });
      }
      navigation.replace('MainTabs');
    } catch (error) {
      console.log('Auth error:', error);
      Alert.alert('Error', error.message || 'Authentication failed');
    }
  };

  return (
    <KeyboardAvoidingView 
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      style={styles.container}
    >
      <View style={styles.content}>
        <MotiView
          from={{ opacity: 0, translateY: -20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800 }}
          style={styles.headerSection}
        >
          <View style={styles.iconContainer}>
            <Icon name="map-marker-path" size={32} color="#10B981" />
          </View>
          <Text style={styles.appTitle}>{isLogin ? 'Welcome Back' : 'Create Account'}</Text>
          <Text style={styles.appSubtitle}>
            {isLogin ? 'Enter your details to access your account.' : 'Join UrbanFlow for smarter travel.'}
          </Text>
        </MotiView>

        <MotiView
          from={{ opacity: 0, translateY: 20 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
          style={styles.formContainer}
        >
          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Email Address</Text>
            <View style={styles.inputContainer}>
              <Icon name="email-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={styles.textInput}
                placeholder="Enter your email"
                placeholderTextColor="#475569"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>
          </View>

          <View style={styles.inputWrapper}>
            <Text style={styles.inputLabel}>Password</Text>
            <View style={styles.inputContainer}>
              <Icon name="lock-outline" size={20} color="#64748B" style={styles.inputIcon} />
              <TextInput
                style={[styles.textInput, { flex: 1 }]}
                placeholder="Enter your password"
                placeholderTextColor="#475569"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                autoCapitalize="none"
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)} style={styles.eyeIcon}>
                <Icon name={showPassword ? "eye-off-outline" : "eye-outline"} size={20} color="#64748B" />
              </TouchableOpacity>
            </View>
          </View>

          <TouchableOpacity
            style={styles.authButton}
            onPress={handleAuth}
            disabled={loading}
            activeOpacity={0.8}
          >
            {loading ? (
              <ActivityIndicator color="#0B0F19" size="small" />
            ) : (
              <Text style={styles.authButtonText}>{isLogin ? 'Sign In' : 'Sign Up'}</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.toggleButton}
            onPress={() => setIsLogin(!isLogin)}
            disabled={loading}
          >
            <Text style={styles.toggleText}>
              {isLogin ? "Don't have an account? " : "Already have an account? "}
              <Text style={styles.toggleTextBold}>{isLogin ? 'Sign Up' : 'Sign In'}</Text>
            </Text>
          </TouchableOpacity>
        </MotiView>
      </View>

      <TouchableOpacity
        style={styles.demoButton}
        onPress={async () => {
          try {
            await login({ email: 'demo@urbanflow.com', password: 'password' });
            navigation.replace('MainTabs');
          } catch (error) {
            Alert.alert('Error', 'Demo login failed. Check server status.');
          }
        }}
        disabled={loading}
      >
        <Text style={styles.demoButtonText}>Continue as Demo User</Text>
      </TouchableOpacity>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0B0F19',
  },
  content: {
    flex: 1,
    paddingHorizontal: 32,
    justifyContent: 'center',
  },
  headerSection: {
    marginBottom: 48,
  },
  iconContainer: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: 'rgba(16, 185, 129, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 24,
    borderWidth: 1,
    borderColor: 'rgba(16, 185, 129, 0.2)',
  },
  appTitle: {
    fontSize: 32,
    color: '#F8FAFC',
    fontFamily: 'Poppins_700Bold',
    marginBottom: 8,
  },
  appSubtitle: {
    fontSize: 16,
    color: '#64748B',
    fontFamily: 'Urbanist_400Regular',
    lineHeight: 24,
  },
  formContainer: {
    width: '100%',
  },
  inputWrapper: {
    marginBottom: 20,
  },
  inputLabel: {
    color: '#94A3B8',
    fontSize: 14,
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 8,
    marginLeft: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1E293B',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  inputIcon: {
    marginRight: 12,
  },
  textInput: {
    flex: 1,
    fontSize: 16,
    color: '#F8FAFC',
    fontFamily: 'Urbanist_400Regular',
  },
  eyeIcon: {
    padding: 4,
  },
  authButton: {
    backgroundColor: '#10B981',
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    marginTop: 12,
    marginBottom: 24,
  },
  authButtonText: {
    color: '#0B0F19',
    fontSize: 18,
    fontFamily: 'Urbanist_700Bold',
  },
  toggleButton: {
    alignItems: 'center',
  },
  toggleText: {
    fontSize: 15,
    color: '#64748B',
    fontFamily: 'Urbanist_400Regular',
  },
  toggleTextBold: {
    color: '#10B981',
    fontFamily: 'Urbanist_700Bold',
  },
  demoButton: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingBottom: Platform.OS === 'ios' ? 40 : 24,
    borderTopWidth: 1,
    borderTopColor: '#1E293B',
  },
  demoButtonText: {
    fontSize: 15,
    color: '#94A3B8',
    fontFamily: 'Urbanist_600SemiBold',
  },
}); 