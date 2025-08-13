import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import ProfileHeader from '../components/ProfileHeader';

const privacySettings = [
  {
    id: 'location',
    name: 'Location Services',
    description: 'Allow app to access your location for route planning',
    icon: 'map-marker',
    color: '#3b82f6',
    enabled: true,
  },
  {
    id: 'analytics',
    name: 'Analytics & Usage',
    description: 'Help improve the app by sharing usage data',
    icon: 'chart-line',
    color: '#10b981',
    enabled: true,
  },
  {
    id: 'personalization',
    name: 'Personalization',
    description: 'Use your data to personalize recommendations',
    icon: 'account-cog',
    color: '#8b5cf6',
    enabled: false,
  },
  {
    id: 'notifications',
    name: 'Push Notifications',
    description: 'Receive important updates and alerts',
    icon: 'bell',
    color: '#f59e0b',
    enabled: true,
  },
  {
    id: 'third_party',
    name: 'Third-Party Services',
    description: 'Allow data sharing with trusted partners',
    icon: 'share-variant',
    color: '#ef4444',
    enabled: false,
  },
];

const dataOptions = [
  {
    id: 'export',
    name: 'Export My Data',
    description: 'Download a copy of your personal data',
    icon: 'download',
    color: '#06b6d4',
  },
  {
    id: 'delete',
    name: 'Delete Account',
    description: 'Permanently delete your account and data',
    icon: 'delete',
    color: '#ef4444',
  },
];

export default function PrivacyScreen({ navigation }) {
  const [privacyState, setPrivacyState] = useState(privacySettings);

  const handlePrivacyToggle = (id) => {
    setPrivacyState(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  const handleDataAction = (action) => {
    if (action === 'export') {
      // Handle data export
      console.log('Exporting data...');
    } else if (action === 'delete') {
      // Handle account deletion
      console.log('Deleting account...');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader 
        title="Privacy & Security" 
        onBack={() => navigation.goBack()}
        showBack={true}
        onMenu={() => {}}
      />
      
      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Privacy Settings */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
        >
          <Text style={styles.sectionTitle}>Privacy Settings</Text>
          <Text style={styles.sectionDescription}>Control how your data is used</Text>
          
          <Card style={styles.card}>
            {privacyState.map((setting, index) => (
              <MotiView
                key={setting.id}
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 400 + index * 100 }}
              >
                <TouchableOpacity
                  style={[styles.privacyItem, index !== privacyState.length - 1 && styles.itemBorder]}
                  onPress={() => handlePrivacyToggle(setting.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.privacyLeft}>
                    <View style={[styles.privacyIcon, { backgroundColor: setting.color + '20' }]}>
                      <Icon name={setting.icon} size={20} color={setting.color} />
                    </View>
                    <View style={styles.privacyInfo}>
                      <Text style={styles.privacyName}>{setting.name}</Text>
                      <Text style={styles.privacyDescription}>{setting.description}</Text>
                    </View>
                  </View>
                  <View style={[styles.toggle, setting.enabled && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, setting.enabled && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}
          </Card>
        </MotiView>

        {/* Data Management */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 800 }}
          style={styles.dataSection}
        >
          <Text style={styles.sectionTitle}>Data Management</Text>
          <Text style={styles.sectionDescription}>Manage your personal data</Text>
          
          <Card style={styles.card}>
            {dataOptions.map((option, index) => (
              <MotiView
                key={option.id}
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 1000 + index * 100 }}
              >
                <TouchableOpacity
                  style={[styles.dataItem, index !== dataOptions.length - 1 && styles.itemBorder]}
                  onPress={() => handleDataAction(option.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.dataLeft}>
                    <View style={[styles.dataIcon, { backgroundColor: option.color + '20' }]}>
                      <Icon name={option.icon} size={20} color={option.color} />
                    </View>
                    <View style={styles.dataInfo}>
                      <Text style={styles.dataName}>{option.name}</Text>
                      <Text style={styles.dataDescription}>{option.description}</Text>
                    </View>
                  </View>
                  <Icon name="chevron-right" size={20} color="#b0bec5" />
                </TouchableOpacity>
              </MotiView>
            ))}
          </Card>
        </MotiView>

        {/* Privacy Policy Info */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 1200 }}
          style={styles.infoSection}
        >
          <Card style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Icon name="shield-check" size={24} color="#10b981" />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Your Data is Secure</Text>
                <Text style={styles.infoDescription}>
                  We use industry-standard encryption to protect your personal information. 
                  Your data is never sold to third parties.
                </Text>
              </View>
            </View>
          </Card>
        </MotiView>

        {/* Privacy Policy Links */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 1400 }}
          style={styles.linksSection}
        >
          <View style={styles.linksContainer}>
            <TouchableOpacity style={styles.linkButton} activeOpacity={0.7}>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} activeOpacity={0.7}>
              <Text style={styles.linkText}>Terms of Service</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.linkButton} activeOpacity={0.7}>
              <Text style={styles.linkText}>Data Processing</Text>
            </TouchableOpacity>
          </View>
        </MotiView>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  scrollContent: {
    paddingBottom: 100, // Increased for tab bar
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#185a9d',
    fontFamily: 'Urbanist_700Bold',
    marginBottom: 8,
    marginHorizontal: 18,
    marginTop: 20,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
    marginBottom: 16,
    marginHorizontal: 18,
  },
  dataSection: {
    marginTop: 20,
  },
  infoSection: {
    marginTop: 20,
  },
  linksSection: {
    marginTop: 20,
  },
  card: {
    marginHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  privacyItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  dataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  itemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  privacyLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dataLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  privacyIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  dataIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  privacyInfo: {
    flex: 1,
  },
  dataInfo: {
    flex: 1,
  },
  privacyName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 2,
  },
  dataName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 2,
  },
  privacyDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
  },
  dataDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
  },
  toggle: {
    width: 48,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#e5e7eb',
    padding: 2,
  },
  toggleActive: {
    backgroundColor: '#22c55e',
  },
  toggleThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
  },
  toggleThumbActive: {
    transform: [{ translateX: 24 }],
  },
  infoCard: {
    marginHorizontal: 18,
    borderRadius: 16,
    backgroundColor: '#f0fdf4',
    borderWidth: 1,
    borderColor: '#bbf7d0',
  },
  infoContent: {
    flexDirection: 'row',
    padding: 16,
    alignItems: 'flex-start',
  },
  infoText: {
    flex: 1,
    marginLeft: 12,
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#166534',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#475569',
    fontFamily: 'Urbanist_400Regular',
    lineHeight: 20,
  },
  linksContainer: {
    marginHorizontal: 18,
    gap: 12,
  },
  linkButton: {
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 16,
    paddingHorizontal: 20,
    alignItems: 'center',
    elevation: 1,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  linkText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#3b82f6',
    fontFamily: 'Urbanist_600SemiBold',
  },
});
