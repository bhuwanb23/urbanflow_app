import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, ActivityIndicator } from 'react-native';
import ProfileHeader from './components/ProfileHeader';
import ProfileCard from './components/ProfileCard';
import SettingsCard from './components/SettingsCard';
import SustainabilityCard from './components/SustainabilityCard';
import LogoutButton from './components/LogoutButton';

const profile = {
    name: 'Bhuwan B',
    email: 'bhuwan.b@urbanflow.com',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
};

const settings = [
    { label: 'Language & Region', icon: 'web', color: ['#3b82f6', '#1e40af'], bg: '#e0eaff', screen: 'LanguageRegion' },
    { label: 'Preferred Transport', icon: 'bus', color: ['#22c55e', '#4ade80'], bg: '#d1fae5', screen: 'PreferredTransport' },
    { label: 'Notifications', icon: 'bell', color: ['#facc15', '#fbbf24'], bg: '#fef9c3', screen: 'Notifications' },
    { label: 'Mobility Goals', icon: 'target', color: ['#a78bfa', '#f472b6'], bg: '#ede9fe', screen: 'MobilityGoals' },
    { label: 'Privacy', icon: 'shield-lock', color: ['#ef4444', '#f87171'], bg: '#fee2e2', screen: 'Privacy' },
];

const sustainability = [
    { label: 'CO₂ Saved', value: '24.5 kg', icon: 'leaf', color: ['#4ade80', '#16a34a'], percent: '+12%', percentColor: '#16a34a', bg: '#f0fdf4' },
    { label: 'Distance Walked', value: '142 km', icon: 'walk', color: ['#3b82f6', '#1e40af'], percent: '+8%', percentColor: '#2563eb', bg: '#eff6ff' },
    { label: 'Public Transport', value: '28 trips', icon: 'subway-variant', color: ['#a78bfa', '#f472b6'], percent: '+15%', percentColor: '#a21caf', bg: '#f5f3ff' },
];

export default function ProfileScreen({ navigation }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Simulate network loading
        const timer = setTimeout(() => setLoading(false), 1200);
        return () => clearTimeout(timer);
    }, []);

    const handleSettingPress = (setting) => {
        // Navigate to the appropriate screen based on setting
        switch (setting.screen) {
            case 'LanguageRegion':
                navigation.navigate('LanguageRegionScreen');
                break;
            case 'PreferredTransport':
                navigation.navigate('PreferredTransportScreen');
                break;
            case 'Notifications':
                navigation.navigate('NotificationsScreen');
                break;
            case 'MobilityGoals':
                navigation.navigate('MobilityGoalsScreen');
                break;
            case 'Privacy':
                navigation.navigate('PrivacyScreen');
                break;
            default:
                console.log('Setting pressed:', setting.label);
        }
    };

    const handleEditProfile = () => {
        // Navigate to edit profile screen
        navigation.navigate('EditProfileScreen');
    };

    const handleEditAvatar = () => {
        // Handle avatar editing
        console.log('Edit avatar pressed');
    };

    const handleLogout = () => {
        // Handle logout logic
        console.log('Logout pressed');
        // You can add your logout logic here
        // For example: navigation.replace('Login');
    };

    const handleMenuPress = () => {
        // Handle menu press
        console.log('Menu pressed');
    };

    if (loading) {
        return (
            <View style={{ flex: 1, backgroundColor: '#F9FAFB', justifyContent: 'center', alignItems: 'center' }}>
                <ActivityIndicator size="large" color="#3B82F6" />
                <Text style={{ marginTop: 16, color: '#3B82F6', fontFamily: 'Urbanist_400Regular', fontSize: 16 }}>Loading profile...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <ProfileHeader 
                title="Profile" 
                onMenu={handleMenuPress}
                showBack={false}
            />
            
            <ScrollView 
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Info Card */}
                <ProfileCard 
                    profile={profile}
                    onEditProfile={handleEditProfile}
                    onEditAvatar={handleEditAvatar}
                />

                {/* Settings */}
                <SettingsCard 
                    title="Settings"
                    settings={settings}
                    onSettingPress={handleSettingPress}
                />

                {/* Sustainability Impact */}
                <SustainabilityCard 
                    title="Sustainability Impact"
                    sustainabilityData={sustainability}
                />

                {/* Logout Button */}
                <LogoutButton onLogout={handleLogout} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollContent: { 
        padding: 20,
        paddingBottom: 80 // Reduced to match working screens
    },
}); 