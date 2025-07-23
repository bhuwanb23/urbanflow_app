import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, SafeAreaView } from 'react-native';
import { Card, ProgressBar } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { LinearGradient } from 'expo-linear-gradient';
import { BarChart } from 'react-native-chart-kit';
import { MotiView } from 'moti';

const ecoData = [2.1, 1.8, 2.5, 1.9, 2.3, 2.8, 1.8];
const ecoLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const screenWidth = Dimensions.get('window').width;

export default function EcoStatsScreen() {
    return (
        <SafeAreaView style={{ flex: 1, backgroundColor: '#F9FAFB' }}>
            {/* Header */}
            <LinearGradient
                colors={["#10B981", "#059669"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.header}
            >
                <View style={styles.headerRow}>
                    <Icon name="arrow-left" size={24} color="#fff" />
                    <Icon name="bell" size={24} color="#fff" />
                </View>
                <Text style={styles.headerTitle}>Your Sustainability Stats</Text>
                <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                    <Text style={{ fontSize: 22, marginRight: 8 }}>🌱</Text>
                    <Text style={styles.headerSubtitle}>Keep up the great work!</Text>
                </View>
            </LinearGradient>

            {/* Stat Cards */}
            <View style={styles.cardsContainer}>
                <View style={{ flexDirection: 'row', gap: 16 }}>
                    {/* CO2 Saved */}
                    <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700, delay: 100 }}>
                        <Card style={styles.statCard}>
                            <View style={styles.cardIconRow}>
                                <View style={[styles.iconBg, { backgroundColor: '#D1FAE5' }]}>
                                    <Icon name="leaf" size={22} color="#10B981" />
                                </View>
                            </View>
                            <Text style={styles.cardLabel}>CO₂ Saved</Text>
                            <Text style={styles.cardValue}>14.2 kg</Text>
                            <View style={styles.cardChangeRow}>
                                <Icon name="arrow-up" size={14} color="#10B981" style={{ marginRight: 2 }} />
                                <Text style={styles.cardChangeText}>+2.1kg</Text>
                            </View>
                        </Card>
                    </MotiView>
                    {/* Distance Walked */}
                    <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700, delay: 200 }}>
                        <Card style={styles.statCard}>
                            <View style={styles.cardIconRow}>
                                <View style={[styles.iconBg, { backgroundColor: '#EFF6FF' }]}>
                                    <Icon name="walk" size={22} color="#3B82F6" />
                                </View>
                            </View>
                            <Text style={styles.cardLabel}>Distance Walked</Text>
                            <Text style={styles.cardValue}>12.8 km</Text>
                            <View style={styles.cardChangeRow}>
                                <Icon name="arrow-up" size={14} color="#10B981" style={{ marginRight: 2 }} />
                                <Text style={styles.cardChangeText}>+3.2km</Text>
                            </View>
                        </Card>
                    </MotiView>
                </View>
                {/* Public Transport Trips */}
                <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700, delay: 300 }}>
                    <Card style={[styles.statCard, { marginTop: 16, width: '100%' }]}>
                        <View style={{ flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' }}>
                            <View style={{ flexDirection: 'row', alignItems: 'center' }}>
                                <View style={[styles.iconBg, { backgroundColor: '#FFF7ED', padding: 12, marginRight: 12 }]}>
                                    <Icon name="bus" size={26} color="#F97316" />
                                </View>
                                <View>
                                    <Text style={[styles.cardLabel, { fontSize: 15 }]}>Public Transport Trips</Text>
                                    <Text style={styles.transportValue}>17</Text>
                                </View>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ color: '#10B981', fontWeight: '600', fontSize: 14 }}>+5 trips</Text>
                                <Text style={{ color: '#6B7280', fontSize: 12 }}>this week</Text>
                            </View>
                        </View>
                    </Card>
                </MotiView>
            </View>

            {/* Weekly Eco Impact Chart */}
            <View style={styles.sectionContainer}>
                <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700, delay: 400 }}>
                    <Card style={styles.chartCard}>
                        <Text style={styles.sectionTitle}>Weekly Eco Impact</Text>
                        <BarChart
                            data={{
                                labels: ecoLabels,
                                datasets: [
                                    { data: ecoData }
                                ]
                            }}
                            width={screenWidth - 56} // 24px padding on each side + 4px for card padding
                            height={180}
                            fromZero
                            showValuesOnTopOfBars
                            chartConfig={{
                                backgroundColor: '#fff',
                                backgroundGradientFrom: '#fff',
                                backgroundGradientTo: '#fff',
                                fillShadowGradient: '#10B981',
                                fillShadowGradientOpacity: 1,
                                decimalPlaces: 1,
                                color: (opacity = 1) => `rgba(16, 185, 129, ${opacity})`,
                                labelColor: (opacity = 1) => `#6B7280`,
                                barPercentage: 0.6,
                                propsForBackgroundLines: {
                                    stroke: '#F3F4F6',
                                },
                                propsForLabels: {
                                    fontSize: 12,
                                },
                            }}
                            style={{ marginVertical: 8, borderRadius: 8 }}
                            yAxisSuffix=""
                            yLabelsOffset={8}
                            withInnerLines={true}
                            withHorizontalLabels={true}
                        />
                    </Card>
                </MotiView>
            </View>

            {/* Achievements/Badges */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Your Achievements</Text>
                {/* Green Commuter */}
                <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700, delay: 500 }}>
                    <LinearGradient colors={["#10B981", "#059669"]} style={styles.badgeCard}>
                        <View style={styles.badgeRow}>
                            <View style={styles.badgeIconBg}>
                                <Icon name="medal" size={22} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.badgeTitle}>Green Commuter</Text>
                                <Text style={styles.badgeSubtitle}>15 eco-friendly trips</Text>
                            </View>
                            <View style={styles.badgeCheckBg}>
                                <Icon name="check" size={18} color="#fff" />
                            </View>
                        </View>
                    </LinearGradient>
                </MotiView>
                {/* Step Master */}
                <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700, delay: 600 }}>
                    <LinearGradient colors={["#3B82F6", "#2563EB"]} style={styles.badgeCard}>
                        <View style={styles.badgeRow}>
                            <View style={styles.badgeIconBg}>
                                <Icon name="trophy" size={22} color="#fff" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={styles.badgeTitle}>Step Master</Text>
                                <Text style={styles.badgeSubtitle}>10,000+ steps daily</Text>
                            </View>
                            <View style={styles.badgeCheckBg}>
                                <Icon name="check" size={18} color="#fff" />
                            </View>
                        </View>
                    </LinearGradient>
                </MotiView>
                {/* Eco Warrior Progress */}
                <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700, delay: 700 }}>
                    <Card style={[styles.badgeCard, { backgroundColor: '#F3F4F6', borderWidth: 2, borderStyle: 'dashed', borderColor: '#D1D5DB' }]}>
                        <View style={styles.badgeRow}>
                            <View style={[styles.badgeIconBg, { backgroundColor: '#E5E7EB' }]}>
                                <Icon name="star" size={22} color="#9CA3AF" />
                            </View>
                            <View style={{ flex: 1 }}>
                                <Text style={[styles.badgeTitle, { color: '#4B5563' }]}>Eco Warrior</Text>
                                <Text style={[styles.badgeSubtitle, { color: '#6B7280' }]}>25/30 eco actions</Text>
                            </View>
                            <View style={{ alignItems: 'flex-end' }}>
                                <Text style={{ color: '#4B5563', fontWeight: '600', fontSize: 14 }}>83%</Text>
                                <View style={styles.progressBarBg}>
                                    <View style={styles.progressBarFill} />
                                </View>
                            </View>
                        </View>
                    </Card>
                </MotiView>
            </View>

            {/* Weekly Goals */}
            <View style={styles.sectionContainer}>
                <Text style={styles.sectionTitle}>Weekly Goals</Text>
                {/* Walking Goal */}
                <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700, delay: 800 }}>
                    <Card style={styles.goalCard}>
                        <View style={styles.goalRow}>
                            <Text style={styles.goalLabel}>Walking Goal</Text>
                            <Text style={styles.goalValue}>85%</Text>
                        </View>
                        <ProgressBar progress={0.85} color="#10B981" style={styles.goalProgress} />
                        <Text style={styles.goalSubLabel}>12.8km / 15km</Text>
                    </Card>
                </MotiView>
                {/* Public Transport Goal */}
                <MotiView from={{ opacity: 0, translateY: 30 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 700, delay: 900 }}>
                    <Card style={styles.goalCard}>
                        <View style={styles.goalRow}>
                            <Text style={styles.goalLabel}>Public Transport</Text>
                            <Text style={styles.goalValue}>100%</Text>
                        </View>
                        <ProgressBar progress={1} color="#10B981" style={styles.goalProgress} />
                        <Text style={styles.goalSubLabel}>17 / 15 trips</Text>
                    </Card>
                </MotiView>
            </View>
        </SafeAreaView>
    );
}

const styles = StyleSheet.create({
    header: {
        paddingHorizontal: 24,
        paddingTop: 48,
        paddingBottom: 28,
        borderBottomLeftRadius: 32,
        borderBottomRightRadius: 32,
    },
    headerRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    headerTitle: {
        color: '#fff',
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 4,
        fontFamily: 'Montserrat_700Bold',
    },
    headerSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 14,
        fontFamily: 'Urbanist_400Regular',
    },
    cardsContainer: {
        paddingHorizontal: 24,
        marginTop: -32,
        marginBottom: 24,
    },
    statCard: {
        flex: 1,
        borderRadius: 20,
        padding: 16,
        marginRight: 0,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    cardIconRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 8,
    },
    iconBg: {
        padding: 8,
        borderRadius: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cardLabel: {
        color: '#6B7280',
        fontSize: 12,
        marginBottom: 2,
        fontFamily: 'Urbanist_400Regular',
    },
    cardValue: {
        color: '#111827',
        fontSize: 22,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_700Bold',
    },
    cardChangeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 4,
    },
    cardChangeText: {
        color: '#10B981',
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
    },
    transportValue: {
        color: '#111827',
        fontSize: 28,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_700Bold',
    },
    sectionContainer: {
        paddingHorizontal: 24,
        marginBottom: 24,
    },
    chartCard: {
        borderRadius: 20,
        padding: 16,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#111827',
        marginBottom: 12,
        fontFamily: 'Montserrat_700Bold',
    },
    badgeCard: {
        borderRadius: 20,
        padding: 16,
        marginBottom: 14,
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeIconBg: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        padding: 10,
        borderRadius: 16,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 15,
        fontFamily: 'Montserrat_700Bold',
    },
    badgeSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
    },
    badgeCheckBg: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 999,
        padding: 8,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarBg: {
        width: 48,
        height: 8,
        backgroundColor: '#E5E7EB',
        borderRadius: 8,
        marginTop: 4,
        overflow: 'hidden',
    },
    progressBarFill: {
        width: 40,
        height: 8,
        backgroundColor: '#10B981',
        borderRadius: 8,
    },
    goalCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 14,
        backgroundColor: '#fff',
        elevation: 2,
        shadowColor: '#000',
        shadowOpacity: 0.04,
        shadowRadius: 6,
        shadowOffset: { width: 0, height: 1 },
    },
    goalRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 8,
    },
    goalLabel: {
        color: '#374151',
        fontWeight: '500',
        fontSize: 15,
        fontFamily: 'Urbanist_400Regular',
    },
    goalValue: {
        color: '#10B981',
        fontWeight: '700',
        fontSize: 15,
        fontFamily: 'Montserrat_700Bold',
    },
    goalProgress: {
        height: 8,
        borderRadius: 8,
        marginBottom: 4,
        backgroundColor: '#E5E7EB',
    },
    goalSubLabel: {
        color: '#6B7280',
        fontSize: 13,
        marginTop: 2,
        fontFamily: 'Urbanist_400Regular',
    },
}); 