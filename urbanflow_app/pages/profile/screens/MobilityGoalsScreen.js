import React, { useState } from 'react';
import { SafeAreaView, View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { MotiView } from 'moti';
import ProfileHeader from '../components/ProfileHeader';

const goalTypes = [
  {
    id: 'walking',
    name: 'Walking Goal',
    description: 'Set daily/weekly walking distance targets',
    icon: 'walk',
    color: ['#10b981', '#059669'],
    current: '3.2 km',
    target: '5 km',
    unit: 'km',
  },
  {
    id: 'cycling',
    name: 'Cycling Goal',
    description: 'Track your cycling achievements',
    icon: 'bike',
    color: ['#3b82f6', '#1d4ed8'],
    current: '12 km',
    target: '20 km',
    unit: 'km',
  },
  {
    id: 'public_transport',
    name: 'Public Transport',
    description: 'Use public transport more often',
    icon: 'bus',
    color: ['#f59e0b', '#d97706'],
    current: '8',
    target: '12',
    unit: 'trips',
  },
  {
    id: 'eco_friendly',
    name: 'Eco-Friendly Travel',
    description: 'Reduce carbon footprint',
    icon: 'leaf',
    color: ['#22c55e', '#16a34a'],
    current: '15 kg',
    target: '25 kg',
    unit: 'CO₂ saved',
  },
];

const timeframes = [
  { id: 'daily', name: 'Daily', selected: false },
  { id: 'weekly', name: 'Weekly', selected: true },
  { id: 'monthly', name: 'Monthly', selected: false },
];

export default function MobilityGoalsScreen({ navigation }) {
  const [selectedTimeframe, setSelectedTimeframe] = useState('weekly');

  const handleTimeframeSelect = (timeframeId) => {
    setSelectedTimeframe(timeframeId);
  };

  const calculateProgress = (current, target) => {
    const currentNum = parseFloat(current);
    const targetNum = parseFloat(target);
    return Math.min((currentNum / targetNum) * 100, 100);
  };

  return (
    <SafeAreaView style={styles.container}>
      <ProfileHeader 
        title="Mobility Goals" 
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
        {/* Timeframe Selection */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 200 }}
        >
          <Text style={styles.sectionTitle}>Goal Timeframe</Text>
          <View style={styles.timeframeContainer}>
            {timeframes.map((timeframe, index) => (
              <MotiView
                key={timeframe.id}
                from={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: 'spring', duration: 600, delay: 400 + index * 100 }}
              >
                <TouchableOpacity
                  style={[
                    styles.timeframeButton,
                    selectedTimeframe === timeframe.id && styles.timeframeButtonActive
                  ]}
                  onPress={() => handleTimeframeSelect(timeframe.id)}
                  activeOpacity={0.8}
                >
                  <Text style={[
                    styles.timeframeText,
                    selectedTimeframe === timeframe.id && styles.timeframeTextActive
                  ]}>
                    {timeframe.name}
                  </Text>
                </TouchableOpacity>
              </MotiView>
            ))}
          </View>
        </MotiView>

        {/* Goals List */}
        <MotiView
          from={{ opacity: 0, translateY: 30 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'timing', duration: 800, delay: 600 }}
          style={styles.goalsSection}
        >
          <Text style={styles.sectionTitle}>Your Goals</Text>
          
          <View style={styles.goalsContainer}>
            {goalTypes.map((goal, index) => {
              const progress = calculateProgress(goal.current, goal.target);
              return (
                <MotiView
                  key={goal.id}
                  from={{ opacity: 0, translateY: 30, scale: 0.9 }}
                  animate={{ opacity: 1, translateY: 0, scale: 1 }}
                  transition={{ type: 'spring', duration: 800, delay: 800 + index * 150 }}
                >
                  <Card style={styles.goalCard}>
                    <View style={styles.goalHeader}>
                      <LinearGradient colors={goal.color} style={styles.goalIconContainer}>
                        <Icon name={goal.icon} size={24} color="#fff" />
                      </LinearGradient>
                      <View style={styles.goalInfo}>
                        <Text style={styles.goalName}>{goal.name}</Text>
                        <Text style={styles.goalDescription}>{goal.description}</Text>
                      </View>
                    </View>
                    
                    <View style={styles.goalProgress}>
                      <View style={styles.progressBar}>
                        <View style={[styles.progressFill, { width: `${progress}%`, backgroundColor: goal.color[0] }]} />
                      </View>
                      <View style={styles.progressText}>
                        <Text style={styles.progressCurrent}>{goal.current}</Text>
                        <Text style={styles.progressTarget}>/ {goal.target} {goal.unit}</Text>
                      </View>
                    </View>
                    
                    <TouchableOpacity style={styles.editGoalButton} activeOpacity={0.7}>
                      <Icon name="pencil" size={16} color="#3b82f6" />
                      <Text style={styles.editGoalText}>Edit Goal</Text>
                    </TouchableOpacity>
                  </Card>
                </MotiView>
              );
            })}
          </View>
        </MotiView>

        {/* Add New Goal Button */}
        <MotiView
          from={{ opacity: 0, translateY: 40 }}
          animate={{ opacity: 1, translateY: 0 }}
          transition={{ type: 'spring', duration: 1000, delay: 1200 }}
          style={styles.addGoalContainer}
        >
          <TouchableOpacity style={styles.addGoalButton} activeOpacity={0.8}>
            <Icon name="plus" size={24} color="#fff" />
            <Text style={styles.addGoalText}>Add New Goal</Text>
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
    marginBottom: 16,
    marginHorizontal: 18,
    marginTop: 20,
  },
  goalsSection: {
    marginTop: 20,
  },
  timeframeContainer: {
    flexDirection: 'row',
    marginHorizontal: 18,
    gap: 12,
  },
  timeframeButton: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    paddingVertical: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#e5e7eb',
  },
  timeframeButtonActive: {
    borderColor: '#3b82f6',
    backgroundColor: '#eff6ff',
  },
  timeframeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#6b7280',
    fontFamily: 'Urbanist_600SemiBold',
  },
  timeframeTextActive: {
    color: '#3b82f6',
  },
  goalsContainer: {
    marginHorizontal: 18,
    gap: 16,
  },
  goalCard: {
    borderRadius: 16,
    backgroundColor: '#fff',
    padding: 20,
    elevation: 2,
    shadowColor: '#185a9d',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  goalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  goalIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  goalInfo: {
    flex: 1,
  },
  goalName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1f2937',
    fontFamily: 'Urbanist_600SemiBold',
    marginBottom: 4,
  },
  goalDescription: {
    fontSize: 14,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
  },
  goalProgress: {
    marginBottom: 16,
  },
  progressBar: {
    height: 8,
    backgroundColor: '#e5e7eb',
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  progressCurrent: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1f2937',
    fontFamily: 'Montserrat_700Bold',
  },
  progressTarget: {
    fontSize: 16,
    color: '#6b7280',
    fontFamily: 'Urbanist_400Regular',
  },
  editGoalButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 8,
  },
  editGoalText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#3b82f6',
    fontFamily: 'Urbanist_600SemiBold',
    marginLeft: 4,
  },
  addGoalContainer: {
    marginHorizontal: 18,
    marginTop: 32,
  },
  addGoalButton: {
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
  addGoalText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'Urbanist_700Bold',
    marginLeft: 8,
  },
});
