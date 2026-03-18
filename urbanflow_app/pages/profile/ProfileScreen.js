import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';

// Import Theme
import profileTheme from './theme/profileTheme';

// Import Components
import ProfileHeader from './components/ProfileHeader';
import ProfileCard from './components/ProfileCard';
import SettingsCard from './components/SettingsCard';
import SustainabilityCard from './components/SustainabilityCard';
import LogoutButton from './components/LogoutButton';

// Mock Data (Assuming hooks might not be fully wired up yet based on your existing pattern)
const MOCK_PROFILE = {
  name: 'Bhuwan Chandra',
  email: 'bhuwan@urbanflow.eco',
  joinDate: 'Jan 2024',
};

const ACCOUNT_SETTINGS = [
  { icon: 'account-edit', label: 'Edit Profile', route: 'EditProfileScreen', bg: '#F8FAFC', color: ['#0F172A'] },
  { icon: 'bell-outline', label: 'Notifications', route: 'NotificationsScreen', bg: '#F8FAFC', color: ['#0F172A'] },
  { icon: 'shield-account', label: 'Privacy & Security', route: 'PrivacyScreen', bg: '#F8FAFC', color: ['#0F172A'] },
];

const PREFERENCES_SETTINGS = [
  { icon: 'bus', label: 'Preferred Transport', route: 'PreferredTransportScreen', bg: '#F8FAFC', color: ['#0F172A'] },
  { icon: 'target', label: 'Mobility Goals', route: 'MobilityGoalsScreen', bg: '#F8FAFC', color: ['#0F172A'] },
  { icon: 'earth', label: 'Language & Region', route: 'LanguageRegionScreen', bg: '#F8FAFC', color: ['#0F172A'] },
];

const SUSTAINABILITY_DATA = [
  { icon: 'leaf', label: 'CO2 Saved', value: '45.2 kg', percent: '+12%', percentColor: '#10B981', bg: '#ECFDF5', color: ['#10B981'] },
  { icon: 'tree', label: 'Trees Equivalent', value: '2.5', percent: '+1', percentColor: '#10B981', bg: '#ECFDF5', color: ['#10B981'] },
  { icon: 'star-circle', label: 'Eco Score', value: '850', percent: 'Top 5%', percentColor: '#F59E0B', bg: '#FFFBEB', color: ['#F59E0B'] },
];

export default function ProfileScreen({ navigation }) {
  const [profile, setProfile] = useState(MOCK_PROFILE);
  const [loading, setLoading] = useState(false);

  // In a real app, fetch data here
  useEffect(() => {
    // Simulate data loading
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
    }, 500);
  }, []);

  const handleSettingPress = (setting) => {
    if (setting.route) {
      // navigation.navigate(setting.route);
      console.log(`Navigate to ${setting.route}`);
    }
  };

  const handleLogout = () => {
    console.log('Logging out...');
    navigation.replace('Login');
  };

  const handleEditProfile = () => {
    console.log('Edit profile clicked');
    // navigation.navigate('EditProfileScreen');
  };

  const handleEditAvatar = () => {
    console.log('Edit avatar clicked');
    // Trigger image picker
  };

  if (loading) {
    return (
      <SafeAreaView style={styles.loadingContainer}>
        <ActivityIndicator size="large" color={profileTheme.colors.primary} />
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader 
        title="My Profile" 
        onMenu={() => console.log('Menu clicked')} 
      />
      
      <ScrollView 
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        <ProfileCard 
          profile={profile} 
          onEditProfile={handleEditProfile}
          onEditAvatar={handleEditAvatar}
        />

        <SustainabilityCard 
          title="Sustainability Impact" 
          sustainabilityData={SUSTAINABILITY_DATA} 
        />

        <SettingsCard 
          title="Account" 
          settings={ACCOUNT_SETTINGS} 
          onSettingPress={handleSettingPress} 
        />

        <SettingsCard 
          title="Preferences" 
          settings={PREFERENCES_SETTINGS} 
          onSettingPress={handleSettingPress} 
        />

        <LogoutButton onLogout={handleLogout} />
        
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: profileTheme.colors.background,
  },
  loadingContainer: {
    flex: 1,
    backgroundColor: profileTheme.colors.background,
    justifyContent: 'center',
    alignItems: 'center',
  },
  scrollContent: {
    paddingHorizontal: profileTheme.spacing.xl,
    paddingTop: profileTheme.spacing.lg,
    paddingBottom: profileTheme.spacing['4xl'],
  },
});
