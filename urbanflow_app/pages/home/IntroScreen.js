import React from 'react';
import { View, StyleSheet, Text, Platform, TouchableOpacity, StatusBar } from 'react-native';
import { useTranslation } from 'react-i18next';

import { MotiView } from 'moti';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';

export default function IntroScreen({ navigation }) {
  const { t } = useTranslation();

  return (
    <>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" translucent={false} />
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
          <Text style={styles.title}>{t('intro.title')}</Text>
          <Text style={styles.subtitle}>{t('intro.smartMobility')}</Text>
          <Text style={styles.subtitleGreener}>{t('intro.zeroCompromise')}</Text>
          
          <Text style={styles.description}>
            {t('intro.description')}
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
          <Text style={styles.buttonText}>{t('intro.getStarted')}</Text>
          <Icon name="arrow-right" size={20} color="#FFFFFF" style={styles.buttonIcon} />
        </TouchableOpacity>
      </MotiView>
    </View>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // White background
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
    backgroundColor: '#ECFDF5', // Emerald 50
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#D1FAE5', // Emerald 100
  },
  textContainer: {
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    color: '#059669', // Emerald 600 - Darker for better contrast
    fontFamily: 'Poppins_700Bold',
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: 16,
  },
  subtitle: {
    fontSize: 40,
    color: '#0F172A', // Slate 900 - Keep this dark
    fontFamily: 'Poppins_700Bold',
    lineHeight: 48,
  },
  subtitleGreener: {
    fontSize: 40,
    color: '#1e293b', // Slate 800 - Darker for better visibility
    fontFamily: 'Poppins_700Bold',
    lineHeight: 48,
    marginBottom: 24,
  },
  description: {
    fontSize: 16,
    color: '#334155', // Slate 700 - Darker for readability
    fontFamily: 'Urbanist_400Regular',
    lineHeight: 24,
  },
  footer: {
    paddingHorizontal: 32,
    paddingBottom: Platform.OS === 'ios' ? 48 : 32,
  },
  primaryButton: {
    backgroundColor: '#10B981', // Emerald 500
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 18,
    borderRadius: 16,
    shadowColor: '#10B981',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 18,
    fontFamily: 'Urbanist_700Bold',
  },
  buttonIcon: {
    marginLeft: 8,
  }
});
