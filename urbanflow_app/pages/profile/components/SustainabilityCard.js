import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';

export default function SustainabilityCard({ title, sustainabilityData }) {
  return (
    <View style={styles.sectionWrap}>
      <MotiView
        from={{ opacity: 0, translateY: 20 }}
        animate={{ opacity: 1, translateY: 0 }}
        transition={{ type: 'timing', duration: 800, delay: 600 }}
      >
        <Text style={styles.sectionTitle}>{title}</Text>
      </MotiView>
      
      <View style={styles.sustainCardWrap}>
        <Card style={styles.sustainCard}>
          {sustainabilityData.map((item, index) => (
            <MotiView
              key={item.label}
              from={{ opacity: 0, translateY: 30, scale: 0.9 }}
              animate={{ opacity: 1, translateY: 0, scale: 1 }}
              transition={{ type: 'spring', duration: 800, delay: 800 + index * 150 }}
            >
              <View style={styles.sustainItem}>
                <LinearGradient colors={item.color} style={styles.sustainIconWrap}>
                  <Icon name={item.icon} size={24} color="#fff" />
                </LinearGradient>
                <View style={styles.sustainInfo}>
                  <Text style={styles.sustainLabel}>{item.label}</Text>
                  <Text style={styles.sustainValue}>{item.value}</Text>
                </View>
                <View style={styles.sustainStats}>
                  <Text style={[styles.sustainPercent, { color: item.percentColor }]}>
                    {item.percent}
                  </Text>
                  <Text style={styles.sustainMonth}>This month</Text>
                </View>
              </View>
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
    paddingHorizontal: 18,
  },
  sectionTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#185a9d',
    fontFamily: 'Urbanist_700Bold',
    marginBottom: 10,
  },
  sustainCardWrap: {
    borderRadius: 22,
    marginBottom: 8,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.10,
    shadowRadius: 10,
    elevation: 2,
  },
  sustainCard: {
    borderRadius: 22,
    backgroundColor: '#fff',
    overflow: 'hidden',
  },
  sustainItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: 'transparent',
  },
  sustainIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  sustainInfo: {
    flex: 1,
  },
  sustainLabel: {
    fontSize: 15,
    color: '#22223b',
    fontWeight: '600',
    fontFamily: 'Urbanist_400Regular',
  },
  sustainValue: {
    fontSize: 20,
    color: '#185a9d',
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
  },
  sustainStats: {
    alignItems: 'flex-end',
  },
  sustainPercent: {
    fontSize: 15,
    fontWeight: '700',
    fontFamily: 'Montserrat_700Bold',
  },
  sustainMonth: {
    fontSize: 12,
    color: '#b0bec5',
    fontFamily: 'Urbanist_400Regular',
  },
});
