import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { ROUTE_STEPS } from '../constants/routeConstants';
import { routeTheme } from '../styles/routeTheme';

export default function JourneySteps() {
  return (
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 400 }}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Journey Steps</Text>
        <View style={styles.stepsContainer}>
          {ROUTE_STEPS.map((step, index) => {
            // Apply green theme colors to steps
            const iconBg = step.icon === 'walk' ? '#ECFDF5' : 
                           step.icon === 'train' ? '#F8FAFC' : 
                           step.iconBg;
            
            const iconColor = step.icon === 'walk' ? routeTheme.colors.primary : 
                              step.icon === 'train' ? routeTheme.colors.secondary : 
                              step.iconColor;

            return (
              <View key={step.id} style={styles.stepItem}>
                <View style={styles.stepLeft}>
                  <View style={[styles.stepIcon, { backgroundColor: iconBg }]}>
                    <Icon name={step.icon} size={18} color={iconColor} />
                  </View>
                  {index < ROUTE_STEPS.length - 1 && <View style={styles.stepLine} />}
                </View>
                <View style={styles.stepContent}>
                  <View style={styles.stepHeader}>
                    <Text style={styles.stepTitle}>{step.title}</Text>
                    <Text style={styles.stepDuration}>{step.duration}</Text>
                  </View>
                  <Text style={styles.stepDescription}>
                    {step.stops ? `${step.stops} • ${step.description}` : 
                     step.distance ? `${step.distance} • ${step.description}` : step.description}
                  </Text>
                  <View style={styles.stepFeatures}>
                    {step.features.map((feature, idx) => (
                      <View key={idx} style={styles.stepFeature}>
                        <Text style={styles.stepFeatureText}>{feature}</Text>
                      </View>
                    ))}
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      </View>
    </MotiView>
  );
}

const styles = StyleSheet.create({
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: routeTheme.colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
    marginBottom: 16,
  },
  stepsContainer: {
    gap: 16,
  },
  stepItem: {
    flexDirection: 'row',
  },
  stepLeft: {
    alignItems: 'center',
    marginRight: 16,
  },
  stepIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepLine: {
    width: 2,
    height: 48,
    backgroundColor: routeTheme.colors.border,
    borderRadius: 1,
    marginTop: 8,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: routeTheme.colors.borderLight,
  },
  stepHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 4,
  },
  stepTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: routeTheme.colors.textPrimary,
    fontFamily: 'Poppins_700Bold',
  },
  stepDuration: {
    fontSize: 14,
    color: routeTheme.colors.textSecondary,
    fontFamily: 'Urbanist_400Regular',
  },
  stepDescription: {
    fontSize: 14,
    color: routeTheme.colors.textSecondary,
    fontFamily: 'Urbanist_400Regular',
    marginBottom: 8,
  },
  stepFeatures: {
    flexDirection: 'row',
    gap: 8,
  },
  stepFeature: {
    backgroundColor: routeTheme.colors.surfaceVariant,
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepFeatureText: {
    fontSize: 12,
    color: routeTheme.colors.textSecondary,
    fontFamily: 'Urbanist_400Regular',
  },
});
