import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import ProfileHeader from '../components/ProfileHeader';

const languages = [
  { code: 'en', name: 'English', flag: '🇺🇸', selected: true },
  { code: 'es', name: 'Español', flag: '🇪🇸', selected: false },
  { code: 'fr', name: 'Français', flag: '🇫🇷', selected: false },
  { code: 'de', name: 'Deutsch', flag: '🇩🇪', selected: false },
  { code: 'hi', name: 'हिंदी', flag: '🇮🇳', selected: false },
  { code: 'zh', name: '中文', flag: '🇨🇳', selected: false },
];

const regions = [
  { code: 'US', name: 'United States', flag: '🇺🇸', selected: true },
  { code: 'IN', name: 'India', flag: '🇮🇳', selected: false },
  { code: 'UK', name: 'United Kingdom', flag: '🇬🇧', selected: false },
  { code: 'CA', name: 'Canada', flag: '🇨🇦', selected: false },
  { code: 'AU', name: 'Australia', flag: '🇦🇺', selected: false },
  { code: 'DE', name: 'Germany', flag: '🇩🇪', selected: false },
];

export default function LanguageRegionScreen({ navigation }) {
  const [selectedLanguage, setSelectedLanguage] = useState('en');
  const [selectedRegion, setSelectedRegion] = useState('US');

  const handleLanguageSelect = (code) => {
    setSelectedLanguage(code);
  };

  const handleRegionSelect = (code) => {
    setSelectedRegion(code);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader 
        title="Language & Region" 
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
        {/* Language Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
        >
          <Text style={styles.sectionTitle}>Language</Text>
          <Card style={styles.card}>
            {languages.map((lang, index) => (
              <MotiView
                key={lang.code}
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 400 + index * 100 }}
              >
                <TouchableOpacity
                  style={[styles.optionItem, index !== languages.length - 1 && styles.optionBorder]}
                  onPress={() => handleLanguageSelect(lang.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionLeft}>
                    <Text style={styles.flag}>{lang.flag}</Text>
                    <Text style={styles.optionName}>{lang.name}</Text>
                  </View>
                  {selectedLanguage === lang.code && (
                    <Icon name="check-circle" size={24} color="#22c55e" />
                  )}
                </TouchableOpacity>
              </MotiView>
            ))}
          </Card>
        </MotiView>

        {/* Region Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 600 }}
          style={styles.regionSection}
        >
          <Text style={styles.sectionTitle}>Region</Text>
          <Card style={styles.card}>
            {regions.map((region, index) => (
              <MotiView
                key={region.code}
                from={{ opacity: 0, translateX: -30 }}
                animate={{ opacity: 1, translateX: 0 }}
                transition={{ type: 'timing', duration: 600, delay: 800 + index * 100 }}
              >
                <TouchableOpacity
                  style={[styles.optionItem, index !== regions.length - 1 && styles.optionBorder]}
                  onPress={() => handleRegionSelect(region.code)}
                  activeOpacity={0.7}
                >
                  <View style={styles.optionLeft}>
                    <Text style={styles.flag}>{region.flag}</Text>
                    <Text style={styles.optionName}>{region.name}</Text>
                  </View>
                  {selectedRegion === region.code && (
                    <Icon name="check-circle" size={24} color="#22c55e" />
                  )}
                </TouchableOpacity>
              </MotiView>
            ))}
          </Card>
        </MotiView>

        {/* Save Button */}
        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 1000, delay: 1000 }}
          style={styles.saveButtonContainer}
        >
          <TouchableOpacity style={styles.saveButton} activeOpacity={0.8}>
            <Text style={styles.saveButtonText}>Save Changes</Text>
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
    paddingBottom: 80, // Reduced to match working screens
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#185a9d',
    fontFamily: 'Urbanist_700Bold',
    marginBottom: 12,
    marginHorizontal: 18,
    marginTop: 20,
  },
  regionSection: {
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
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  optionBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
  },
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  flag: {
    fontSize: 24,
    marginRight: 12,
  },
  optionName: {
    fontSize: 16,
    color: '#1f2937',
    fontWeight: '500',
    fontFamily: 'Urbanist_500Medium',
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
