import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import ProfileHeader from '../components/ProfileHeader';

const transportModes = [
  {
    id: 'walk',
    name: 'Walking',
    icon: 'walk',
    description: 'Eco-friendly and healthy',
    color: ['#10b981', '#059669'],
    selected: true,
  },
  {
    id: 'bike',
    name: 'Cycling',
    icon: 'bike',
    description: 'Fast and sustainable',
    color: ['#3b82f6', '#1d4ed8'],
    selected: false,
  },
  {
    id: 'bus',
    name: 'Public Bus',
    icon: 'bus',
    description: 'Affordable and reliable',
    color: ['#f59e0b', '#d97706'],
    selected: false,
  },
  {
    id: 'train',
    name: 'Train/Metro',
    icon: 'train',
    description: 'Fast and efficient',
    color: ['#8b5cf6', '#7c3aed'],
    selected: false,
  },
  {
    id: 'car',
    name: 'Car',
    icon: 'car',
    description: 'Convenient but less eco-friendly',
    color: ['#ef4444', '#dc2626'],
    selected: false,
  },
  {
    id: 'auto',
    name: 'Auto Rickshaw',
    icon: 'rickshaw',
    description: 'Local transport option',
    color: ['#06b6d4', '#0891b2'],
    selected: false,
  },
];

const preferences = [
  {
    id: 'eco',
    name: 'Eco-Friendly Priority',
    description: 'Prioritize routes with lower carbon footprint',
    icon: 'leaf',
    color: '#10b981',
    enabled: true,
  },
  {
    id: 'fast',
    name: 'Fastest Route',
    description: 'Choose the quickest route regardless of mode',
    icon: 'lightning-bolt',
    color: '#f59e0b',
    enabled: false,
  },
  {
    id: 'cheap',
    name: 'Cost Effective',
    description: 'Prioritize cheaper transportation options',
    icon: 'currency-usd',
    color: '#3b82f6',
    enabled: false,
  },
];

export default function PreferredTransportScreen({ navigation }) {
  const [selectedModes, setSelectedModes] = useState(['walk']);
  const [preferencesState, setPreferencesState] = useState(preferences);

  const handleModeToggle = (modeId) => {
    if (selectedModes.includes(modeId)) {
      if (selectedModes.length > 1) {
        setSelectedModes(selectedModes.filter(id => id !== modeId));
      }
    } else {
      setSelectedModes([...selectedModes, modeId]);
    }
  };

  const handlePreferenceToggle = (prefId) => {
    setPreferencesState(prev => 
      prev.map(pref => 
        pref.id === prefId 
          ? { ...pref, enabled: !pref.enabled }
          : pref
      )
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader 
        title="Preferred Transport" 
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
        {/* Transport Modes */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
        >
          <Text style={styles.sectionTitle}>Transport Modes</Text>
          <Text style={styles.sectionDescription}>Select your preferred transportation methods</Text>
          
          <View style={styles.modesContainer}>
            {transportModes.map((mode, index) => (
              <MotiView
                key={mode.id}
                from={{ opacity: 0, translateY: 30, scale: 0.9 }}
                animate={{ opacity: 1, translateY: 0, scale: 1 }}
                transition={{ type: 'spring', duration: 800, delay: 400 + index * 100 }}
              >
                <TouchableOpacity
                  style={[
                    styles.modeCard,
                    selectedModes.includes(mode.id) && styles.modeCardSelected
                  ]}
                  onPress={() => handleModeToggle(mode.id)}
                  activeOpacity={0.8}
                >
                  <LinearGradient 
                    colors={mode.color} 
                    style={styles.modeIconContainer}
                  >
                    <Icon name={mode.icon} size={28} color="#fff" />
                  </LinearGradient>
                  
                  <View style={styles.modeInfo}>
                    <Text style={styles.modeName}>{mode.name}</Text>
                    <Text style={styles.modeDescription}>{mode.description}</Text>
                  </View>
                  
                  {selectedModes.includes(mode.id) && (
                    <View style={styles.checkmark}>
                      <Icon name="check-circle" size={24} color="#22c55e" />
                    </View>
                  )}
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </MotiView>

        {/* Route Preferences */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 800 }}
          style={styles.preferencesSection}
        >
          <Text style={styles.sectionTitle}>Route Preferences</Text>
          <Text style={styles.sectionDescription}>Choose how routes should be prioritized</Text>
          
          <Card style={styles.preferencesCard}>
            {preferencesState.map((pref, index) => (
              <MotiView
                key={pref.id}
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 1000 + index * 100 }}
              >
                <TouchableOpacity
                  style={[styles.preferenceItem, index !== preferencesState.length - 1 && styles.preferenceBorder]}
                  onPress={() => handlePreferenceToggle(pref.id)}
                  activeOpacity={0.7}
                >
                  <View style={styles.preferenceLeft}>
                    <View style={[styles.preferenceIcon, { backgroundColor: pref.color + '20' }]}>
                      <Icon name={pref.icon} size={20} color={pref.color} />
                    </View>
                    <View style={styles.preferenceInfo}>
                      <Text style={styles.preferenceName}>{pref.name}</Text>
                      <Text style={styles.preferenceDescription}>{pref.description}</Text>
                    </View>
                  </View>
                  <View style={[styles.toggle, pref.enabled && styles.toggleActive]}>
                    <View style={[styles.toggleThumb, pref.enabled && styles.toggleThumbActive]} />
                  </View>
                </TouchableOpacity>
              </MotiView>
            ))}
          </Card>
        </MotiView>

        {/* Save Button */}
        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 1000, delay: 1200 }}
          style={styles.saveButtonContainer}
        >
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Preferences</Text>
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
  preferencesSection: {
    marginTop: 20,
  },
  modesContainer: {
    marginHorizontal: 18,
    gap: 12,
  },
  modeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    elevation: 2,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  modeCardSelected: {
    borderColor: '#22c55e',
    backgroundColor: '#f0fdf4',
  },
  modeIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  modeInfo: {
    flex: 1,
  },
  modeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 4,
  },
  modeDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
  },
  checkmark: {
    marginLeft: 8,
  },
  preferencesCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    elevation: 2,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  preferenceItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  preferenceBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  preferenceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  preferenceIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  preferenceInfo: {
    flex: 1,
  },
  preferenceName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 2,
  },
  preferenceDescription: {
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
  saveButtonContainer: {
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
