import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity, TextInput, Image } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import ProfileHeader from '../components/ProfileHeader';

export default function EditProfileScreen({ navigation }) {
  const [profileData, setProfileData] = useState({
    name: 'Bhuwan B',
    email: 'bhuwan.b@urbanflow.com',
    phone: '+1 (555) 123-4567',
    bio: 'Passionate about sustainable transportation and eco-friendly commuting.',
    avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
  });

  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    setIsEditing(false);
    // Here you would typically save the data to your backend
    console.log('Saving profile data:', profileData);
  };

  const handleCancel = () => {
    setIsEditing(false);
    // Reset to original data
    setProfileData({
      name: 'Bhuwan B',
      email: 'bhuwan.b@urbanflow.com',
      phone: '+1 (555) 123-4567',
      bio: 'Passionate about sustainable transportation and eco-friendly commuting.',
      avatar: 'https://storage.googleapis.com/uxpilot-auth.appspot.com/avatars/avatar-2.jpg',
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader 
        title="Edit Profile" 
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
        {/* Avatar Section */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
        >
          <View style={styles.avatarSection}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: profileData.avatar }} style={styles.avatar} />
              <TouchableOpacity style={styles.avatarEditButton} activeOpacity={0.8}>
                <Icon name="camera" size={20} color="#fff" />
              </TouchableOpacity>
            </View>
            <Text style={styles.avatarText}>Tap to change photo</Text>
          </View>
        </MotiView>

        {/* Profile Form */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 400 }}
          style={styles.formSection}
        >
          <Card style={styles.formCard}>
            {/* Name Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Full Name</Text>
              <TextInput
                style={styles.textInput}
                value={profileData.name}
                onChangeText={(text) => setProfileData({ ...profileData, name: text })}
                placeholder="Enter your full name"
                editable={isEditing}
              />
            </View>

            {/* Email Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Email Address</Text>
              <TextInput
                style={styles.textInput}
                value={profileData.email}
                onChangeText={(text) => setProfileData({ ...profileData, email: text })}
                placeholder="Enter your email"
                keyboardType="email-address"
                editable={isEditing}
              />
            </View>

            {/* Phone Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Phone Number</Text>
              <TextInput
                style={styles.textInput}
                value={profileData.phone}
                onChangeText={(text) => setProfileData({ ...profileData, phone: text })}
                placeholder="Enter your phone number"
                keyboardType="phone-pad"
                editable={isEditing}
              />
            </View>

            {/* Bio Field */}
            <View style={styles.inputGroup}>
              <Text style={styles.inputLabel}>Bio</Text>
              <TextInput
                style={[styles.textInput, styles.bioInput]}
                value={profileData.bio}
                onChangeText={(text) => setProfileData({ ...profileData, bio: text })}
                placeholder="Tell us about yourself"
                multiline
                numberOfLines={3}
                editable={isEditing}
              />
            </View>
          </Card>
        </MotiView>

        {/* Action Buttons */}
        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 1000, delay: 600 }}
          style={styles.actionSection}
        >
          {!isEditing ? (
            <TouchableOpacity 
              style={styles.editButton} 
              onPress={() => setIsEditing(true)}
              activeOpacity={0.8}
            >
              <Icon name="pencil" size={20} color="#fff" />
              <Text style={styles.editButtonText}>Edit Profile</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.buttonGroup}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={handleCancel}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.saveButton} 
                onPress={handleSave}
                activeOpacity={0.8}
              >
                <Icon name="check" size={20} color="#fff" />
                <Text style={styles.saveButtonText}>Save Changes</Text>
              </TouchableOpacity>
            </View>
          )}
        </MotiView>

        {/* Additional Options */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 800 }}
          style={styles.optionsSection}
        >
          <Card style={styles.optionsCard}>
            <TouchableOpacity style={styles.optionItem} activeOpacity={0.7}>
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <Icon name="lock" size={20} color="#3b82f6" />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>Change Password</Text>
                  <Text style={styles.optionDescription}>Update your account password</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color="#b0bec5" />
            </TouchableOpacity>

            <TouchableOpacity style={styles.optionItem} activeOpacity={0.7}>
              <View style={styles.optionLeft}>
                <View style={styles.optionIcon}>
                  <Icon name="email" size={20} color="#10b981" />
                </View>
                <View style={styles.optionInfo}>
                  <Text style={styles.optionTitle}>Email Preferences</Text>
                  <Text style={styles.optionDescription}>Manage email notifications</Text>
                </View>
              </View>
              <Icon name="chevron-right" size={20} color="#b0bec5" />
            </TouchableOpacity>
          </Card>
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
  avatarSection: {
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 20,
  },
  avatarContainer: {
    position: 'relative',
    marginBottom: 12,
  },
  avatar: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#e0eafc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarEditButton: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#22c55e',
    borderWidth: 3,
    borderColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#22c55e',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.18,
    shadowRadius: 8,
    elevation: 4,
  },
  avatarText: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
  },
  formSection: {
  },
  formCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 20,
    elevation: 2,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  inputGroup: {
    marginBottom: 20,
  },
  inputLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#374151',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 8,
  },
  textInput: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1f2937',
    fontFamily: 'Urbanist_400Regular',
    backgroundColor: '#f9fafb',
  },
  bioInput: {
    height: 80,
    textAlignVertical: 'top',
  },
  actionSection: {
    marginTop: 24,
  },
  editButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#3b82f6',
    borderRadius: 16,
    paddingVertical: 16,
    elevation: 2,
    shadowColor: '#3b82f6',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
  },
  editButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Urbanist_700Bold',
    marginLeft: 8,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  cancelButton: {
    flex: 1,
    backgroundColor: '#f3f4f6',
    borderRadius: 16,
    paddingVertical: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#d1d5db',
  },
  cancelButtonText: {
    color: '#374151',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'Urbanist_600SemiBold',
  },
  saveButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#22c55e',
    borderRadius: 16,
    paddingVertical: 16,
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
    marginLeft: 8,
  },
  optionsSection: {
    marginTop: 24,
  },
  optionsCard: {
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
  optionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eff6ff',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  optionInfo: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
  },
});
