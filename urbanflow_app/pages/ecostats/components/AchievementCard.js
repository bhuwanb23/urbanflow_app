import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function AchievementCard({ 
    title, 
    subtitle, 
    icon, 
    iconBgColor = 'rgba(255,255,255,0.18)', 
    iconColor = '#fff',
    gradientColors = ["#10B981", "#059669"],
    isCompleted = true,
    progress = null,
    delay = 0 
}) {
    return (
        <MotiView 
            from={{ opacity: 0, translateY: 30 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            transition={{ type: 'timing', duration: 700, delay }}
        >
            {isCompleted ? (
                <LinearGradient colors={gradientColors} style={styles.badgeCard}>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badgeIconBg, { backgroundColor: iconBgColor }]}>
                            <Icon name={icon} size={20} color={iconColor} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.badgeTitle}>{title}</Text>
                            <Text style={styles.badgeSubtitle}>{subtitle}</Text>
                        </View>
                        <View style={styles.badgeCheckBg}>
                            <Icon name="check" size={16} color="#fff" />
                        </View>
                    </View>
                </LinearGradient>
            ) : (
                <Card style={[styles.badgeCard, styles.incompleteCard]}>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badgeIconBg, { backgroundColor: '#E5E7EB' }]}>
                            <Icon name={icon} size={20} color="#9CA3AF" />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={[styles.badgeTitle, { color: '#4B5563' }]}>{title}</Text>
                            <Text style={[styles.badgeSubtitle, { color: '#6B7280' }]}>{subtitle}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end' }}>
                            <Text style={{ color: '#4B5563', fontWeight: '600', fontSize: 13 }}>{progress}%</Text>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                            </View>
                        </View>
                    </View>
                </Card>
            )}
        </MotiView>
    );
}

const styles = StyleSheet.create({
    badgeCard: {
        borderRadius: 18,
        padding: 14,
        marginBottom: 12,
    },
    incompleteCard: {
        backgroundColor: '#F3F4F6',
        borderWidth: 2,
        borderStyle: 'dashed',
        borderColor: '#D1D5DB',
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeIconBg: {
        padding: 8,
        borderRadius: 14,
        marginRight: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeTitle: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
    },
    badgeSubtitle: {
        color: 'rgba(255,255,255,0.8)',
        fontSize: 12,
        fontFamily: 'Urbanist_400Regular',
    },
    badgeCheckBg: {
        backgroundColor: 'rgba(255,255,255,0.18)',
        borderRadius: 999,
        padding: 6,
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarBg: {
        width: 40,
        height: 6,
        backgroundColor: '#E5E7EB',
        borderRadius: 6,
        marginTop: 3,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 6,
        backgroundColor: '#10B981',
        borderRadius: 6,
    },
});
