import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

export default function SettingsCard({ title, settings, onSettingPress }) {
  return (
    <View style={styles.sectionWrap}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800, delay: 400 }}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
      </MotiView>
      
      <View style={styles.settingsCardWrap}>
        <Card style={styles.settingsCard}>
          {settings.map((setting, index) => (
            <MotiView
              key={setting.label}
              from={{ opacity: 0, translateX: -30 }}
              animate={{ opacity: 1, translateX: 0 }}
              transition={{ type: 'timing', duration: 600, delay: 600 + index * 100 }}
            >
              <TouchableOpacity 
                style={[styles.settingItem, index !== settings.length - 1 && styles.settingItemBorder]}
                onPress={() => onSettingPress(setting)}
                activeOpacity={0.7}
              >
                <View style={styles.settingLeft}>
                  <LinearGradient colors={setting.color} style={styles.settingIconWrap}>
                    <Icon name={setting.icon} size={22} color="#fff" />
                  </LinearGradient>
                  <Text style={styles.settingLabel}>{setting.label}</Text>
                </View>
                <Icon name="chevron-right" size={22} color="#b0bec5" />
              </TouchableOpacity>
            </MotiView>
          ))}
        </Card>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  sectionWrap: {
    marginTop: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#185a9d',
    fontFamily: 'Urbanist_700Bold',
    marginBottom: 10,
  },
  settingsCardWrap: {
    borderRadius: 22,
    marginBottom: 8,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 2,
  },
  settingsCard: {
    borderRadius: 22,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  settingItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  settingItemBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#e0eafc',
  },
  settingLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  settingIconWrap: {
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  settingLabel: {
    fontSize: 15,
    color: '#22223b',
    fontWeight: '600',
    fontFamily: 'Urbanist_400Regular',
  },
});
