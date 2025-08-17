import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Card } from 'react-native-paper';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function TransportCard() {
    return (
        <MotiView 
            from={{ opacity: 0, translateY: 30 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            transition={{ type: 'timing', duration: 700, delay: 300 }}
            style={{ marginTop: 16, width: '100%' }}
        >
            <Card style={[styles.transportCard, styles.statCardShadow]}>
                <View style={styles.transportRow}>
                    <View style={styles.transportLeft}>
                        <View style={[styles.iconBg, { backgroundColor: '#E0E7FF', padding: 10, marginRight: 12 }]}>
                            <Icon name="bus" size={24} color="#6366f1" />
                        </View>
                        <View>
                            <Text style={styles.transportLabel}>Public Transport Trips</Text>
                            <Text style={styles.transportValue}>17</Text>
                        </View>
                    </View>
                    <View style={styles.transportRight}>
                        <Text style={styles.transportChange}>+5 trips</Text>
                        <Text style={styles.transportPeriod}>this week</Text>
                    </View>
                </View>
            </Card>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    transportCard: {
        borderRadius: 18,
        padding: 14,
        backgroundColor: '#fff',
        elevation: 3,
        shadowColor: '#000',
        shadowOpacity: 0.06,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
    },
    statCardShadow: {
        borderWidth: 1,
        borderColor: '#E5E7EB',
        shadowColor: '#6366f1',
        shadowOpacity: 0.10,
        shadowRadius: 12,
        shadowOffset: { width: 0, height: 4 },
        elevation: 5,
    },
    transportRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    transportLeft: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    iconBg: {
        borderRadius: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    transportLabel: {
        color: '#6B7280',
        fontSize: 13,
        fontFamily: 'Urbanist_400Regular',
    },
    transportValue: {
        color: '#111827',
        fontSize: 26,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_700Bold',
    },
    transportRight: {
        alignItems: 'flex-end',
    },
    transportChange: {
        color: '#10b981',
        fontWeight: '600',
        fontSize: 13,
        fontFamily: 'Montserrat_600SemiBold',
    },
    transportPeriod: {
        color: '#6B7280',
        fontSize: 11,
        fontFamily: 'Urbanist_400Regular',
    },
});
