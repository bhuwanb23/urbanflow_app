import React, { _useState, useMemo } from 'react';
import { StyleSheet, ScrollView, SafeAreaView, ActivityIndicator } from 'react-native';

// Import Theme
import profileTheme from './theme/profileTheme';

// Import API Hooks
import { useAuth, useTrips } from '../../utils/hooks/useAPI';

// Import Components
import ProfileHeader from './components/ProfileHeader';
import ProfileCard from './components/ProfileCard';
import SettingsCard from './components/SettingsCard';
import SustainabilityCard from './components/SustainabilityCard';
import LogoutButton from './components/LogoutButton';

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
  // Use real API data instead of mock
  const { user, loading: userLoading } = useAuth();
  const { trips } = useTrips();

  // Calculate sustainability data from real trips
  const sustainabilityData = useMemo(() => {
    if (!trips || !trips.length) {
      return [
        { icon: 'leaf', label: 'CO₂ Saved', value: '0 kg', percent: '+0%', percentColor: '#10B981', bg: '#ECFDF5', color: ['#10B981'] },
        { icon: 'tree', label: 'Trees Equivalent', value: '0', percent: '+0', percentColor: '#10B981', bg: '#ECFDF5', color: ['#10B981'] },
        { icon: 'star-circle', label: 'Eco Score', value: '0', percent: 'N/A', percentColor: '#F59E0B', bg: '#FFFBEB', color: ['#F59E0B'] },
      ];
    }

    const carbonSaved = trips.reduce((sum, t) => sum + (t.carbonSaved || 0), 0).toFixed(1);
    const treesEquivalent = (carbonSaved * 0.05).toFixed(1); // Approximate conversion
    const ecoScore = Math.min(1000, Math.round(carbonSaved * 20));

    return [
      { icon: 'leaf', label: 'CO₂ Saved', value: `${carbonSaved} kg`, percent: '+12%', percentColor: '#10B981', bg: '#ECFDF5', color: ['#10B981'] },
      { icon: 'tree', label: 'Trees Equivalent', value: treesEquivalent, percent: `+${treesEquivalent}`, percentColor: '#10B981', bg: '#ECFDF5', color: ['#10B981'] },
      { icon: 'star-circle', label: 'Eco Score', value: ecoScore.toString(), percent: ecoScore > 800 ? 'Top 5%' : 'Keep Going!', percentColor: ecoScore > 800 ? '#F59E0B' : '#10B981', bg: ecoScore > 800 ? '#FFFBEB' : '#ECFDF5', color: [ecoScore > 800 ? '#F59E0B' : '#10B981'] },
    ];
  }, [trips]);

  // Dynamic settings based on user preferences
  const accountSettings = useMemo(() => [
    { icon: 'account-edit', label: 'Edit Profile', route: 'EditProfileScreen', bg: '#F8FAFC', color: ['#0F172A'] },
    { icon: 'bell-outline', label: 'Notifications', route: 'NotificationsScreen', bg: '#F8FAFC', color: ['#0F172A'] },
    { icon: 'shield-account', label: 'Privacy & Security', route: 'PrivacyScreen', bg: '#F8FAFC', color: ['#0F172A'] },
  ], []);

  const preferencesSettings = useMemo(() => [
    { icon: 'bus', label: 'Preferred Transport', route: 'PreferredTransportScreen', bg: '#F8FAFC', color: ['#0F172A'] },
    { icon: 'target', label: 'Mobility Goals', route: 'MobilityGoalsScreen', bg: '#F8FAFC', color: ['#0F172A'] },
    { icon: 'earth', label: 'Language & Region', route: 'LanguageRegionScreen', bg: '#F8FAFC', color: ['#0F172A'] },
  ], []);

  // In a real app, fetch data here
  // useEffect removed — the previous setTimeout(500) fake delay was masking
  // the fact that useAuth/useTrips already manage loading state on their own.

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

  if (userLoading) {
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
          profile={user || { name: 'Guest User', email: '', joinDate: '' }} 
          onEditProfile={handleEditProfile}
          onEditAvatar={handleEditAvatar}
        />

        <SustainabilityCard 
          title="Sustainability Impact" 
          sustainabilityData={sustainabilityData} 
        />

        <SettingsCard 
          title="Account" 
          settings={accountSettings} 
          onSettingPress={handleSettingPress} 
        />

        <SettingsCard 
          title="Preferences" 
          settings={preferencesSettings} 
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
