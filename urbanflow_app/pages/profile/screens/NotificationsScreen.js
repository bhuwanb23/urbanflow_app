import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import ProfileHeader from '../components/ProfileHeader';

const notificationTypes = [
  {
    id: 'route',
    name: 'Route Updates',
    description: 'Real-time updates about your planned routes',
    icon: 'map-marker-path',
    color: '#3b82f6',
    enabled: true,
  },
  {
    id: 'traffic',
    name: 'Traffic Alerts',
    description: 'Get notified about traffic conditions',
    icon: 'car-alert',
    color: '#f59e0b',
    enabled: true,
  },
  {
    id: 'weather',
    name: 'Weather Updates',
    description: 'Weather conditions affecting your commute',
    icon: 'weather-partly-cloudy',
    color: '#06b6d4',
    enabled: false,
  },
  {
    id: 'eco',
    name: 'Eco Achievements',
    description: 'Celebrate your sustainability milestones',
    icon: 'leaf',
    color: '#10b981',
    enabled: true,
  },
  {
    id: 'promo',
    name: 'Promotions & Offers',
    description: 'Special deals on transportation services',
    icon: 'gift',
    color: '#8b5cf6',
    enabled: false,
  },
  {
    id: 'maintenance',
    name: 'Service Updates',
    description: 'App updates and maintenance notifications',
    icon: 'tools',
    color: '#6b7280',
    enabled: true,
  },
];

const notificationSettings = [
  {
    id: 'sound',
    name: 'Sound & Vibration',
    description: 'Play sounds and vibrate for notifications',
    enabled: true,
  },
  {
    id: 'banner',
    name: 'Banner Notifications',
    description: 'Show notifications as banners',
    enabled: true,
  },
  {
    id: 'badge',
    name: 'App Badge',
    description: 'Show notification count on app icon',
    enabled: false,
  },
  {
    id: 'quiet',
    name: 'Quiet Hours',
    description: 'Silence notifications during quiet hours',
    enabled: true,
  },
];

export default function NotificationsScreen({ navigation }) {
  const [notifications, setNotifications] = useState(notificationTypes);
  const [settings, setSettings] = useState(notificationSettings);

  const handleNotificationToggle = (id) => {
    setNotifications(prev => 
      prev.map(notif => 
        notif.id === id 
          ? { ...notif, enabled: !notif.enabled }
          : notif
      )
    );
  };

  const handleSettingToggle = (id) => {
    setSettings(prev => 
      prev.map(setting => 
        setting.id === id 
          ? { ...setting, enabled: !setting.enabled }
          : setting
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader 
        title="Notifications" 
        onBack={() => navigation.goBack()}
        showBack={true}
        onMenu={() => {}}
      />
      
      <ScrollView 
        style={{ flex: 1 }}
        contentContainerStyle={styles.scrollContent} 
        showsVerticalScrollIndicator={true}
        bounces={true}
        alwaysBounceVertical={true}
        keyboardShouldPersistTaps="handled"
        nestedScrollEnabled={true}
        scrollEventThrottle={16}
      >
        {/* Notification Types */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
        >
          <Text style={styles.sectionTitle}>Notification Types</Text>
          <Text style={styles.sectionDescription}>Choose what notifications you want to receive</Text>
          
          <Card style={styles.card}>
            {notifications.map((notif, index) => (
              <MotiView
                key={notif.id}
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 400 + index * 100 }}
              >
                <TouchableOpacity
                  style={[styles.notificationItem, index !== notifications.length - 1 && styles.itemBorder]}
                  onPress={() => handleNotificationToggle(notif.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.notificationLeft}>
                    <View style={[styles.notificationIcon, { backgroundColor: notif.color + '20' }]}>
                      <Icon name={notif.icon} size={20} color={notif.color} />
                    </View>
                    <View style={styles.notificationInfo}>
                      <Text style={styles.notificationName}>{notif.name}</Text>
                      <Text style={styles.notificationDescription}>{notif.description}</Text>
                    </View>
                  </View>
                  <View style={[styles.toggle, notif.enabled && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, notif.enabled && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}
          </Card>
        </MotiView>

        {/* Notification Settings */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 800 }}
          style={styles.settingsSection}
        >
          <Text style={styles.sectionTitle}>Notification Settings</Text>
          <Text style={styles.sectionDescription}>Customize how notifications are delivered</Text>
          
          <Card style={styles.card}>
            {settings.map((setting, index) => (
              <MotiView
                key={setting.id}
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 1000 + index * 100 }}
              >
                <TouchableOpacity
                  style={[styles.notificationItem, index !== settings.length - 1 && styles.itemBorder]}
                  onPress={() => handleSettingToggle(setting.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.notificationLeft}>
                    <View style={styles.notificationInfo}>
                      <Text style={styles.notificationName}>{setting.name}</Text>
                      <Text style={styles.notificationDescription}>{setting.description}</Text>
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

        {/* Quiet Hours Info */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 1200 }}
          style={styles.infoSection}
        >
          <Card style={styles.infoCard}>
            <View style={styles.infoContent}>
              <Icon name="information" size={24} color="#3b82f6" />
              <View style={styles.infoText}>
                <Text style={styles.infoTitle}>Quiet Hours</Text>
                <Text style={styles.infoDescription}>
                  Notifications will be silenced from 10:00 PM to 7:00 AM. You can customize these hours in your device settings.
                </Text>
              </View>
            </View>
          </Card>
        </MotiView>

        {/* Save Button */}
        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 1000, delay: 1400 }}
          style={styles.saveButtonContainer}
        >
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Settings</Text>
          </TouchableOpacity>
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
    padding: 20,
    paddingBottom: 80, // Reduced to match working screens
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#185a9d',
    fontFamily: 'Urbanist_700Bold',
    marginBottom: 8,
    marginTop: 20,
  },
  sectionDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
    marginBottom: 16,
  },
  settingsSection: {
    marginTop: 20,
  },
  infoSection: {
    marginTop: 20,
  },
  card: {
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  notificationItem: {
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
  notificationLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  notificationIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  notificationInfo: {
    flex: 1,
  },
  notificationName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 2,
  },
  notificationDescription: {
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
    backgroundColor: '#eff6ff',
    borderWidth: 1,
    borderColor: '#dbeafe',
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
    color: '#1e40af',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 4,
  },
  infoDescription: {
    fontSize: 14,
    color: '#475569',
    fontFamily: 'Urbanist_400Regular',
    lineHeight: 20,
  },
  saveButtonContainer: {
    marginHorizontal: 18,
    marginTop: 32,
  },
  saveButton: {
    backgroundColor: '#22c55e',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    elevation: 2,
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Urbanist_700Bold',
  },
});
