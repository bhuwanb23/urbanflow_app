import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function AchievementCard({ 
    title, 
    subtitle, 
    icon, 
    iconBgColor = 'rgba(255,255,255,0.2)', 
    iconColor = '#FFFFFF',
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
                            <Icon name={icon} size={24} color={iconColor} />
                        </View>
                        <View style={{ flex: 1 }}>
                            <Text style={styles.badgeTitle}>{title}</Text>
                            <Text style={styles.badgeSubtitle}>{subtitle}</Text>
                        </View>
                        <View style={styles.badgeCheckBg}>
                            <Icon name="check-decagram" size={24} color="#FFFFFF" />
                        </View>
                    </View>
                </LinearGradient>
            ) : (
                <View style={[styles.badgeCard, styles.incompleteCard]}>
                    <View style={styles.badgeRow}>
                        <View style={[styles.badgeIconBg, { backgroundColor: '#F1F5F9' }]}>
                            <Icon name={icon} size={24} color="#94A3B8" />
                        </View>
                        <View style={{ flex: 1, paddingRight: 16 }}>
                            <Text style={[styles.badgeTitle, { color: '#0F172A' }]}>{title}</Text>
                            <Text style={[styles.badgeSubtitle, { color: '#64748B' }]}>{subtitle}</Text>
                        </View>
                        <View style={{ alignItems: 'flex-end', width: 60 }}>
                            <Text style={{ color: '#0F172A', fontWeight: 'bold', fontSize: 14, fontFamily: 'Montserrat_700Bold' }}>{progress}%</Text>
                            <View style={styles.progressBarBg}>
                                <View style={[styles.progressBarFill, { width: `${progress}%` }]} />
                            </View>
                        </View>
                    </View>
                </View>
            )}
        </MotiView>
    );
}

const styles = StyleSheet.create({
    badgeCard: {
        borderRadius: 16,
        padding: 16,
        marginBottom: 12,
    },
    incompleteCard: {
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#E2E8F0', // Slate 200
    },
    badgeRow: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    badgeIconBg: {
        width: 48,
        height: 48,
        borderRadius: 24,
        marginRight: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    badgeTitle: {
        color: '#FFFFFF',
        fontWeight: 'bold',
        fontSize: 16,
        fontFamily: 'Urbanist_700Bold',
        marginBottom: 2,
    },
    badgeSubtitle: {
        color: 'rgba(255,255,255,0.9)',
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
    },
    badgeCheckBg: {
        alignItems: 'center',
        justifyContent: 'center',
    },
    progressBarBg: {
        width: '100%',
        height: 6,
        backgroundColor: '#E2E8F0',
        borderRadius: 3,
        marginTop: 6,
        overflow: 'hidden',
    },
    progressBarFill: {
        height: 6,
        backgroundColor: '#10B981',
        borderRadius: 3,
    },
});
