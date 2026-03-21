import React, { useState } from 'react';
import { View, Text, StyleSheet, Dimensions, TouchableOpacity, Platform } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

const { width, height } = Dimensions.get('window');

export default function EcoHeader({ onPeriodChange, selectedPeriod }) {
    const [animating, setAnimating] = useState(false);

    const handlePeriodSelect = (period) => {
        if (period === selectedPeriod || animating) return;
        
        setAnimating(true);
        onPeriodChange?.(period);
        setTimeout(() => setAnimating(false), 300);
    };

    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerRow}>
                <View style={styles.headerLeft}>
                    <Text style={styles.headerTitle}>Your Eco Stats</Text>
                    <View style={styles.headerSubtitleRow}>
                        <Text style={{ fontSize: 16, marginRight: 6 }}>🌱</Text>
                        <Text style={styles.headerSubtitle}>Keep up the great work!</Text>
                    </View>
                </View>
                <View style={styles.headerRight}>
                    <TouchableOpacity style={styles.settingsButton} onPress={() => console.log('Notifications pressed')}>
                        <Icon name="bell-outline" size={20} color="#0F172A" />
                        <View style={styles.notificationDot} />
                    </TouchableOpacity>
                </View>
            </View>
            
            {/* Period Selector with Animation */}
            <View style={styles.periodSelector}>
                <TouchableOpacity 
                    style={[styles.periodButton, selectedPeriod === 'week' && styles.periodButtonActive]}
                    onPress={() => handlePeriodSelect('week')}
                    activeOpacity={0.7}
                >
                    <MotiView
                        from={{ scale: selectedPeriod === 'week' ? 1.05 : 1 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'timing', duration: 200 }}
                    >
                        <Text style={[
                            styles.periodButtonText,
                            selectedPeriod === 'week' && styles.periodButtonTextActive
                        ]}>
                            Week
                        </Text>
                    </MotiView>
                    {selectedPeriod === 'week' && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.activeIndicator}
                        />
                    )}
                </TouchableOpacity>
                
                <TouchableOpacity 
                    style={[styles.periodButton, selectedPeriod === 'month' && styles.periodButtonActive]}
                    onPress={() => handlePeriodSelect('month')}
                    activeOpacity={0.7}
                >
                    <MotiView
                        from={{ scale: selectedPeriod === 'month' ? 1.05 : 1 }}
                        animate={{ scale: 1 }}
                        transition={{ type: 'timing', duration: 200 }}
                    >
                        <Text style={[
                            styles.periodButtonText,
                            selectedPeriod === 'month' && styles.periodButtonTextActive
                        ]}>
                            Month
                        </Text>
                    </MotiView>
                    {selectedPeriod === 'month' && (
                        <MotiView
                            from={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            style={styles.activeIndicator}
                        />
                    )}
                </TouchableOpacity>
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    headerContainer: {
        paddingTop: Platform.OS === 'android' ? 20 : 20,
        paddingBottom: 16,
        paddingHorizontal: 24,
        backgroundColor: '#FFFFFF',
        borderBottomWidth: 1,
        borderBottomColor: '#F1F5F9',
    },
    headerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    headerLeft: {
        flex: 1,
    },
    headerRight: {
        alignItems: 'center',
    },
    headerTitle: {
        fontSize: 24,
        fontFamily: 'Poppins_700Bold',
        color: '#0F172A', // Slate 900
        marginBottom: 4,
        letterSpacing: -0.5,
    },
    headerSubtitleRow: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 4,
    },
    headerSubtitle: {
        fontSize: 14,
        color: '#64748B', // Slate 500
        fontFamily: 'Urbanist_400Regular',
    },
    settingsButton: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: '#F8FAFC', // Slate 50
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
        borderColor: '#E2E8F0', // Slate 200
    },
    notificationDot: {
        position: 'absolute',
        top: 10,
        right: 10,
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#EF4444',
        borderWidth: 1,
        borderColor: '#FFFFFF',
    },
    periodSelector: {
        flexDirection: 'row',
        gap: 8,
        backgroundColor: '#F1F5F9',
        padding: 4,
        borderRadius: 12,
        alignSelf: 'flex-start',
    },
    periodButton: {
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 10,
        position: 'relative',
    },
    periodButtonActive: {
        backgroundColor: '#FFFFFF',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
        elevation: 2,
    },
    periodButtonText: {
        fontSize: 14,
        fontFamily: 'Urbanist_600SemiBold',
        color: '#64748B',
        letterSpacing: 0.3,
    },
    periodButtonTextActive: {
        color: '#10B981',
        fontWeight: 'bold',
    },
    activeIndicator: {
        position: 'absolute',
        bottom: 4,
        left: 0,
        right: 0,
        height: 2,
        backgroundColor: '#10B981',
        borderRadius: 1,
    },
});
