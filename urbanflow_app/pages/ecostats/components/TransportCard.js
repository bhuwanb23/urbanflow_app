import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { MotiView } from 'moti';

export default function TransportCard({ publicTransportTrips, averageEcoScore }) {
    return (
        <MotiView 
            from={{ opacity: 0, translateY: 30 }} 
            animate={{ opacity: 1, translateY: 0 }} 
            transition={{ type: 'timing', duration: 700, delay: 300 }}
            style={{ marginTop: 16, width: '100%' }}
        >
            <View style={styles.transportCard}>
                <View style={styles.transportRow}>
                    <View style={styles.transportLeft}>
                        <View style={[styles.iconBg, { backgroundColor: '#ECFDF5' }]}>
                            <Icon name="bus" size={24} color="#10B981" />
                        </View>
                        <View>
                            <Text style={styles.transportLabel}>Public Transport Trips</Text>
                            <Text style={styles.transportValue}>{publicTransportTrips || 17}</Text>
                        </View>
                    </View>
                    <View style={styles.transportRight}>
                        <Text style={styles.transportChange}>+5 trips</Text>
                        <Text style={styles.transportPeriod}>this week</Text>
                    </View>
                </View>
            </View>
        </MotiView>
    );
}

const styles = StyleSheet.create({
    transportCard: {
        borderRadius: 16,
        padding: 16,
        backgroundColor: '#FFFFFF',
        borderWidth: 1,
        borderColor: '#F1F5F9', // Slate 100
        shadowColor: '#64748B',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.05,
        shadowRadius: 8,
        elevation: 2,
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
        width: 48,
        height: 48,
        borderRadius: 24,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    transportLabel: {
        color: '#64748B', // Slate 500
        fontSize: 13,
        fontFamily: 'Urbanist_600SemiBold',
        marginBottom: 2,
    },
    transportValue: {
        color: '#0F172A', // Slate 900
        fontSize: 24,
        fontWeight: 'bold',
        fontFamily: 'Montserrat_700Bold',
    },
    transportRight: {
        alignItems: 'flex-end',
    },
    transportChange: {
        color: '#10B981', // Emerald 500
        fontWeight: 'bold',
        fontSize: 14,
        fontFamily: 'Montserrat_700Bold',
        marginBottom: 2,
    },
    transportPeriod: {
        color: '#94A3B8', // Slate 400
        fontSize: 12,
        fontFamily: 'Urbanist_600SemiBold',
    },
});
