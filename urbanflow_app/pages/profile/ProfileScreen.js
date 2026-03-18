import React, { useState, useEffect } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, ActivityIndicator, Alert } from 'react-native';
import ProfileHeader from './components/ProfileHeader';
import ProfileCard from './components/ProfileCard';
import SettingsCard from './components/SettingsCard';
import SustainabilityCard from './components/SustainabilityCard';
import LogoutButton from './components/LogoutButton';

const settings = [
    { label: 'Language & Region', icon: 'web', color: ['#3b82f6', '#1e40af'], bg: '#e0eaff', screen: 'LanguageRegion' },
    { label: 'Preferred Transport', icon: 'bus', color: ['#22c55e', '#4ade80'], bg: '#d1fae5', screen: 'PreferredTransport' },
    { label: 'Notifications', icon: 'bell', color: ['#facc15', '#fbbf24'], bg: '#fef9c3', screen: 'Notifications' },
    { label: 'Mobility Goals', icon: 'target', color: ['#a78bfa', '#f472b6'], bg: '#ede9fe', screen: 'MobilityGoals' },
    { label: 'Privacy', icon: 'shield-lock', color: ['#ef4444', '#f87171'], bg: '#fee2e2', screen: 'Privacy' },
];

export default function ProfileScreen({ navigation }) {
    // Mock Data
    const user = {
        name: 'Demo User',
        email: 'demo@urbanflow.com',
        avatar: null
    };

    const ecoStats = {
        totalCO2Saved: '125 kg',
        totalDistanceWalked: '45 km',
        totalPublicTransportTrips: 28
    };

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
        navigation.replace('Login');
    };

    const handleMenuPress = () => {
        // Handle menu press
        console.log('Menu pressed');
    };

    // Prepare sustainability data
    const sustainability = [
        { 
            label: 'CO₂ Saved', 
            value: ecoStats.totalCO2Saved, 
            icon: 'leaf', 
            color: ['#4ade80', '#16a34a'], 
            percent: '+12%', 
            percentColor: '#16a34a', 
            bg: '#f0fdf4' 
        },
        { 
            label: 'Distance Walked', 
            value: ecoStats.totalDistanceWalked, 
            icon: 'walk', 
            color: ['#3b82f6', '#1e40af'], 
            percent: '+8%', 
            percentColor: '#2563eb', 
            bg: '#eff6ff' 
        },
        { 
            label: 'Public Transport', 
            value: `${ecoStats.totalPublicTransportTrips} trips`, 
            icon: 'subway-variant', 
            color: ['#a78bfa', '#f472b6'], 
            percent: '+15%', 
            percentColor: '#a21caf', 
            bg: '#f5f3ff' 
        },
    ];

    return (
        <SafeAreaView style={styles.container}>
            <ProfileHeader 
                title="Profile" 
                onMenu={handleMenuPress}
                showBack={false}
            />
            
            <ScrollView 
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent} 
                showsVerticalScrollIndicator={false}
            >
                {/* Profile Info Card */}
                <ProfileCard 
                    profile={user}
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
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: { 
        padding: 20,
        paddingTop: 16,
        paddingBottom: 80,
    },
}); 