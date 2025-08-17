import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, SafeAreaView, ActivityIndicator, Alert } from 'react-native';

// Import API hooks
import { useEcoStats } from '../../utils/hooks/useAPI';

// Import components
import EcoHeader from './components/EcoHeader';
import StatCard from './components/StatCard';
import TransportCard from './components/TransportCard';
import EcoChart from './components/EcoChart';
import AchievementCard from './components/AchievementCard';
import GoalCard from './components/GoalCard';

export default function EcoStatsScreen() {
    const { 
        ecoStats, 
        fetchEcoStats, 
        getWeeklyStats, 
        getMonthlyStats,
        getAchievements,
        loading, 
        error 
    } = useEcoStats();
    
    const [selectedPeriod, setSelectedPeriod] = useState('week');
    const [achievements, setAchievements] = useState([]);

    useEffect(() => {
        loadEcoStats();
        loadAchievements();
    }, []);

    const loadEcoStats = async () => {
        try {
            await fetchEcoStats({ period: selectedPeriod });
        } catch (err) {
            console.log('Error loading eco stats:', err.message);
        }
    };

    const loadAchievements = async () => {
        try {
            const achievementsData = await getAchievements();
            setAchievements(achievementsData || []);
        } catch (err) {
            console.log('Error loading achievements:', err.message);
        }
    };

    const handlePeriodChange = async (period) => {
        setSelectedPeriod(period);
        try {
            if (period === 'week') {
                await getWeeklyStats();
            } else if (period === 'month') {
                await getMonthlyStats();
            } else {
                await fetchEcoStats({ period });
            }
        } catch (err) {
            console.log('Error changing period:', err.message);
        }
    };

    // Show error alert if there's an API error
    useEffect(() => {
        if (error) {
            Alert.alert('Error', error, [
                { text: 'Retry', onPress: loadEcoStats },
                { text: 'OK' }
            ]);
        }
    }, [error]);

    if (loading && !ecoStats) {
        return (
            <SafeAreaView style={styles.loadingContainer}>
                <ActivityIndicator size="large" color="#10B981" />
                <Text style={styles.loadingText}>Loading stats...</Text>
            </SafeAreaView>
        );
    }

    // Extract data from API response or use defaults
    const stats = ecoStats || {};
    const co2Saved = stats.totalCO2Saved || '0 kg';
    const distanceWalked = stats.totalDistanceWalked || '0 km';
    const publicTransportTrips = stats.totalPublicTransportTrips || 0;
    const averageEcoScore = stats.averageEcoScore || 0;

    return (
        <SafeAreaView style={styles.container}>
            <EcoHeader onPeriodChange={handlePeriodChange} selectedPeriod={selectedPeriod} />
            
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContent}
                keyboardShouldPersistTaps="handled"
                showsVerticalScrollIndicator={false}
            >
                {/* Stat Cards */}
                <View style={styles.cardsContainer}>
                    <View style={styles.statCardsRow}>
                        <StatCard
                            icon="leaf"
                            iconBgColor="#E0E7FF"
                            iconColor="#10b981"
                            label="CO₂ Saved"
                            value={co2Saved}
                            change="+2.1kg"
                            delay={100}
                        />
                        <StatCard
                            icon="walk"
                            iconBgColor="#F1F5F9"
                            iconColor="#6366f1"
                            label="Distance Walked"
                            value={distanceWalked}
                            change="+3.2km"
                            delay={200}
                        />
                    </View>
                    
                    <TransportCard 
                        publicTransportTrips={publicTransportTrips}
                        averageEcoScore={averageEcoScore}
                    />
                </View>

                {/* Weekly Eco Impact Chart */}
                <View style={styles.sectionContainer}>
                    <EcoChart data={stats} period={selectedPeriod} />
                </View>

                {/* Achievements/Badges */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Your Achievements</Text>
                    
                    {achievements.length > 0 ? (
                        achievements.map((achievement, index) => (
                            <AchievementCard
                                key={achievement.id || index}
                                title={achievement.title}
                                subtitle={achievement.subtitle}
                                icon={achievement.icon}
                                gradientColors={achievement.gradientColors || ["#10B981", "#059669"]}
                                isCompleted={achievement.isCompleted}
                                progress={achievement.progress}
                                delay={500 + (index * 100)}
                            />
                        ))
                    ) : (
                        // Fallback achievements if API doesn't return data
                        <>
                            <AchievementCard
                                title="Green Commuter"
                                subtitle="15 eco-friendly trips"
                                icon="medal"
                                gradientColors={["#10B981", "#059669"]}
                                delay={500}
                            />
                            
                            <AchievementCard
                                title="Step Master"
                                subtitle="10,000+ steps daily"
                                icon="trophy"
                                gradientColors={["#3B82F6", "#2563EB"]}
                                delay={600}
                            />
                            
                            <AchievementCard
                                title="Eco Warrior"
                                subtitle="25/30 eco actions"
                                icon="star"
                                isCompleted={false}
                                progress={83}
                                delay={700}
                            />
                        </>
                    )}
                </View>

                {/* Weekly Goals */}
                <View style={styles.sectionContainer}>
                    <Text style={styles.sectionTitle}>Weekly Goals</Text>
                    
                    <GoalCard
                        label="Walking Goal"
                        value="85%"
                        progress={0.85}
                        subLabel="12.8km / 15km"
                        delay={800}
                    />
                    
                    <GoalCard
                        label="Public Transport"
                        value="100%"
                        progress={1}
                        subLabel="17 / 15 trips"
                        delay={900}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F9FAFB',
    },
    loadingContainer: {
        flex: 1,
        backgroundColor: '#F9FAFB',
        justifyContent: 'center',
        alignItems: 'center',
    },
    loadingText: {
        marginTop: 16,
        color: '#10B981',
        fontFamily: 'Urbanist_400Regular',
        fontSize: 15,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingBottom: 32,
    },
    cardsContainer: {
        paddingHorizontal: 20,
        marginTop: 16,
        marginBottom: 20,
    },
    statCardsRow: {
        flexDirection: 'row',
        gap: 12,
    },
    sectionContainer: {
        paddingHorizontal: 20,
        marginBottom: 20,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
        fontFamily: 'Montserrat_700Bold',
    },
}); 