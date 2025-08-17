import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function ProfileCard({ profile, onEditProfile, onEditAvatar }) {
  return (
    <MotiView
      from={{ opacity: 0, translateY: 30, scale: 0.9 }}
      animate={{ opacity: 1, translateY: 0, scale: 1 }}
      transition={{ type: 'spring', duration: 1000, delay: 200 }}
      style={styles.profileCardWrap}
    >
      <Card style={styles.profileCard}>
        <View style={styles.profileInfo}>
          <MotiView
            from={{ scale: 0, rotate: '-180deg' }}
            animate={{ scale: 1, rotate: '0deg' }}
            transition={{ type: 'spring', delay: 400, duration: 800 }}
            style={styles.avatarWrap}
          >
            <Image source={{ uri: profile.avatar }} style={styles.avatarImg} />
            <TouchableOpacity onPress={onEditAvatar} style={styles.avatarEditBtn}>
              <Icon name="camera" size={16} color="#fff" />
            </TouchableOpacity>
          </MotiView>
          
          <MotiView
            from={{ opacity: 0, translateY: 20 }}
            animate={{ opacity: 1, translateY: 0 }}
            transition={{ type: 'timing', duration: 800, delay: 600 }}
          >
            <Text style={styles.profileName}>{profile.name}</Text>
            <Text style={styles.profileEmail}>{profile.email}</Text>
          </MotiView>
          
          <MotiView
            from={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ type: 'spring', delay: 800 }}
          >
            <TouchableOpacity onPress={onEditProfile} style={styles.editProfileBtn}>
              <Icon name="pencil" size={16} color="#fff" style={{ marginRight: 6 }} />
              <Text style={styles.editProfileText}>Edit Profile</Text>
            </TouchableOpacity>
          </MotiView>
        </View>
      </Card>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  profileCardWrap: {
    marginBottom: 18,
    borderRadius: 28,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.10,
    shadowRadius: 12,
    elevation: 4,
  },
  profileCard: {
    borderRadius: 28,
    backgroundColor: '#fff',
    padding: 24,
    alignItems: 'center',
  },
  profileInfo: {
    alignItems: 'center',
    marginTop: 2,
  },
  avatarWrap: {
    position: 'relative',
    marginBottom: 10,
  },
  avatarImg: {
    width: 96,
    height: 96,
    borderRadius: 48,
    borderWidth: 4,
    borderColor: '#fff',
    backgroundColor: '#e0eafc',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.12,
    shadowRadius: 12,
    elevation: 6,
  },
  avatarEditBtn: {
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
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 3,
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1f2937',
    marginBottom: 4,
    fontFamily: 'Poppins_700Bold',
    textAlign: 'center',
  },
  profileEmail: {
    fontSize: 14,
    color: '#6b7280',
    marginBottom: 16,
    fontFamily: 'Urbanist_400Regular',
    textAlign: 'center',
  },
  editProfileBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#6366f1',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    shadowColor: '#6366f1',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 8,
    elevation: 4,
  },
  editProfileText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'Urbanist_400Regular',
  },
});
