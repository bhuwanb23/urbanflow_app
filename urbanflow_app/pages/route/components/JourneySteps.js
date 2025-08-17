import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';
import { ROUTE_STEPS } from '../constants/routeConstants';

export default function JourneySteps() {
  return (
    <MotiView from={{ opacity: 0, translateY: 20 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 600, delay: 400 }}>
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Journey Steps</Text>
        <View style={styles.stepsContainer}>
          {ROUTE_STEPS.map((step, index) => (
            <View key={step.id} style={styles.stepItem}>
              <View style={styles.stepLeft}>
                <View style={[styles.stepIcon, { backgroundColor: step.iconBg }]}>
                  <Icon name={step.icon} size={18} color={step.iconColor} />
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
          ))}
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
    color: '#1e293b',
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
    backgroundColor: '#e2e8f0',
    borderRadius: 1,
    marginTop: 8,
  },
  stepContent: {
    flex: 1,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
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
    color: '#1e293b',
    fontFamily: 'Poppins_700Bold',
  },
  stepDuration: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
  },
  stepDescription: {
    fontSize: 14,
    color: '#64748b',
    fontFamily: 'Urbanist_400Regular',
    marginBottom: 8,
  },
  stepFeatures: {
    flexDirection: 'row',
    gap: 8,
  },
  stepFeature: {
    backgroundColor: '#f8fafc',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  stepFeatureText: {
    fontSize: 12,
    color: '#475569',
    fontFamily: 'Urbanist_400Regular',
  },
});
